/**
 * 发布&同步工具相关方法
 * 先简单的来，用对称加密。多考虑一些通用性。
 *
 * 数据只支付JSON（如果是纯数据，自行转成base64字串） 以后或可考虑protobuf？
 * JSON串再进行gzip压缩，再进行对称加密（AES）
 *
 * Created by cyrilluce on 2016/7/24.
 */
import { createCipher, createDecipher } from 'crypto';
import zlib from 'zlib';
import * as securityConfig from '../securityConfig';
import {promisify} from "./promisify";
const key = securityConfig.deployKey;
const alg = 'aes256';

/**
 * 将数据对象转为Stream
 * @param data
 * @param callback
 * @returns {ReadbleStream}
 */
export function pack(data): NodeJS.ReadableStream {
    var cipher = createCipher(alg, key);
    var zipper = zlib.createGzip();
    var content = JSON.stringify(data);
    zipper.pipe(cipher);
    zipper.write(content);
    zipper.end();

    return cipher;
};

export function unpack(stream: NodeJS.ReadableStream, callback:(err: Error|null, data?:any)=>void) {
    var cipher = createDecipher(alg, key);
    var zipper = zlib.createGunzip();

    stream.pipe(cipher).pipe(zipper);

    var bufs = [];
    zipper.on('data', function (d) { bufs.push(d); });
    zipper.on('end', function () {
        var buf = Buffer.concat(bufs);
        var content = buf.toString(),
            data;
        try {
            data = JSON.parse(content)
        } catch (e) {
            callback(e);
            return;
        }
        callback(null, data);
    });
    zipper.on('error', callback);
}

export const unpackAsync = promisify<any>(unpack);
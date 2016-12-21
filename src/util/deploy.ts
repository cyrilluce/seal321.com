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
import * as zlib from 'zlib';
// crypto.pbkdf2Sync('o2p13c8p9sflghw45va', 'megapolis-assistor', 10000, 256).toString('hex')
const key = new Buffer('7ba2efde31049fc53b75fe514edbf28510908c63097d55cdfa48852ddd26e0bc6d2438dfd8bbb981433cc8ab6ab1531b5641819460f7c16078713a8354db0f9f4d60cbebb6425f0f28e5b6d86876069024d9872fffc1b539b958ce62a82b9e7e2932584c63f6eda286f2867f384c727794f0712c588e9662e5a4600e4149cf1e25c48a18d2e36fb01cadde2bf17b1ba7cf966ba1bc407dd5d2dc214eb755ad15fc3b398718724083304a6ff8c639fd1ff51c1201df4aff09aea6de8b056c7acfde837efba27207d58a9e2936146278143ecd8b26fb8179e01ca7602910a429c81fdd760fcf79d0dd3a94a129dc59185295428e9fbeb4ecd8f412b7012852aff1', 'hex');
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
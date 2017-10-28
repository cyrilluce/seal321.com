import * as fs from 'mz/fs';
import { join as pathJoin } from 'path';
import * as localConfig from '../../src/localConfig';
const EdtPacker = require('../packers/Edt');

async function execute(){
    let data = await fs.readFile(pathJoin(localConfig.sampleDir, 'us/source/etc/monster.edt.0.242'));
    const edtPacker = new EdtPacker();
    data = edtPacker.unpack(data);
    await fs.writeFile(pathJoin(localConfig.sampleDir, 'monster._edt'), data)
}

execute();
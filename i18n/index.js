/**
 * 国际化
 * Created by cluezhang on 2016/8/15.
 */
let loc = 'en';
// export default function getTranslator(loc){
    const dict = require('./'+loc);
    export default function translate(str, ...args){
        str = dict[str] || str;
        return str.replace(/\{(\d+|#\w+#)\}/g, (m, i)=>{
            i = parseInt(i, 10);
            if(isNaN(i)){
                return '';
            }
            if(i>=0 && i<args.length){
                return args[i]
            }
            return m;
        })
    }
// }
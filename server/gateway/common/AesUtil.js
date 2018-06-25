const DataMixer = require('./DataMixer');
const KeyEncryptor = require('./KeyEncryptor');
const crypto = require('crypto');
const GzipUtil = require('./GzipUtil');

const KEY = Buffer.from([-64, -76, 7, 81, -92, -94, 98, -77, 48, 126, 60, -127, 70, -59, -14, 117]);
const IV = Buffer.from([105, -46, 85, -72, 50, -98, -84, -44, 12, 42, -100, -117, 104, 117, -121, 5]);

class AesUtil {
    static decrypt(src) {
        const res = DataMixer.parse(src);
        const key = res[0];
        const encrypted = res[1];

        const keyEncryptor = new KeyEncryptor(Buffer.from(KEY));
        const cipherKey = keyEncryptor.encrypt(key, 0);

        const decipher = crypto.createDecipheriv('AES-128-CBC', cipherKey, Buffer.from(IV));
        var decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted;
    }
}

module.exports = AesUtil;
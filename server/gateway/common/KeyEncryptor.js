const EncryptorTransform = require('./EncryptorTransform');

class KeyEncryptor {
    constructor(key) {
        this.transform = new EncryptorTransform(key);
    }

    encrypt(buffer, offset) {
        if(!buffer) {
            throw "buffer";
        }

        if(offset < 0) {
            throw "The argument offset is negative.";
        }

        if(buffer.length - offset < 16) {
            throw "The buffer.Length is less than argument count.";
        }

        let block = Buffer.alloc(16);
        buffer.copy(block, 0, offset, offset + 16);
        this.transform.subBytes(block);

        for(let i=0; i<3; i++) {
            this.transform.xor(block);
            this.transform.shiftRow(block);
            this.transform.shiftKeyColumn();
            this.transform.keySubBytes();
        }

        return block;
    }
}

module.exports = KeyEncryptor;
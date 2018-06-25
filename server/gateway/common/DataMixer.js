class DataMixer {
    static parse(buffer) {
        if(!buffer) {
            throw "source";
        }

        let key = Buffer.alloc(16);
        let encrypted = Buffer.alloc(buffer.length - 16);
        let keysPosition = new Array(16);  // length = 16
        let step = 0;

        for(let i=0, l=buffer.length; i<l; i++) {
            let theByte = buffer[i];
            step += 0xff & theByte;
        }

        let offset = 0;
        let times = 16;
        let count = buffer.length - 16;
        this.calculateKeysPosition(offset, step, count, times, keysPosition);
        this.pick(buffer, keysPosition, key, encrypted);

        return [key, encrypted];
    }

    static pick(buffer, keysPosition, key, encrypted) {
        for(let index = key.length - 1; index >= 0; --index) {
            let keyPosition = keysPosition[index];
            key[index] = buffer[keyPosition];
            buffer.copy(buffer, keyPosition, keyPosition + 1, buffer.length)
        }

        buffer.copy(encrypted, 0, 0, encrypted.length);
    }

    static calculateKeysPosition(offset, step, count, times, keysPosition) {
        if(times > 0) {
            offset = (offset + step) % count + 1;
            keysPosition[keysPosition.length - times] = offset;
            ++count;
            --times;
            this.calculateKeysPosition(offset, step, count, times, keysPosition);
        }
    }
}

module.exports = DataMixer;

const BitHelper = require('./BitHelper');

class EncryptorTransform {
    constructor(key) {
        this.key = key;
        this.box = Buffer.from([99, 124, 119, 123, -14, 107, 111, -59, 48, 1, 103, 43, -2, -41, -85, 118, -54, -126, -55, 125, -6, 89, 71, -16, -83, -44, -94, -81, -100, -92, 114, -64, -73, -3, -109, 38, 54, 63, -9, -52, 52, -91, -27, -15, 113, -40, 49, 21, 4, -57, 35, -61, 24, -106, 5, -102, 7, 18, -128, -30, -21, 39, -78, 117, 9, -125, 44, 26, 27, 110, 90, -96, 82, 59, -42, -77, 41, -29, 47, -124, 83, -47, 0, -19, 32, -4, -79, 91, 106, -53, -66, 57, 74, 76, 88, -49, -48, -17, -86, -5, 67, 77, 51, -123, 69, -7, 2, 127, 80, 60, -97, -88, 81, -93, 64, -113, -110, -99, 56, -11, -68, -74, -38, 33, 16, -1, -13, -46, -51, 12, 19, -20, 95, -105, 68, 23, -60, -89, 126, 61, 100, 93, 25, 115, 96, -127, 79, -36, 34, 42, -112, -120, 70, -18, -72, 20, -34, 94, 11, -37, -32, 50, 58, 10, 73, 6, 36, 92, -62, -45, -84, 98, -111, -107, -28, 121, -25, -56, 55, 109, -115, -43, 78, -87, 108, 86, -12, -22, 101, 122, -82, 8, -70, 120, 37, 46, 28, -90, -76, -58, -24, -35, 116, 31, 75, -67, -117, -118, 112, 62, -75, 102, 72, 3, -10, 14, 97, 53, 87, -71, -122, -63, 29, -98, -31, -8, -104, 17, 105, -39, -114, -108, -101, 30, -121, -23, -50, 85, 40, -33, -116, -95, -119, 13, -65, -26, 66, 104, 65, -103, 45, 15, -80, 84, -69, 22]);
    }

    subBytes(buffer) {
        for(let i=0, l=buffer.length; i<l; i++) {
            buffer[i] = this.box[0xff & buffer[i]];
        }
    }

    xor(block) {
        for(let index = 0; index < 16; ++index) {
            block[index] = (255 & block[index] ^ 255 & this.key[index]);
        }
    }

    shiftRow(buffer) {
        if(!buffer || buffer.length != 16) {
            throw "The buffer.Length must be 16.";
        }

        for(let index = 0; index < 12; index += 4) {
            let value = this.toUInt32(buffer, index);
            value = this.rotatoryShip(value, (index / 4 + 1) * 8);
            let block = this.toBytes(value);
            buffer[index] = block[0];
            buffer[index + 1] = block[1];
            buffer[index + 2] = block[2];
            buffer[index + 3] = block[3];
        }
    }

    shiftKeyColumn() {
        this.shiftColumn(this.key);
    }

    shiftColumn(buffer) {
        if(!buffer || buffer.length != 16) {
            throw "The buffer.Length must be 16.";
        }

        let block = Buffer.alloc(4);

        for(let index = 0; index < 3; ++index) {
            block[0] = buffer[index];
            block[1] = buffer[4 + index];
            block[2] = buffer[8 + index];
            block[3] = buffer[12 + index];
            let value = this.toUInt32(block, 0);
            value = this.rotatoryShip(value, (index + 1) * 8);
            block = this.toBytes(value);
            buffer[index] = block[0];
            buffer[4 + index] = block[1];
            buffer[8 + index] = block[2];
            buffer[12 + index] = block[3];
        }
    }

    keySubBytes() {
        for(let index = 0; index < this.key.length; ++index) {
            this.key[index] = this.box[255 & this.key[index]];
        }
    }

    toUInt32(buffer, offset) {
        if(!buffer) {
            throw "buffer";
        }

        if(offset < 0) {
            throw "The argument offset is negative.";
        }

        if(buffer.length - offset < 4) {
            throw "Invalid argument";
        }

        return buffer.readUInt32BE(offset); // 这里的实现直接使用NodeJs的api，不复制java的实现，原因是位运算js和java不一致
    }

    rotatoryShip(value, shipCount) {
        // let result = value >> 32 - shipCount | 4294967295 & value << shipCount;
        let result = value.rightShift(32 - shipCount).or((4294967295).and(value.leftShift(shipCount)));
        return result;
    }

    toBytes(uint) {
        return Buffer.from([uint >> 24, uint >> 16, uint >> 8, uint]);
    }
}

module.exports = EncryptorTransform;
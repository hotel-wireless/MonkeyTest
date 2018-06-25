class SerializeReader {
    constructor(data) {
        this.data = data;
        this.currentIndex = 0;
    }

    readString(length) {
        let result = "";
        const piece = this.data.slice(this.currentIndex, this.currentIndex + length);

        try {
            result = piece.toString("utf-8").trim()
        } catch(e) {}

        this.currentIndex += length;
        return result;
    }

    readInt(length) {
        let result = 0;
        const piece = this.readString(length);

        if(piece.length > 0) {
            result = parseInt(piece);
        }

        return result;
    }
}

module.exports = SerializeReader;
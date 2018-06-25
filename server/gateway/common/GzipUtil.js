const zlib = require('zlib');

class GzipUtil {
    static uncompress(data) {
        return zlib.unzipSync(data);
    }
}

module.exports = GzipUtil;
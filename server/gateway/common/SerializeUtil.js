const AesUtil = require('./AesUtil');
const GzipUtil = require('./GzipUtil');
const RequestHead = require('./model/RequestHead');
const ProtocolHeadUtil = require('./ProtocolHeadUtil');
const Request = require('./model/Request');

const REQUEST_MAX_LENGTH = 8192;

class SerializeUtil {
    deCodeRequest(requestData) {
        try {
            const request = new Request();
            const _preLength = 14;

            if(!requestData || requestData.length <= _preLength) {
                throw "the requestData is too large for the server";
            }

            let lengthInfo = requestData.slice(0, 0+8);

            try {
                let requestLength = parseInt(lengthInfo.toString("utf-8"));
                if(requestLength > REQUEST_MAX_LENGTH) {
                    throw "the requestData is too large for the server";
                }
            } catch(ex) {
                console.dir(ex);
            }

            const compressType = parseInt(requestData.slice(8, 8+4).toString("utf-8"));   // 1 - 仅压缩 2 - 加密 & 压缩
            let contentData = requestData.slice(14);
            if(compressType == 1) {
                contentData = GzipUtil.uncompress(contentData);
            } else if(compressType == 2) {
                contentData = GzipUtil.uncompress(AesUtil.decrypt(contentData))
            }

            let head = new RequestHead();
            ProtocolHeadUtil.deSerializeRequestHead(contentData, head);
            request.head = head;
            request.body = contentData.slice(182);

            return request;
        } catch(e) {
            console.log("Invalid requestData");
            console.dir(e);
        }
    }

    // protobuf(buffer) {
    //     var protobuf = require("protobufjs");
    //     var fs  = require('fs');
    //     const prefixPath = "D:\\project\\ProtoBuf\\Contract\\";
    //
    //     let filenames = this.findServiceFilenames("17100101").filter(filename=>filename.includes(".proto")).map(filename=>prefixPath+filename);
    //
    //     protobuf.load(filenames, function(err, root) {
    //         if (err) throw err;
    //
    //         let HotelListSearchV2Request = root.lookup("HotelListSearchV2Request");
    //         let result = HotelListSearchV2Request.decode(buffer);
    //         console.log(result);
    //     });
    //
    // }
    //
    // findServiceFilenames(serviceCode) {
    //     const serviceCodeFileName = serviceCode + ".proto";
    //     const all = this.findImports(serviceCodeFileName, [serviceCodeFileName]);
    //     return all;
    // }
    //
    // findImports(filename, parents=[]) {
    //     var fs  = require('fs');
    //     var _ = require('underscore');
    //
    //     const prefixPath = "D:\\project\\ProtoBuf\\Contract\\";
    //     const content = fs.readFileSync(prefixPath + filename, "utf-8");
    //     const protoes = content.split("\n").filter(line=>line.includes("import ")).map(line=>{
    //         return line.match(/".*"/)[0].replace(/"/g, '');
    //     });
    //
    //     const needDeepProtoes = _.difference(protoes, parents);
    //     const all = needDeepProtoes.concat(parents);
    //
    //     return _.union(_.flatten(needDeepProtoes.map(proto=>this.findImports(proto, all))), all);
    // }
}

module.exports = new SerializeUtil();
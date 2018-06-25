const SerializeReader = require('./serializer/sotp/SerializeReader');

class ProtocolHeadUtil {
    static deSerializeRequestHead(head, dataBean) {
        const reader = new SerializeReader(head);

        reader.readInt(2);
        dataBean.systemCode = reader.readString(2);
        dataBean.language = reader.readString(2);
        dataBean.userId = reader.readString(20);
        dataBean.clientId = reader.readString(20);
        dataBean.clientToken = reader.readString(20);
        dataBean.clientVersion = reader.readString(8);
        dataBean.sourceId = reader.readString(8);
        dataBean.exSourceID = reader.readString(8);
        dataBean.serviceCode = reader.readString(8);
        dataBean.messageNumber = reader.readString(20);
        dataBean.authToken = reader.readString(64);
    }
}

module.exports = ProtocolHeadUtil;

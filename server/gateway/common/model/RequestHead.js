class RequestHead {
    constructor() {
        this.systemCode = "";
        this.language = "";
        this.userId = "";
        this.clientId = "";
        this.clientToken = "";
        this.clientVersion = "";
        this.sourceId = "";
        this.exSourceID = "";
        this.serviceCode = "";
        this.messageNumber = "";
        this.authToken = "";
    }

    toString() {
        return JSON.stringify({
            systemCode: this.systemCode,
            language: this.language,
            userId: this.userId,
            clientId: this.clientId,
            clientToken: this.clientToken,
            clientVersion: this.clientVersion,
            sourceId: this.sourceId,
            exSourceID: this.exSourceID,
            serviceCode: this.serviceCode,
            messageNumber: this.messageNumber,
            authToken: this.authToken
        }, null, 4);
    }
}

module.exports = RequestHead;
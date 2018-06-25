function newServerRequest(id, url, remoteAddress, serverType, serviceCode) {
    return {
        type: "NEW_SERVER_REQUEST",
        data: {
            id,
            url,
            serverType,
            remoteAddress,
            serviceCode
        }
    }
}

function newClientRequest(id, url) {
}

function newClientResponse(id, url, statusCode, size, serverType, isFuse=false) {
    return {
        type: "NEW_CLIENT_RESPONSE",
        data: {
            id,
            url,
            statusCode,
			size,
            serverType,
            isFuse
        }
    }
}

function newClientResponseData(id, frame) {
    return {
        type: 'NEW_CLIENT_RESPONSE_DATA',
        data: {
            id,
            frame
        }
    }
}

function newServerResponse(id, statusCode, url) {
}

module.exports = {
    newServerRequest,
    newClientRequest,
    newClientResponse,
    newClientResponseData,
    newServerResponse
};

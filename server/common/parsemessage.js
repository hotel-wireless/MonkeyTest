const Url = require('url');

const parseMessage = function(incomingMessage) {
    const { headers, method } = incomingMessage;
    const { host } = headers;
    let { path, href, hostname, port } = Url.parse(incomingMessage.url.startsWith("http") ? incomingMessage.url : `http://${incomingMessage.url}`);
    const remoteAddress = incomingMessage.connection.remoteAddress;

    port = parseInt(port) || 80;

    href = _prefixSchema(href, port);

    return { host, hostname, port, method, headers, path, href, remoteAddress };
};

function _prefixSchema(href, port) {
    let schema = port === 443 ? "https" : "http";

    return schema + "://" + href.replace("http://", "").replace("https://", "");
}

module.exports = parseMessage;
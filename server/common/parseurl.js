const URL = require('url');

function parseUrl(requestUrl) {
    return URL.parse((requestUrl.startsWith("http://") ? "" : "http://") + requestUrl);
}

module.exports = parseUrl;

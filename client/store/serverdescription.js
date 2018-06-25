const ipMap = {
    "10.2.6.116": "南通FWS测试环境Clogging Collector",
    "10.2.6.117": "南通FWS测试环境Clogging Collector",
    "10.2.35.8": "cat的fws portal",
    "10.2.59.153": "框架南通FAT环境CAT应用服务器",
    "10.2.59.154": "框架南通FAT环境CAT应用服务器",
    "10.2.73.255": "框架kafka服务器",
    "10.2.75.168": "框架南通FWS环境CAT应用服务器",
    "10.15.144.95": "qconfig服务端",
    "10.28.88.79": "qconfig服务端",
    "10.2.73.36": "hermes",
    "10.2.75.167": "作为框架南通FWS环境CAT应用服务器",
    "10.2.7.83": "hermes"
};

function explain(host) {
    const ip = host.split(":")[0];

    return ipMap[ip] || "";
}

module.exports = explain;

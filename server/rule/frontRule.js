const URL = require("url");

function rule(serverReq) {
    const parsedUrl = URL.parse(serverReq.url);
    const url = parsedUrl.href;
    const hostname = parsedUrl.hostname;
    const headers = serverReq.headers;

    // 放行框架服务
    if(url.includes("GetRouteDataForGateway")) {
        return false;
    }

    const whiteList = [
        "17100101",    // 酒店列表查询(国内)
        "15100102",    // 酒店列表查询(海外)
        "17100202",    // 房型列表查询(国内)
        "15002103",    // 房型列表查询(海外)
        "17020101",    // 可订检查(国内)
        "15020102",    // 可订检查(海外)
        "17000301",    // 订单生成(国内)
        "15000301"     // 订单生成(海外)
    ];

    if(url.includes("/nativeapi/mobile")) {
        let serviceCode = headers.servicecode;

        if(whiteList.includes(serviceCode)) {
            return false;
        }
    }

    return true;
}

module.exports = rule;

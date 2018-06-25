const URL = require("url");

function rule(serverReq) {
    const parsedUrl = URL.parse(serverReq.url);
    const url = parsedUrl.href;
    const hostname = parsedUrl.hostname;

    // 按主机名放行
    const whiteHostnames = [

        // 放行框架服务
        "ws.soa.fws.qa.nt.xxxxxxx.com",               // SOA框架服务。 例如:
                                                        // http://ws.soa.fws.qa.nt.xxxxxxx.com/hystrix-config/api/GetApplicationConfig.json
                                                        // http://ws.soa.fws.qa.nt.xxxxxxx.com/registry/api/LookupServiceUrl.json
        "ws.soa4j.fx.fws.qa.nt.xxxxxxx.com",  		// SOA框架服务 for Java。
        "soa.fws.qa.nt.xxxxxxx.com",                  // SOA框架服务。例如：http://soa.fws.qa.nt.xxxxxxx.com/SOA.ESB/Ctrip.SOA.ESB.asmx
        "10.2.66.75",                                   // artemis SOA相关服务 http://10.2.66.75:8080/configs/111307/NTGXH/FX.soa.caravan.ribbon?dataCenter=NTGXH&ip=10.2.58.136
        //"ws.fx.fws.qa.nt.xxxxxxx.com",              // CRedis配置服务。例如：http://ws.fx.fws.qa.nt.xxxxxxx.com/credis/configapi/getcluster/HotelWireless
        "cat.fws.qa.nt.xxxxxxx.com",                  // CAT的服务
        "ws.config.framework.fws.qa.nt.xxxxxxx.com",  // 框架服务。例如：http://ws.config.framework.fws.qa.nt.xxxxxxx.com/Configws/ServiceConfig/ConfigInfoes/Get/921807
        "ws.titan.fws.qa.nt.xxxxxxx.com",             // 数据库连接服务
        "ws.config.fat381.qa.nt.xxxxxxx.com", // 未知服务。例如：http://ws.config.fat381.qa.nt.xxxxxxx.com/services/config?appId=111307&ip=10.2.58.136
        "bridge.soa.uat.qa.nt.xxxxxxx.com"  // herms temperate qit
    ];

    if(whiteHostnames.includes(hostname)) {
        return false;
    }

    // CRedis欺骗
    if(url.includes("http://ws.fx.fws.qa.nt.xxxxxxx.com/credis/configapi/getcluster/HotelWireless")) {
        return '{"AutoSwitch":0,"Groups":[{"Cluster":null,"ClusterID":3389,"Env":"","ID":206,"Masters":null,"ReadServers":null,"Servers":null,"SubEnv":""}],"ID":3389,"MD5Index":null,"MasterIDC":null,"Name":"HotelWireless","RetryCount":0,"RetryInterval":0,"RetryMethod":0,"Servers":[{"CanRead":true,"Cluster":null,"DBNumber":10,"Env":"","Group":null,"GroupID":206,"ID":55,"IPAddress":"10.2.75.36","IsPipelined":false,"Parent":null,"ParentID":0,"Port":6397,"ReceiveTimeout":-1,"SendTimeout":-1},{"CanRead":true,"Cluster":null,"DBNumber":10,"Env":"","Group":null,"GroupID":206,"ID":56,"IPAddress":"10.2.75.36","IsPipelined":false,"Parent":null,"ParentID":55,"Port":6397,"ReceiveTimeout":-1,"SendTimeout":-1}],"Status":1,"SwitchIDC":null,"Timestamp":"2017-6-9 16:57:50","UsingIDC":0}';
    }

    // artemis SOA框架相关服务。例如：例如：http://artemis.soa.fx.fws.qa.nt.xxxxxxx.com/artemis-service/api/cluster/up-discovery-nodes.json
    if(url.includes("artemis-service")) {
        return false;
    }

    // herms qit
    if(url.includes("metaserver") || url.includes("meta")) {
        return false;
    }

    // 放行 查询服务
    if(url.includes("/hotel.product.searchservice/") || url.includes("SearchHotelData")) {
        return false;
    }

    // 放行 房价下载，可订检查和订单生成 SOA2.0
    const canPass = ["HotelRatePlan", "hotelRatePlan", "HotelAvail", "HotelRes", "HotelModify"].some((fragment)=>url.includes(fragment));
    if(canPass) {
        return false;
    }

    // 可订检查,订单生成 SOA1.0
    if(url.includes("/hotel-booking-reservationws/reservationservice.asmx")) {
        return false;
    }

    //Java版订单生成
    if(url.includes("Hotel-Booking-ReservationWS/api/reservationservice")) {
        return false;
    }

    return true;
}

module.exports = rule;
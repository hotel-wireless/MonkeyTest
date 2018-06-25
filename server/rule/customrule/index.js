/**
 * Created by lei.gu on 2017/9/18.
 */

class CustomRule {
    generateCode(ruleList) {
        const template = `const URL = require("url");

function rule(serverReq) {
    const parsedUrl = URL.parse(serverReq.url);
    const url = parsedUrl.href;
    const hostname = parsedUrl.hostname;

    const ruleList = ${JSON.stringify(ruleList || [])};
    
    return !ruleList.includes(url);
}

module.exports = rule;`;
        return template;
    }
}

module.exports = CustomRule;
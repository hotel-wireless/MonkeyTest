const express = require('express');
const expressServer = express();
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
const requireUncached = require('require-uncached');
const CustomRule = require('../rule/customrule');

const customRule = new CustomRule();

expressServer.use(express.static(path.resolve(`${__dirname}/../public`)));
expressServer.use(bodyParser.urlencoded({ extended: true }));

expressServer.get("/rule/:filename.js", (req, res)=>{
    let fileContent = "错误：读取不到规则文件";
    const { filename } = req.params;

    try {
        fileContent = fs.readFileSync(path.join(__dirname, "..", "data", "rule", `${filename}.js`), "utf8");
    } catch(e) {
        try {
            fileContent = fs.readFileSync(path.join(__dirname, "..", "rule", `${filename}.js`), "utf8");
        } catch(e) {
            console.error(e);
        }
    }

    res.end(fileContent);
});

expressServer.post("/rule/customRule.js", (req, res) => {
    let { data } = req.body;
    const filename = "customRule";

    if(!data) {
        res.json({ status:false, message: "请求中没有规则数据" });
    }

    try {
        const ruleList = customRule.generateCode(JSON.parse(data));
        fs.writeFileSync(path.join(__dirname, "..", "data", "rule", `${filename}.temp.js`), ruleList, "utf8");
        requireUncached(`../data/rule/${filename}.temp`);  // 尝试加载
        fs.writeFileSync(path.join(__dirname, "..", "data", "rule", `${filename}.js`), ruleList, "utf8");
    } catch(e) {
        res.json({ status: false, message: e.toString() });
        return;
    }

    res.json({ status: true, message: "已保存！" });
});

expressServer.post("/rule/:filename.js", (req, res)=>{
    let { data } = req.body;
    const { filename } = req.params;

    if(!data) {
        res.json({ status:false, message: "请求中没有规则数据" });
    }

    try {
        fs.writeFileSync(path.join(__dirname, "..", "data", "rule", `${filename}.temp.js`), data, "utf8");
        requireUncached(`../data/rule/${filename}.temp`);  // 尝试加载
        fs.writeFileSync(path.join(__dirname, "..", "data", "rule", `${filename}.js`), data, "utf8");
    } catch(e) {
        res.json({ status: false, message: e.toString() });
        return;
    }

    res.json({ status: true, message: "已保存！" });
});

module.exports = expressServer;
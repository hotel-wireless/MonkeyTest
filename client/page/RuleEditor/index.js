const React = require('react');
const Codemirror = require('react-codemirror');
const { Tab, Col, Row, Nav, NavItem, Button, ButtonGroup, Form, FormGroup, ControlLabel, FormControl } = require('react-bootstrap');
const $ = require('jquery');

require('codemirror/mode/javascript/javascript');

const ruleCodeMap = {
    "frontRule": "frontCode",
    "backRule": "backCode",
    "customRule": "customCode"
};

class RuleEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backCode: "",
            frontCode: "",
            editorType: "back"
        };
    }

    componentWillMount() {
        this.loadFile("backRule");
        this.loadFile("customRule");
        this.loadFile("frontRule");
    }

    loadFile(filename) {
        $.ajax(`./rule/${filename}.js`, {
            cache: false
        }).then((data)=>{
            this.updateCode(ruleCodeMap[filename], data);
        }, (error)=>{
            alert("无法连接服务器，请稍后重试");
        });
    }

    updateCode(type, newCode) {
        this.setState({
            [type]: newCode
        });
    }

    save(filename) {
        $.post(`./rule/${filename}.js`, {
            data: this.state[ruleCodeMap[filename]]
        }).then((res)=>{
            alert(res.message);
        }, (error)=>{
            alert("无法连接服务器，请稍后重试");
        });
    }

    handleSelect(eventKey) {
        this.setState({
            editorType: eventKey
        });
    }

    render() {
        let options = {
            lineNumbers: true,
            mode: 'javascript'
        };

        let { editorType } = this.state;

        return (
            <div style={{marginBottom: "20px"}}>
                <Tab.Container id="RuleTabs" activeKey={editorType} onSelect={this.handleSelect.bind(this)}>
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavItem eventKey="back">服务端</NavItem>
                                <NavItem eventKey="custom">动态规则</NavItem>
                                <NavItem eventKey="front">客户端</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content animation={false}>
                                <Tab.Pane eventKey="back">
                                    <div className="RuleEditor">
                                        <Codemirror value={this.state.backCode} onChange={this.updateCode.bind(this, "backCode")} options={options} />
                                    </div>
                                    <div className="RuleEditor-ButtonBar">
                                        <Button bsStyle="primary" bsSize="small" onClick={this.save.bind(this, "backRule")}>保存</Button>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="custom">
                                    <div className="RuleEditor">
                                        <Codemirror value={this.state.customCode} onChange={this.updateCode.bind(this, "customCode")} options={{...options, readOnly:true}} />
                                    </div>
                                    <div className="RuleEditor-ButtonBar">
                                        [不可编辑]
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="front">
                                    <div className="RuleEditor">
                                        <Codemirror value={this.state.frontCode} onChange={this.updateCode.bind(this, "frontCode")} options={options} />
                                    </div>
                                    <div className="RuleEditor-ButtonBar">
                                        <Button bsStyle="primary" bsSize="small" onClick={this.save.bind(this, "frontRule")}>保存</Button>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

module.exports = { RuleEditor };

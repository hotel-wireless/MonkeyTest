const React = require('react');
const { connect } = require('react-redux');
const { SessionTable, NetCheckTable } = require('../../component');
const { Tab, Col, Row, Nav, NavItem, Button, ButtonGroup, Form, FormGroup, ControlLabel, FormControl } = require('react-bootstrap');
const action = require('../../store/action');
const socket = require('../../socketio');   // 启动websocket

class Monitor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            framePopup: null
        }
    }

    handleSelect(eventKey) {
        this.props.setVisibleSessionType(eventKey);
    }

    handleFrontOn() {
        socket.emit("action", {type: "FRONT_FUSE_ON"})
    }

    handleFrontOff() {
        socket.emit("action", {type: "FRONT_FUSE_OFF"})
    }

    handleBackOn() {
        socket.emit("action", {type: "BACK_FUSE_ON"})
    }

    handleBackOff() {
        socket.emit("action", {type: "BACK_FUSE_OFF"})
    }

    clearBackSession() {
        this.props.clearBackSession();
    }

    clearFrontSession() {
        this.props.clearFrontSession();
    }

    backFilterFrom() {
        this.props.setBackFilterFrom(this.backFilterFromRef.value);
    }

    backFilterUrl() {
        this.props.setBackFilterUrl(this.backFilterUrlRef.value);
    }

    showFrame(url, frame) {
        this.setState({
            framePopup: {
                url,
                frame
            }
        });
    }

    render() {
        const { filter, sessionData, fSessionData, visibleSessionType, frontStatus, backStatus, netcheckData } = this.props;

        return (
            <div style={{marginBottom: "20px"}}>
                <Tab.Container id="SessoinTabs" activeKey={visibleSessionType} onSelect={this.handleSelect.bind(this)}>
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavItem eventKey="back">{ backStatus ? <span style={{color:"red"}}>●</span> : ""} 服务端</NavItem>
                                <NavItem eventKey="front">{ frontStatus ? <span style={{color:"red"}}>●</span> : ""} 客户端</NavItem>
                                <NavItem eventKey="netcheck">未熔断连接</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content animation={false}>
                                <Tab.Pane eventKey="back">
                                    <div className="Tab-ButtonBar clearfix">
                                        <ButtonGroup className="pull-right clearfix">
                                            <Button bsSize="sm" bsStyle="danger" onClick={this.handleBackOn.bind(this)} active={backStatus}>开启</Button>
                                            <Button bsSize="sm" onClick={this.handleBackOff.bind(this)} active={!backStatus}>关闭</Button>
                                        </ButtonGroup>
                                        <Button bsSize="sm" bsStyle="info" onClick={this.clearBackSession.bind(this)}>清空</Button>
                                        <Form inline className="Tab-Filter">
                                            <FormGroup bsSize="sm" controlId="From">
                                                <ControlLabel>过滤:</ControlLabel>
                                                {' '}
                                                <FormControl value={filter.back.url} style={{width:"200px"}} inputRef={ref => { this.backFilterUrlRef = ref; }} type="text" placeholder="Url" onChange={this.backFilterUrl.bind(this)}/>
                                                {' '}
                                                <FormControl value={filter.back.from} inputRef={ref => { this.backFilterFromRef = ref; }} type="text" placeholder="From" onChange={this.backFilterFrom.bind(this)}/>
                                            </FormGroup>
                                            {' '}
                                        </Form>
                                    </div>
                                    <SessionTable sessionData={sessionData} sessionType="back" onRowClick={this.showFrame.bind(this)}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="front">
                                    <div className="Tab-ButtonBar clearfix">
                                        <Button bsSize="sm" bsStyle="info" onClick={this.clearFrontSession.bind(this)}>清空</Button>
                                        <ButtonGroup className="pull-right clearfix">
                                            <Button bsSize="sm" bsStyle="danger" onClick={this.handleFrontOn.bind(this)} active={frontStatus}>开启</Button>
                                            <Button bsSize="sm" onClick={this.handleFrontOff.bind(this)} active={!frontStatus}>关闭</Button>
                                        </ButtonGroup>
                                    </div>
                                    <SessionTable sessionData={fSessionData} sessionType="front"/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="netcheck">
                                    <NetCheckTable netcheckData={netcheckData}/>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                {/*{ this.state.framePopup ?*/}
                    {/*<div style={{position:'fixed', width:'100%', height:'100%', left: 0, top: 0, background:'white', zIndex: 1000}}>*/}
                        {/*<pre style={{width:'100%', height:'100%'}}>{this.state.framePopup.frame}</pre>*/}
                    {/*</div>*/}
                    {/*: ""}*/}
            </div>
        );
    }
}

Monitor = connect((state)=>{
    return {
        filter: state.filter,
        backStatus: state.backStatus,
        frontStatus: state.frontStatus,
        visibleSessionType: state.visibleSessionType,
        sessionData: state.sessionData,
        fSessionData: state.fSessionData,
        netcheckData: state.netcheckData
    }
}, (dispatch)=>{
    return {
        setVisibleSessionType(eventKey) {
            dispatch(action.setVisibleSessionType(eventKey));
        },
        clearBackSession() {
            dispatch(action.clearBackSession());
        },
        clearFrontSession() {
            dispatch(action.clearFrontSession());
        },
        setBackFilterFrom(from) {
            dispatch(action.setBackFilterFrom(from));
        },
        setBackFilterUrl(url) {
            dispatch(action.setBackFilterUrl(url));
        }
    }
})(Monitor);

module.exports = { Monitor };

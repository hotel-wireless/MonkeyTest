const React = require('react');
const socket = require('./socketio');   // 启动websocket
const ReactDom = require('react-dom');
const { Provider} = require('react-redux');
const store = require('./store');
const { MainPage, Monitor, RuleEditor } = require('./page');
const { Router, Route, hashHistory, IndexRoute } = require('react-router');

require("fixed-data-table/dist/fixed-data-table.min.css");
require("./css/main.css");

ReactDom.render(
    <Provider store={store}>
        <div>
            <Router history={hashHistory}>
                <Route path="/" component={MainPage}>
                    <IndexRoute component={Monitor}/>
                    <Route path="monitor" component={Monitor}/>
                    <Route path="rule"　component={RuleEditor}/>
                </Route>
            </Router>
        </div>
    </Provider>,
    document.getElementById("container")
);
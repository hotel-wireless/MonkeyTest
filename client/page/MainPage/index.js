const React = require('react');
const bootstrap = require('react-bootstrap');
const { Navbar, Nav, NavItem } = bootstrap;

class MainPage extends React.Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">MonkeyTest</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem href="#/">监控</NavItem>
                        <NavItem href="#/rule">规则</NavItem>
                    </Nav>
                </Navbar>
                <div className="ContentPage">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = { MainPage };

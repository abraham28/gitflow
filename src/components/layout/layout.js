import React, { PureComponent } from "react";
import { Link, NavLink } from "react-router-dom";
import "./layout.scss";
import "./reset.scss";
import { login } from "../../graphqlAPI";
import paths from "../../resources/paths";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from '../Modal/modal';

class Layout extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href = paths.login;
    }
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      userLogin: {},
      activeClasses: [false, false, false],
      timeout: 5000 * 5 * 1, //30-33 seconds modal will appear
      showModal: false,
      isTimedOut: false,
    };
    this.addActiveClass = this.addActiveClass.bind(this);
    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  _onAction(e) {
    this.setState({isTimedOut: false})
    console.log("user is active")
  }
 
  _onActive(e) {
    this.setState({isTimedOut: false})
    console.log("user is active")
  }
 
  _onIdle(e) {
    console.log("user timeout");
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      this.setState({showModal: false})
  
    } else {
      this.setState({showModal: true})
      this.idleTimer.reset();
      this.setState({isTimedOut: true})
    }
    
  }

  handleClose() {
    this.setState({showModal: false})
  }

  handleLogout() {
    this.setState({showModal: false})
  }

  addActiveClass(index) {
    const activeClasses = [
      ...this.state.activeClasses.slice(0, index),
      !this.state.activeClasses[index],
      this.state.activeClasses.slice(index + 1),
    ].flat();
    this.setState({ activeClasses });
  }

  async componentDidMount() {
    const { users } = this.props;
    await login(users).then((result) => {
      this.setState({ userLogin: result.data.users });
    });
  }

  checkLoginStatus() {}

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const activeClasses = this.state.activeClasses.slice();
    return (
      <div className="layout">

        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={500}
          timeout={this.state.timeout}
        />

        <div className="navbar">
          <div className="logo">
            <h1>
              Admin <span>Management</span>
            </h1>
          </div>
          <ul className="nav-link">
            <li>
              <Link to="/login" onClick={() => localStorage.removeItem("user")}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
        <div className="mainVisual">
          <div className="dashboard-container">
            <ul>
              <li
                className={activeClasses[0] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(0)}
              >
                <NavLink exact to="/admins">
                  <p className="admins">Admins</p>
                </NavLink>
              </li>
              <li
                className={activeClasses[1] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(1)}
              >
                <NavLink to="/companies">
                  <p className="company">Companies</p>
                </NavLink>
              </li>
              <li
                className={activeClasses[2] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(2)}
              >
                <NavLink to="/divisions">
                  <p className="division">Divisions</p>
                </NavLink>
              </li>
              {/* <li
              className={activeClasses[3] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(3)}
            >
              <NavLink to="/groups">Groups</NavLink>
            </li> */}
              <li
                className={activeClasses[4] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(4)}
              >
                <NavLink to="/users">
                  <p className="users">Users</p>
                </NavLink>
              </li>
            </ul>
             <p className="userSec">{user.first_name}</p>
          </div>
          <div className="content">{this.props.children}</div>
        </div>
        <IdleTimeOutModal 
                   showModal={this.state.showModal} 
                   handleClose={this.handleClose}
                   handleLogout={this.handleLogout}
                />
      </div>
    );
  }
}

export default Layout;

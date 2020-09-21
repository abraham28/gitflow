import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";
import "./layout.scss";
import "./reset.scss";
import { login } from "../../graphqlAPI";
import paths from "../../resources/paths";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "../Modal/modal";
import Confirm from "./confirm";
class Layout extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href = paths.login;
    }
    this.state = {
      select: "open",
      loggedInStatus: "NOT_LOGGED_IN",
      userLogin: {},
      activeClasses: [false, false, false],
      timeout: 900000,
      showModal: false,
      isTimedOut: false,
    };
    this.addActiveClass = this.addActiveClass.bind(this);
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  _onAction(e) {
    this.setState({ isTimedOut: false });
  }

  _onActive(e) {
    this.setState({ isTimedOut: false });
  }

  _onIdle(e) {
    console.log("user timeout");
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      this.setState({ showModal: false });
    } else {
      this.setState({ showModal: true });
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  handleLogout() {
    this.setState({ showModal: false });
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
          debounce={250}
          timeout={this.state.timeout}
        />
        <div className="mainVisual">
          <div className="dashboard-container">
            <div className="logo">
              <h1>
                Admin <span>Management</span>
              </h1>
            </div>
            <div className="name-holder">
              <p className="userSec">{user.first_name}</p>
              <button variant="danger">
              <NavLink to="/userinfo">
                User Info
              </NavLink>
            </button>
            </div>
            <ul>
              <li
                className={activeClasses[0] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(0)}
              >
                <NavLink to="/admins">
                  <p className="admins">
                    <i className="fas fa-book-reader"></i>Admins
                  </p>
                </NavLink>
              </li>
              <li
                className={activeClasses[1] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(1)}
              >
                <NavLink to="/companies">
                  <p className="company">
                    <i className="fas fa-building"></i>Companies
                  </p>
                </NavLink>
              </li>
              <li
                className={activeClasses[2] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(2)}
              >
                <NavLink to="/divisions">
                  <p className="division">
                    <i className="fas fa-users"></i>Divisions
                  </p>
                </NavLink>
              </li>
              <li
                className={activeClasses[3] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(3)}
              >
                <NavLink to="/users">
                  <p className="users">
                    <i className="fas fa-user"></i>Users
                  </p>
                </NavLink>
              </li>
            </ul>
 
              <Confirm title="Confirm Logout" description="Do you want to logout?">
                {(confirm) => (
                  <form onSubmit={confirm(this.handleSubmit)}>
                    <p className="logout">
                      <button>
                      <i className="fas fa-sign-out-alt"></i>Logout
                      </button>
                    </p>
                  </form>
                )}
              </Confirm>
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

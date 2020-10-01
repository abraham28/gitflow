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
      loggedInStatus: "inactive",
      userLogin: {},
      adminLogin: {},
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
    const { loggedInStatus } = this.state;
    await login(users).then((result) => {
      this.setState({
        userLogin: result.data.users,
        adminLogin: result.data.admins,
      });
    });
  }

  checkLoginStatus() {}

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const activeClasses = this.state.activeClasses.slice();
    const { loggedInStatus } = this.state;
    // if (user && this.state.loggedInStatus === "inactive") {
    //   this.setState({
    //     loggedInStatus: "active",
    //   });
    // } else if (!user & (this.state.loggedInStatus === "active")) {
    //   this.setState({
    //     loggedInStatus: "inactive",
    //   });
    // }
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
                UMS <span>User Management System</span>
              </h1>
            </div>
            {/* <p className="userSec">{user.first_name}</p> */}
            {user.role.toString() === "user" ? (
              <button variant="danger">
                <NavLink to="/userinfo">User Info</NavLink>
              </button>
            ) : (
              <div></div>
            )}
            <ul>
              <li
                className={activeClasses[0] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(0)}
              >
                <NavLink to="/dashboard">
                  <p>
                    <i className="fas fa-book-reader"></i>dashboard
                  </p>
                </NavLink>
              </li>
              <li
                className={activeClasses[1] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(1)}
              >
                {user.role.toString() === "system_admin" ? (
                  <div>
                    <NavLink to="/admins">
                      <p className="admins">
                        <i className="fas fa-book-reader"></i>Admins
                      </p>
                    </NavLink>
                    <NavLink to="/companies">
                      <p className="company">
                        <i className="fas fa-building"></i>Companies
                      </p>
                    </NavLink>
                    <NavLink to="/divisions">
                      <p className="division">
                        <i className="fas fa-users"></i>Divisions
                      </p>
                    </NavLink>
                    <NavLink to="/users">
                      <p className="users">
                        <i className="fas fa-user"></i>Users
                      </p>
                    </NavLink>
                  </div>
                ) : user.role.toString() === "super_admin" ? (
                  <div>
                    <NavLink to="/admins">
                      <p className="admins">
                        <i className="fas fa-book-reader"></i>Admins
                      </p>
                    </NavLink>
                    <NavLink to="/companies">
                      <p className="company">
                        <i className="fas fa-building"></i>Companies
                      </p>
                    </NavLink>
                    <NavLink to="/divisions">
                      <p className="division">
                        <i className="fas fa-users"></i>Divisions
                      </p>
                    </NavLink>
                    <NavLink to="/users">
                      <p className="users">
                        <i className="fas fa-user"></i>Users
                      </p>
                    </NavLink>
                  </div>
                ) : (
                  <div className="display"></div>
                )}
              </li>
              <li
                className={activeClasses[2] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(2)}
              >
                {user.role.toString() === "company_admin" ? (
                  <NavLink to="/companies">
                    <p className="company">
                      <i className="fas fa-building"></i>Companies
                    </p>
                  </NavLink>
                ) : (
                  <div className="display"></div>
                )}
              </li>
              <li
                className={activeClasses[2] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(2)}
              >
                {user.role.toString() === "admin_division" ? (
                  <NavLink to="/divisions">
                    <p className="division">
                      <i className="fas fa-users"></i>Divisions
                    </p>
                  </NavLink>
                ) : (
                  <div className="display"></div>
                )}
              </li>
              <li
                className={activeClasses[3] ? "active" : "inactive"}
                onClick={() => this.addActiveClass(3)}
              >
                {user.role.toString() === "user" ? (
                  <NavLink to="/users">
                    <p className="users">
                      <i className="fas fa-user"></i>Users
                    </p>
                  </NavLink>
                ) : (
                  <div className="display"></div>
                )}
              </li>
            </ul>
            <div className="footer">
              <p>Develop by TCAP 2020</p>
            </div>
          </div>

          <div className="content">
            <div className="header">
              <ul>
                <li className="userSec">Welcome {user.first_name}</li>
                <li>
                  <p className="logout settings">
                    <NavLink to="/setting">
                      <button>Settings</button>
                    </NavLink>
                  </p>
                </li>
                <li>
                  {user.role.toString() === "user"  ? (
                    <p className="logout settings">
                    <NavLink to="/userinfo">
                      <button>Information</button>
                    </NavLink>
                  </p>
                  ): (user.role.toString() !== "user" ? (
                    <p className="logout settings">
                    <NavLink to="/admininfo">
                      <button>Information</button>
                    </NavLink>
                  </p>
                  ): (
                    <div></div>
                  )
                  )} 

                </li>
                <li>
                  {" "}
                  <Confirm
                    title="Confirm Logout"
                    description="Do you want to logout?"
                  >
                    {(confirm) => (
                      <form onSubmit={confirm(this.handleSubmit)}>
                        <p className="logout">
                          <button>Logout</button>
                        </p>
                      </form>
                    )}
                  </Confirm>
                </li>
              </ul>
            </div>
            {this.props.children}
          </div>
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

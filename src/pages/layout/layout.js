import React, { PureComponent } from "react";
import { Link, NavLink } from "react-router-dom";
import "./layout.scss";
import { login } from "../../graphqlAPI";

class Layout extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href = "/login";
    }
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      userLogin: {},
      activeClasses: [false, false, false],
    };
    this.addActiveClass = this.addActiveClass.bind(this);
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
    await login(users).then((data) => {
      console.log(data);
      this.setState({ userLogin: data.data.users });
    });
  }

  checkLoginStatus() {}

  render() {
    const activeClasses = this.state.activeClasses.slice();
    return (
      <div>
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

        <div className="dashboard-container">
          <ul>
            <li
              className={activeClasses[0] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(0)}
            >
              <NavLink exact to="/admins">
                Admins
              </NavLink>
            </li>
            <li
              className={activeClasses[1] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(1)}
            >
              <NavLink to="/companies">Companies</NavLink>
            </li>
            <li
              className={activeClasses[2] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(2)}
            >
              <NavLink to="/divisions">Divisions</NavLink>
            </li>
            <li
              className={activeClasses[3] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(3)}
            >
              <NavLink to="/groups">Groups</NavLink>
            </li>
            <li
              className={activeClasses[4] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(4)}
            >
              <NavLink to="/users">Users</NavLink>
            </li>
          </ul>
        </div>
        <div className="content">{this.props.children}</div>
      </div>
    );
  }
}

export default Layout;

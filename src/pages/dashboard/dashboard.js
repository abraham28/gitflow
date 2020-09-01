import React, { PureComponent } from "react";
import {  Route, Link,NavLink } from "react-router-dom";
import "./dashboard.scss";
import UserPage from "../userpage/userpage";
import SuperAdmin from "../superadmin/superadmin";
import Company from "../companyadmin/companyadmin";
import Division from "../divisionadmin/divisionadmin";
import System from "../systemadmin/systemadmin";
import { login } from "../../graphqlAPI";


class DashBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      loggedInStatus: "NOT_LOGGED_IN",
      userLogin:{},
      activeClasses: [false, false, false] 
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
  const {users} = this.props;
  await login(users)
   .then (data => {
     console.log(data)
       this.setState({userLogin: data.data.users})
   })
  }

  checkLoginStatus() {
    
  }

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
              <Link to="/login">Logout</Link>
            </li>
          </ul>
        </div>

        <div className="dashboard-container">
          <ul>
            <li
              className={activeClasses[0] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(0)}
            >
              <NavLink exact to="/companyadmin">Company Admin Page</NavLink>
            </li>
            <li
              className={activeClasses[1] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(1)}
            >
              <NavLink to="/divisionadmin">Division Admin Page</NavLink>
            </li>
            <li
              className={activeClasses[2] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(2)}
            >
                <NavLink to="/superadmin">Super Admin Page</NavLink>
            </li>
            <li
              className={activeClasses[3] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(3)}
            >
              <NavLink to="/systemadmin">System Admin Page</NavLink>
            </li>
            <li
              className={activeClasses[4] ? "active" : "inactive"}
              onClick={() => this.addActiveClass(4)}
            ><NavLink to="/userpage">User Page</NavLink></li>
          </ul>
        </div>
        <div className="content">
            <Route path="/companyadmin" 
            component={Company} />
            <Route path="/divisionadmin" 
            component= {Division} />    
            <Route path="/superadmin" 
            component = {SuperAdmin} />
            <Route path="/systemadmin" 
            component= {System} />
            <Route path="/userpage" 
            component= {UserPage} />
        </div>
      </div>
    );
  }
}

export default DashBoard;

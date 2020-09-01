import React, { PureComponent } from "react";
import Login from "./components/login/login";
import Register from "./components/register/register";
import "./App.css";
import { Switch, Route } from "react-router-dom";
// import HomePage from "./components/homepage";
import DashBoard from "./pages/dashboard/dashboard";
// import UserPage from "./pages/userpage/userpage";
// import SuperAdmin from "./pages/superadmin/superadmin";
// import Company from "./pages/companyadmin/companyadmin";
// import Division from "./pages/divisionadmin/divisionadmin";
// import System from "./pages/systemadmin/systemadmin";

class App extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href('/login');
    }
    this.state = {
      user: JSON.parse(userJSON),
    };
  }
  render() {
    const user = this.state.user;
    return (
      <div className="wrap">
        <div className="inner">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            {user ? (
              <Route path="/dashboard">
                <DashBoard />
              </Route>
            ) : (
              <div>Wrong Path</div>
            )}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

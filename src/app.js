import React, { PureComponent } from "react";
import Login from "./components/login/login";
import Register from "./components/register/register";
import "./App.css";
import { Switch, Route } from "react-router-dom";
// import HomePage from "./components/homepage";
import DashBoard from "./pages/dashboard/dashboard";
import PageNotFound from "./components/pagenotfound";
// import UserPage from "./pages/userpage/userpage";
import SuperAdmin from "./pages/superadmin/superadmin";
// import Company from "./pages/companyadmin/companyadmin";
// import Division from "./pages/divisionadmin/divisionadmin";
// import System from "./pages/systemadmin/systemadmin";

class App extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href("/login");
    }
    this.state = {
      user: JSON.parse(userJSON),
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="wrap">
        <div className="inner">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/superadmin">
              <SuperAdmin />
            </Route>
            <Route path="/" exact>
              <DashBoard />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

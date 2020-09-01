import React, { PureComponent } from "react";
import Login from "./components/login/login";
import Register from "./components/register/register";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
// import HomePage from "./components/homepage";
import Layout from "./pages/layout/layout";
import PageNotFound, { RedirectNotFound } from "./pages/pagenotfound";
// import UserPage from "./pages/userpage/userpage";
import Admins from "./pages/superadmin/superadmin";
// import Company from "./pages/companyadmin/companyadmin";
// import Division from "./pages/divisionadmin/divisionadmin";
// import System from "./pages/systemadmin/systemadmin";

class App extends PureComponent {
  render() {
    return (
      <div className="wrap">
        <div className="inner">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/404">
              <PageNotFound />
            </Route>
            <div>
              <Layout>
                <Switch>
                  <Route path="/admins">
                    <Admins />
                  </Route>
                  <Route path="/companies">
                    <div>companies</div>
                  </Route>
                  <Route path="/divisions">
                    <div>divisions</div>
                  </Route>
                  <Route path="/groups">
                    <div>groups</div>
                  </Route>
                  <Route path="/users">
                    <div>users</div>
                  </Route>
                  <Route path="/" exact>
                    <Redirect to="/admins" />
                  </Route>
                  <Route>
                    <RedirectNotFound />
                  </Route>
                </Switch>
              </Layout>
            </div>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

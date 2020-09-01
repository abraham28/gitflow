import React, { PureComponent } from "react";
import Login from "./components/login/login";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/layout/layout";
import PageNotFound, { RedirectNotFound } from "./pages/pagenotfound";
import Admins from "./pages/admins";

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

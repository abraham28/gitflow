import React, { PureComponent } from "react";
import Login from "./components/login/login";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/layout/layout";
import PageNotFound, { RedirectNotFound } from "./pages/pagenotfound";
import Admins from "./pages/admins";
import Companies from "./pages/companies";
import paths from "./resources/paths";


class App extends PureComponent {
  render() {
    return (
      <div className="wrap">
        <div className="inner">
          <Switch>
            <Route path={paths.login}>
              <Login />
            </Route>
            <Route path={paths.pageNotFound}>
              <PageNotFound />
            </Route>
            <Layout>
              <Switch>
                <Route path={paths.admins}>
                  <Admins />
                </Route>
                <Route path={paths.companies}>
                  <div><Companies /></div>
                </Route>
                <Route path={paths.divisions}>
                  <div>divisions</div>
                </Route>
                <Route path={paths.groups}>
                  <div>groups</div>
                </Route>
                <Route path={paths.users}>
                  <div>users</div>
                </Route>
                <Route path={paths.root} exact>
                  <Redirect to="/admins" />
                </Route>
                <Route>
                  <RedirectNotFound />
                </Route>
              </Switch>
            </Layout>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;

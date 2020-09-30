import React, { PureComponent } from "react";
import Login from "./components/login/login";
import "./App.css";
import "./reset.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/layout/layout";
import PageNotFound, { RedirectNotFound } from "./pages/pagenotfound";
import Admins from "./pages/admins";
import Companies from "./pages/companies";
import Divisions from "./pages/divisions";
import Users from "./pages/users";
import DashBoard from "./pages/dashboard/dashboard";
import UserInfo from "./pages/userinfo/userinfo";
import AdminInfo from "./pages/admininfo/admininfo";
import Setting from "./pages/setting/setting";
import paths from "./resources/paths";

class App extends PureComponent {
  render() {
    return (
      <div className="wrap">
        <Switch>
          <Route path={paths.login}>
            <Login />
          </Route>
          <Route path={paths.pageNotFound}>
            <PageNotFound />
          </Route>
          <Layout>
            <Switch>
              <Route path={paths.dashboard}>
                <DashBoard />
              </Route>
              <Route path={paths.setting}>
                <Setting />
              </Route>
              <Route path={paths.admins}>
                <Admins />
              </Route>
              <Route path={paths.companies}>
                <Companies />
              </Route>
              <Route path={paths.divisions}>
                <Divisions />
              </Route>
              <Route path={paths.userinfo}>
                <UserInfo />
              </Route>

              <Route path={paths.admininfo}>
                <AdminInfo />
              </Route>

              <Route path={paths.users}>
                <Users />
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
        {/* footer */}
        {/* <footer>
          <p className="footer-copyright mb-0">
            &copy; {new Date().getFullYear()} Copyright
          </p>
        </footer> */}
      </div>
    );
  }
}

export default App;

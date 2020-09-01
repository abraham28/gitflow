import React, { PureComponent } from "react";
import { Route, NavLink } from "react-router-dom";
import SuperTable from "./table";
import paths from "../../resources/paths";

class Company extends PureComponent {
  render() {
    return (
      <div className="super-container">
        <p>Company Admin</p>
        <NavLink to="/superadmin/superform">
          <button type="button" className="btn btn-info">
            Add
          </button>
        </NavLink>

        <NavLink to="/superadmin/table">
          <button type="button" className="btn btn-info">
            View Table
          </button>
        </NavLink>

        <div className="super-form">
          <Route path={paths.root} />
          <Route path="/companyadmin/table" component={SuperTable} />
        </div>
      </div>
    );
  }
}

export default Company;

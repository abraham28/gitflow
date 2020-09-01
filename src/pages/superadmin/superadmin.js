import React, { PureComponent } from "react";
import { Route, NavLink } from "react-router-dom";
import SuperForm from "./superform";
import SuperTable from './table';
import "../pages.scss";

class SuperAdmin extends PureComponent {
  render() {
    return (
      <div className="super-container">
        <p>SuperAdmin</p>
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
          <Route path="/superadmin/superform" component={SuperForm} />
          <Route path="/superadmin/table" component={SuperTable} />
        </div>
      </div>
    );
  }
}

export default SuperAdmin;

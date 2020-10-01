import React, { PureComponent } from "react";
import "../../components/layout/reset.scss";
import "../../App.css";
import logo from "../../images/dummy.png";
import { NavLink } from "react-router-dom";

class Information extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: "inactive",
    }
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      role,
    } = JSON.parse(localStorage.getItem("user"));
    const  user  = JSON.parse(localStorage.getItem("user"));
    // const { loggedInStatus } = this.state;
    // if (user && this.state.loggedInStatus === "inactive") {
    //   this.setState({
    //     loggedInStatus: "Currently Logged In",
    //   });
    // } else if (!user & (this.state.loggedInStatus === "active")) {
    //   this.setState({
    //     loggedInStatus: "inactive",
    //   });
    // }
    return (
      <div className="view-info">
        <h5>
          Admin &gt; {first_name} {last_name}
        </h5>

        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={logo}
                    className="rounded-circle"
                    width="150"
                    alt="dummy"
                  />

                  <div class="mt-3">
                    <h4>
                      {first_name} {last_name}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {first_name} {last_name}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{email}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Role</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavLink to="/admins">
          <button className="edit">Admins </button>
        </NavLink>
      </div>
    );
  }
}

export default Information;

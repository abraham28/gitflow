import React, { PureComponent } from "react";
import "../../components/layout/reset.scss";
import "./userinfo.css";
import "../../App.css";
import logo from "../../images/dummy.png";
import { NavLink } from "react-router-dom";

class Information extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: "inactive",
    };
  }
  render() {
    const {
      first_name,
      last_name,
      email,
      role,
      birthdate,
      mobile,
      gender,
      position,
      company: { name: companyName },
      division: { name: divisionName },
      skill,
    } = JSON.parse(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user"));
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
          USER &gt; {first_name} {last_name}
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
                    <p>Company: {companyName}</p>
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
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Birthday</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{birthdate}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Gender</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{gender}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Skills</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{skill}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Mobile</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{mobile}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Position</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{position}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavLink to="/users">
          <button className="edit">User </button>
        </NavLink>
      </div>
    );
  }
}

export default Information;

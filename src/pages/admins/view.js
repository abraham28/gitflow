import React, { PureComponent } from "react";
import logo from "../../images/dummy.png";
import { NavLink } from "react-router-dom";

class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      divisions: [],
      email: props.user && props.user.email,
      first_name: props.user && props.user.first_name,
      middle_name: props.user && props.user.middle_name,
      last_name: props.user && props.user.last_name,
      role: props.user && props.user.role,
      birthdate: props.user && props.user.birthdate,
      gender: props.user && props.user.gender,
      skill: props.user && props.user.skill,
      mobile: props.user && props.user.mobile,
      position: props.user && props.user.position,
      company_id: props.user && props.user.company_id,
      division_id: props.user && props.user.division_id,
    };
  }

  render() {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      role,
      birthdate,
      gender,
      skill,
      mobile,
      position,
      company_id,
      division_id,
    } = this.state;
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
                    {first_name} {middle_name} {last_name}
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
        <NavLink to="/admins">
          <button className="edit">Admins </button>
        </NavLink>
      </div>
    );
  }
}

export default View;

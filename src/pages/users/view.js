import React, { PureComponent } from "react";
import logo from "../../images/dummy.png";
import { NavLink } from "react-router-dom";
import { getUsers } from "../../graphqlAPI";

class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
      company: props.user && props.user.company,
      division: props.user && props.user.division,
      tableUser: [
        {
          email: "",
          status: "",
          first_name: "",
          last_name: "",
          role: "",
          companyName: "",
          divisionName: "",
          created_at: "",
          updated_at: "",
        },
      ],
      selectedUser: null,
      redirect: null,

    };
  }
  async componentDidMount() {
    await getUsers().then((result) => {
      this.setState({
        tableUser: result.data.users.map((val) => ({
          ...val,
          companyName: val.company.name,
          divisionName: val.division.name,
        })),
      });
    });
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      role,
      birthdate,
      gender,
      skill,
      mobile,
      position,
      company: { name: companyName },
      division: { name: divisionName },
    } = this.state;
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
                    <p className="text-secondary mb-1">{companyName}</p>
                    <p className="text-muted font-size-sm">{divisionName}</p>
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

export default View;

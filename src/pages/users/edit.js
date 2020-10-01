import React, { PureComponent } from "react";
import { updateUsers, getCompanies, getDivisions } from "../../graphqlAPI";
import { Link } from "react-router-dom";
import paths from "../../resources/paths";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val && typeof val === "string" && val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};

//(Associate, Senior Associate, Team Leader, Supervisor, Manager)
const positionLevel = [
  { value: "associate", label: "Associate" },
  { value: "senior_associate", label: "Senior Associate" },
  { value: "team_leader", label: "Team Leader" },
  { value: "supervisor", label: "Supervisor" },
  { value: "manager", label: "Manager" },
];

const genderSelect = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const statusAdmin = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

class UserForm extends PureComponent {
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
      status: props.user && props.user.status,
      formErrors: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        role: "",
        birthdate: "",
        gender: "",
        skill: "",
        mobile: "",
        position: "",
        company_id: "",
        division_id: "",
      },
      isUpdate: Boolean(props.user),
    };
  }

  async componentDidMount() {
    const result = await getCompanies();
    this.setState({ companies: result.data.companies });
    const divisionResult = await getDivisions();
    this.setState({ divisions: divisionResult.data.divisions });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    //if form doesnt have error
    if (formValid(this.state)) {
      const {
        first_name,
        middle_name,
        last_name,
        email,
        role,
        birthdate,
        gender,
        skill,
        status,
        mobile,
        position,
        company_id,
        division_id,
      } = this.state;
      console.log(`
        --SUBMITTING--
        First Name: ${first_name}
        Middle Name: ${middle_name}
        Last Name: ${last_name}
        Status: ${status}
        Email: ${email}
        role: ${role}
        birthdate: ${birthdate}
        gender:${gender}
        skill: ${skill}
        mobile: ${mobile}
        companies: ${company_id}
        divisions: ${division_id}
        Position: ${position}

      `);

      //for users update
      if (this.state.isUpdate) {
        await updateUsers(email, {
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          email: email,
          status: status,
          role: role,
          birthdate: birthdate,
          gender: gender,
          skill: skill,
          mobile: mobile,
          position: position,
          company_id: company_id,
          division_id: division_id,
        })
          .then((result) => {
            if (result.errors) {
              const uniq = new RegExp("Uniqueness violation");
              if (uniq.test(result.errors[0].message)) {
                alert("Email already exists");
              } else {
                alert(result.errors[0].message);
              }
            } else {
              alert(`${email} Updated!`);
              window.location.href = paths.users;
            }
          })
          .catch((e) => console.log(e));
      }
    } else {
      alert("FORM INVALID COMPLETE THE FORM");
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "first_name":
        formErrors.first_name =
          value.length < 2 ? "minimum 4 characters required" : "";
        break;
      case "middle_name":
        formErrors.middle_name =
          value.length < 2 ? "minimum 4 characters required" : "";
        break;

      case "last_name":
        formErrors.last_name =
          value.length < 2 ? "minimum 4 characters required" : "";
        break;

      case "company":
        formErrors.company_id =
          value.length > 0 ? "" : "please input companies";
        break;

      case "division":
        formErrors.division_id =
          value.length > 0 ? "" : "please input division";
        break;

      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address try again ";
        break;
      case "skills":
        formErrors.skill = value.length > 0 ? "" : "please add skill";
        break;
      case "birthdate":
        formErrors.birthdate = value.length > 0 ? "" : "please add birthdate";
        break;
      case "mobile":
        formErrors.mobile = value.length < 11 ? "11 numbers is required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;
    return (
      <div className="form-container">
        <form onSubmit={this.handleSubmit}>
          <div className="forms">
            <h3>USER &gt; Edit User</h3>
            <div className="form-box">
              <p className="form-title">Edit User Form</p>
              <div className="form-input">
                <label>First Name</label>
                <input
                  className="namefield"
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                  pattern="[A-Za-z\s]{2,17}"
                  value={this.state.first_name}
                  onChange={this.handleChange}
                />
                {formErrors.first_name.length > 0 && (
                  <span className="errorMessage">{formErrors.first_name}</span>
                )}
              </div>
              <div className="form-input">
                <label>Middle Name</label>
                <input
                  className="namefield"
                  type="text"
                  placeholder="Middle Name"
                  name="middle_name"
                  pattern="[A-Za-z\s]{2,17}"
                  value={this.state.middle_name}
                  onChange={this.handleChange}
                />
                {formErrors.middle_name.length > 0 && (
                  <span className="errorMessage">{formErrors.middle_name}</span>
                )}
              </div>
              <div className="form-input">
                <label>Last Name</label>
                <input
                  className="namefield"
                  placeholder="Last Name"
                  type="text"
                  name="last_name"
                  pattern="[A-Za-z\s]{2,17}"
                  value={this.state.last_name}
                  onChange={this.handleChange}
                />
                {formErrors.last_name.length > 0 && (
                  <span className="errorMessage">{formErrors.last_name}</span>
                )}
              </div>
              <div className="display">
                <div className="form-input">
                  <label>Email Address</label>
                  <input
                    placeholder="Email Address"
                    text="Email Address"
                    type="email"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  {formErrors.email.length > 0 && (
                    <span className="errorMessage">{formErrors.email}</span>
                  )}
                </div>
                <div className="form-input">
                  <label>Mobile</label>
                  <input
                    placeholder="Phone number"
                    text="phone"
                    name="mobile"
                    required
                    value={this.state.mobile}
                    onChange={this.handleChange}
                  />
                  {formErrors.mobile.length > 0 && (
                    <span className="errorMessage">{formErrors.mobile}</span>
                  )}
                </div>
              </div>

              <div className="display">
                <div className="form-input">
                  <input
                    placeholder="Birthday"
                    type="date"
                    name="birthdate"
                    pattern="\d{1,2}/\d{1,2}/\d{4}"
                    value={this.state.birthdate}
                    onChange={this.handleChange}
                  />
                  {formErrors.birthdate.length > 0 && (
                    <span className="errorMessage">{formErrors.birthdate}</span>
                  )}
                </div>
                <div className="form-input">
                  <label>Gender</label>
                  <select
                    onChange={this.handleChange}
                    name="gender"
                    defaultValue={this.state.gender}
                  >
                    <option selected hidden disabled>
                      ---Gender---
                    </option>
                    {genderSelect.map(({ value, label }) => (
                      <option value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Skill"
                type="text"
                name="skill"
                value={this.state.skill}
                onChange={this.handleChange}
              />
              {formErrors.skill.length > 0 && (
                <span className="errorMessage">{formErrors.skill}</span>
              )}

              {/* Option field for status */}
              <div className="form-input">
                <label>Status</label>
                {/* Status */}
                <select
                  onChange={this.handleChange}
                  name="status"
                  value={this.state.status}
                >
                  <option selected hidden disabled>
                    ---Status---
                  </option>
                  {statusAdmin.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* option field for company */}
              <div className="form-input">
                <labe>Company</labe>
                <select
                  onChange={this.handleChange}
                  name="company_id"
                  value={this.state.company_id}
                >
                  <option selected hidden disabled>
                    ---Select Company---
                  </option>
                  {this.state.companies.map(({ id, name }) => (
                    <option value={id}>{name}</option>
                  ))}
                </select>
              </div>
              {/* option field for division */}
              <div className="form-input">
                <label>Division</label>
                <select
                  onChange={this.handleChange}
                  name="division_id"
                  value={this.state.division_id}
                >
                  <option selected hidden disabled>
                    ---Select Division---
                  </option>
                  {this.state.divisions.map(({ id, name }) => (
                    <option value={id}>{name}</option>
                  ))}
                </select>
              </div>
              {/* option field for position */}
              <div className="form-input">
                <select
                  onChange={this.handleChange}
                  name="position"
                  defaultValue={this.state.position}
                >
                  <option selected hidden disabled>
                    ---Select Position---
                  </option>
                  {positionLevel.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="confirm-section">
                <button type="submit">Edit User</button>
                <p>
                  <Link to={paths.users}>cancel</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default UserForm;

import React, { PureComponent, createRef } from "react";
import {
  createUser,
  updateUsers,
  getCompanies,
  getDivisions,
} from "../../graphqlAPI";
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

const roleLevels = [{ value: "user", label: "Users" }];

//(Associate, Senior Associate, Team Leader, Supervisor, Manager)
const positionLevel = [
  { value: "associate", label: "Associate" },
  { value: "senior_associate", label: "Senior Associate" },
  { value: "team_leader", label: "Team Leader" },
  { value: "supervisor", label: "Supervisor" },
  { value: "manager", label: "Manager" },
];
//status
const statusAdmin = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

//gender
const genderSelect = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];
class UserForm extends PureComponent {
  constructor(props) {
    super(props);
    this.psswordOneRef = createRef();
    this.iconRevealPassword = createRef();
    this.state = {
      companies: [],
      divisions: [],
      email: props.user && props.user.email,
      first_name: props.user && props.user.first_name,
      middle_name: props.user && props.user.middle_name,
      last_name: props.user && props.user.last_name,
      status: props.user && props.user.status,
      role: props.user && props.user.role,
      birthdate: props.user && props.user.birthdate,
      gender: props.user && props.user.gender,
      skill: props.user && props.user.skill,
      mobile: props.user && props.user.mobile,
      position: props.user && props.user.position,
      company_id: props.user && props.user.company_id,
      division_id: props.user && props.user.division_id,
      password: "",
      passwordrandom: { length: 15, data: "" },
      confirmpassword: "",
      match: null,
      charNumberValid: false,
      specialCharValid: false,
      uppercaseValid: false,
      numberValid: false,
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
  setLength = ({ value }) => {
    this.setState(
      ({ progress, passwordrandom }) => ({
        passwordrandom: { ...passwordrandom, length: value },
      }),
      () => this.buildPassword()
    );
  };

  buildPassword = () => {
    let a = "",
      b = "abcdefghijklmnopqrstuvwxyz1234567890",
      c = this.state.passwordrandom.length;
    for (let ma = 0; ma < c; ma++) {
      a += b[Math.floor(Math.random() * b.length)];
    }
    this.setState((state) => ({
      passwordrandom: { ...state.passwordrandom, data: a },
      // passwordrandom: { ...state.password, data: a },
    }));
  };

  async componentDidMount() {
    this.buildPassword();
    const result = await getCompanies();
    this.setState({ companies: result.data.companies });
    const divisionResult = await getDivisions();
    this.setState({ divisions: divisionResult.data.divisions });
  }

  // Check the length of the input
  checkPasswordLength = (password) => {
    if (password.length >= 8) {
      this.setState({
        charNumberValid: true,
      });
    } else {
      this.setState({
        charNumberValid: false,
      });
    }
  };

  // Check for special characters
  checkSpecialCharacters = (password) => {
    const pattern = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>? ]/g;
    if (pattern.test(password)) {
      this.setState({
        specialCharValid: true,
      });
    } else {
      this.setState({
        specialCharValid: false,
      });
    }
  };

  // Check for an uppercase character
  checkUppercase = (password) => {
    const pattern = /[A-Z]/;
    if (pattern.test(password)) {
      this.setState({
        uppercaseValid: true,
      });
    } else {
      this.setState({
        uppercaseValid: false,
      });
    }
  };

  // Check for a number
  checkNumber = (password) => {
    const pattern = /[0-9]/;
    if (pattern.test(password)) {
      this.setState({
        numberValid: true,
      });
    } else {
      this.setState({
        numberValid: false,
      });
    }
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });

    this.checkPasswordLength(event.target.value);
    this.checkSpecialCharacters(event.target.value);
    this.checkUppercase(event.target.value);
    this.checkNumber(event.target.value);
  };

  handleConfirmPasswordChange = (event) => {
    this.setState({
      confirmpassword: event.target.value,
      match: null,
    });
  };

  comparePassword = () => {
    if (this.state.password === this.state.confirmpassword) {
      this.setState({
        match: true,
      });
    } else {
      this.setState({
        match: false,
      });
    }
  };

  togglePassword = () => {
    this.setState({ isPasswordReveal: !this.state.isPasswordReveal });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      password,
      confirmpassword,
      numberValid,
      uppercaseValid,
      specialCharValid,
      charNumberValid,
    } = this.state;

    if (password !== confirmpassword) {
      alert("password not match");
      return null;
    } else if (numberValid === false) {
      alert("please input atleast 1 number");
      return null;
    } else if (uppercaseValid === false) {
      alert("Please add atleast 1 Upper case");
      return null;
    } else if (specialCharValid === false) {
      alert("Please add atleast 1 Special character");
      return null;
    } else if (charNumberValid === false) {
      alert("Character must be 8-20");
      return null;
    }
    // if form doesnt have error
    if (formValid(this.state)) {
      const {
        first_name,
        middle_name,
        last_name,
        email,
        role,
        birthdate,
        status,
        gender,
        skill,
        mobile,
        position,
        company_id,
        division_id,
        password,
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
        Password: ${password}
        Position: ${position}
      `);

      //for users update
      if (this.state.isUpdate) {
        await updateUsers(email, {
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          status: status,
          email: email,
          password: password,
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

      //users create if there is no to update
      else {
        await createUser({
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          status: status,
          email: email,
          role: role,
          birthdate: birthdate,
          skill: skill,
          gender: gender,
          mobile: mobile,
          password: password,
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
              alert("user Created");
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
      case "gender":
        formErrors.gender =
          value.length < 4 ? "minimum 4 characters required" : "";
        break;
      case "birthdate":
        formErrors.birthdate = value.length > 0 ? "" : "please add birthdate";
        break;
      case "mobile":
        formErrors.mobile = value.length < 11 ? "11 numbers is required" : "";
        break;
      case "position":
        formErrors.position = value.length > 0 ? "" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors, isPasswordReveal } = this.state;
    return (
      <div className="form-container">
        <form onSubmit={this.handleSubmit}>
          <div className="forms">
            <h3>USER &gt; Add User</h3>
            <div className="form-box">
              <p className="form-title">Add User Form</p>
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

              {/* role option */}
              <div className="form-input">
                <label>Role</label>
                <select
                  onChange={this.handleChange}
                  name="role"
                  defaultValue={this.state.role}
                >
                  <option selected hidden disabled>
                    ---Role---
                  </option>
                  {roleLevels.map(({ value, label }) => (
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

              <div className="password">
                <input
                  placeholder="Password"
                  text="Password"
                  type={isPasswordReveal ? "text" : "password"}
                  name="password"
                  maxlength="20"
                  ref={this.passwordOneRef}
                  // value={this.state.passwordrandom.data}
                  defaultValue={this.state.password}
                  onChange={(event) => this.handlePasswordChange(event)}
                />

                <span
                  onClick={this.togglePassword}
                  ref={this.iconRevealPassword}
                >
                  <span>
                    {isPasswordReveal ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </span>
                </span>
              </div>

              <div className="validation">
                <div className="validator">
                  <i
                    className={
                      this.state.charNumberValid
                        ? "fas fa-check success"
                        : "fas fa-times error"
                    }
                  ></i>
                  <p className="validation-item">8-20 characters</p>
                </div>
                <div className="validator">
                  <i
                    className={
                      this.state.specialCharValid
                        ? "fas fa-check success"
                        : "fas fa-times error"
                    }
                  ></i>
                  <p className="validation-item">1 special character</p>
                </div>
                <div className="validator">
                  <i
                    className={
                      this.state.uppercaseValid
                        ? "fas fa-check success"
                        : "fas fa-times error"
                    }
                  ></i>
                  <p className="validation-item">1 uppercase letter</p>
                </div>
                <div className="validator">
                  <i
                    className={
                      this.state.numberValid
                        ? "fas fa-check success"
                        : "fas fa-times error"
                    }
                  ></i>
                  <p className="validation-item">1 number</p>
                </div>
              </div>

              <input
                className={`input${
                  this.state.match === false ? "--error" : ""
                }`}
                placeholder="Confirm Password"
                text="Password"
                type="password"
                name="confirmpassword"
                maxlength="20"
                defaultValue={this.state.confirmpassword}
                onChange={(event) => this.handleConfirmPasswordChange(event)}
                onBlur={this.comparePassword}
              />

              <div className="confirm-section">
                <button type="submit">Add User</button>
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

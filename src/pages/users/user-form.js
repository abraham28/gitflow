import React, { PureComponent } from "react";
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

class UserForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      divisions: [],
      email: props.user && props.user.email,
      first_name: props.user && props.user.first_name,
      last_name: props.user && props.user.last_name,
      role: props.user && props.user.role,
      company_id: props.user && props.user.company_id,
      division_id: props.user && props.user.division_id,
      password: "",
      confirmpassword: "",
      match: null,
      charNumberValid: false,
      specialCharValid: false,
      uppercaseValid: false,
      numberValid: false,
      formErrors: {
        first_name: "",
        last_name: "",
        email: "",
        role: "",
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

  comparePassword = (event) => {
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

  handleSubmit = async (e) => {
    e.preventDefault();

    //if form doesnt have error
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.first_name}
        Last Name: ${this.state.last_name}
        Email: ${this.state.email}
        role: ${this.state.role}
        companies: ${this.state.company_id}
        divisions: ${this.state.division_id}
        Password: ${this.state.password}
      `);

      //for users update
      if (this.state.isUpdate) {
        await updateUsers(this.state.email, {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password,
          role: this.state.role,
          company_id: this.state.company_id,
          division_id: this.state.division_id,
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
              alert(`${this.state.email} Updated!`);
              window.location.href = paths.users;
              console.log(result);
            }
          })
          .catch((e) => console.log(e));
      }

      //users create if there is no to update
      else {
        await createUser({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password,
          role: this.state.role,
          company_id: this.state.company_id,
          division_id: this.state.division_id,
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
              console.log(result);
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
          value.length < 4 ? "minimum 4 characters required" : "";
        break;

      case "last_name":
        formErrors.last_name =
          value.length < 4 ? "minimum 4 characters required" : "";
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

      // case "password":
      //   formErrors.password =
      //     value.length < 8 ? "minimum 8 characters required" : "";
      //   break;

      // case "confirmpassword":
      //   formErrors.confirmpassword =
      //     formErrors.confirmpassword !== formErrors.password
      //       ? formErrors.password !== formErrors.confirmpassword
      //       : formErrors.password === formErrors.confirmPassword
      //       ? "password match"
      //       : "password does not match";
      //   break;

      case "role":
        formErrors.role = value.length > 0 ? "" : "";
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
          <select
            onChange={this.handleChange}
            name="role"
            defaultValue={this.state.role}
          >
            <option selected hidden disabled>
              ---Please Select---
            </option>
            {roleLevels.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </select>

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

          <input
            placeholder="Password"
            text="Password"
            type="password"
            name="password"
            defaultValue={this.state.password}
            onChange={(event) => this.handlePasswordChange(event)}
          />
          {/* {formErrors.password.length > 0 && (
            <span className="errorMessage">{formErrors.password}</span>
          )} */}
          <input
            className={`input${this.state.match === false ? "--error" : ""}`}
            placeholder="Confirm Password"
            text="Password"
            type="password"
            name="confirmpassword"
            defaultValue={this.state.confirmpassword}
            onChange={(event) => this.handleConfirmPasswordChange(event)}
            onBlur={this.comparePassword}
          />
          {/* {formErrors.password !== formErrors.confirmpassword && (
            <span className="errorMessage">{formErrors.confirmpassword}</span>
          )} */}

          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            pattern="[A-Za-z]{3,8}"
            value={this.state.first_name}
            onChange={this.handleChange}
          />
          {formErrors.first_name.length > 0 && (
            <span className="errorMessage">{formErrors.first_name}</span>
          )}

          <input
            placeholder="Last Name"
            type="text"
            name="last_name"
            pattern="[A-Za-z]{3,16}"
            value={this.state.last_name}
            onChange={this.handleChange}
          />
          {formErrors.last_name.length > 0 && (
            <span className="errorMessage">{formErrors.last_name}</span>
          )}

          {/* option field for company */}
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

          {/* option field for division */}
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
          <button type="submit">submit</button>
          <Link to={paths.users}>cancel</Link>
        </form>
      </div>
    );
  }
}

export default UserForm;

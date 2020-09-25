import React, { PureComponent, createRef } from "react";
import { createAdmin, updateAdmin } from "../../graphqlAPI";
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

const roleLevels = [
  { value: "super_admin", label: "Super Admin" },
  { value: "system_admin", label: "System Admin" },
  { value: "company_admin", label: "Company Admin" },
  { value: "division_admin", label: "Division Admin" },
];

const statusAdmin = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

class AdminForm extends PureComponent {
  constructor(props) {
    super(props);
    this.passwordOneRef = createRef();
    this.iconRevealPassword = createRef();
    this.state = {
      isPasswordReveal: false,
      email: props.user && props.user.email,
      first_name: props.user && props.user.first_name,
      last_name: props.user && props.user.last_name,
      role: props.user && props.user.role,
      status: props.user && props.user.status,
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
        status: "",
      },
      isUpdate: Boolean(props.user),
    };
  }

  // Check the length of the input
  checkPassLength = (password) => {
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

    this.checkPassLength(event.target.value);
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
    const { password, confirmpassword } = this.state;
    if (password !== confirmpassword) {
      alert("password not match");
      return null;
    }
    if (formValid(this.state)) {
      console.log(`
      --SUBMITTING--
      First Name: ${this.state.first_name}
      Last Name: ${this.state.last_name}
      Email: ${this.state.email}
      role: ${this.state.role}
      status: ${this.state.status}
      Password: ${this.state.password}
      `);
      if (this.state.isUpdate) {
        await updateAdmin(this.state.email, {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          status: this.state.status,
          password: this.state.password,
          role: this.state.role,
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
              window.location.href = paths.admins;
            }
          })
          .catch((e) => console.log(e));
      } else {
        await createAdmin({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          status: this.state.status,
          password: this.state.password,
          role: this.state.role,
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
              alert("Admin Created");
              window.location.href = paths.admins;
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

      case "last_name":
        formErrors.last_name =
          value.length < 2 ? "minimum 4 characters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address try again ";
        break;

      case "role":
        formErrors.role = value.length > 0 ? "" : "";
        break;
      case "status":
        formErrors.role = value.length > 0 ? "" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors, isPasswordReveal } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div className="form-container">
        {user.role.toString() === "system_admin" ? (
          <form onSubmit={this.handleSubmit}>
            <select
              onChange={this.handleChange}
              name="role"
              value={this.state.role}
            >
              <option selected hidden disabled>
                ---Please Select---
              </option>
              {roleLevels.map(({ value, label }) => (
                <option value={value}>{label}</option>
              ))}
            </select>

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

            <input
              placeholder="Email Address"
              type="email"
              name="email"
              required
              value={this.state.email}
              onChange={this.handleChange}
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}

            <div className="password">
              <input
                placeholder="Password"
                type={isPasswordReveal ? "text" : "password"}
                name="password"
                maxlength="20"
                ref={this.passwordOneRef}
                value={this.state.password}
                onChange={(event) => this.handlePasswordChange(event)}
              />

              <span onClick={this.togglePassword} ref={this.iconRevealPassword}>
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
              className={`input${this.state.match === false ? "--error" : ""}`}
              placeholder="Confirm Password"
              type="password"
              name="confirmpassword"
              maxLength="20"
              required
              value={this.state.confirmpassword}
              onChange={(event) => this.handleConfirmPasswordChange(event)}
              onBlur={this.comparePassword}
            />
            <input
              className="namefield"
              type="text"
              placeholder="First name"
              autoCapitalize="words"
              name="first_name"
              pattern="[A-Za-z\s]{2,17}"
              value={this.state.first_name}
              onChange={this.handleChange}
            />
            {formErrors.first_name.length > 0 && (
              <span className="errorMessage">{formErrors.first_name}</span>
            )}

            <input
              className="namefield"
              placeholder="Last name"
              type="text"
              name="last_name"
              pattern="[A-Za-z\s]{2,17}"
              value={this.state.last_name}
              onChange={this.handleChange}
            />
            {formErrors.last_name.length > 0 && (
              <span className="errorMessage">{formErrors.last_name}</span>
            )}

            <div className="confirm-section">
              <button type="submit">submit</button>
              <p>
                <Link to={paths.admins}>cancel</Link>
              </p>
            </div>
          </form>
        ) : user.role.toString() === "super_admin" ? (
          <form onSubmit={this.handleSubmit}>
            <select
              onChange={this.handleChange}
              name="role"
              value={this.state.role}
            >
              <option selected hidden disabled>
                ---Please Select---
              </option>
              {roleLevels.map(({ value, label }) => (
                <option value={value}>{label}</option>
              ))}
            </select>

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

            <input
              placeholder="Email Address"
              type="email"
              name="email"
              required
              value={this.state.email}
              onChange={this.handleChange}
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}

            <div className="password">
              <input
                placeholder="Password"
                type={isPasswordReveal ? "text" : "password"}
                name="password"
                maxlength="20"
                ref={this.passwordOneRef}
                value={this.state.password}
                onChange={(event) => this.handlePasswordChange(event)}
              />

              <span onClick={this.togglePassword} ref={this.iconRevealPassword}>
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
              className={`input${this.state.match === false ? "--error" : ""}`}
              placeholder="Confirm Password"
              type="password"
              name="confirmpassword"
              maxLength="20"
              required
              value={this.state.confirmpassword}
              onChange={(event) => this.handleConfirmPasswordChange(event)}
              onBlur={this.comparePassword}
            />
            <input
              className="namefield"
              type="text"
              placeholder="First name"
              autoCapitalize="words"
              name="first_name"
              pattern="[A-Za-z\s]{2,17}"
              value={this.state.first_name}
              onChange={this.handleChange}
            />
            {formErrors.first_name.length > 0 && (
              <span className="errorMessage">{formErrors.first_name}</span>
            )}

            <input
              className="namefield"
              placeholder="Last name"
              type="text"
              name="last_name"
              pattern="[A-Za-z\s]{2,17}"
              value={this.state.last_name}
              onChange={this.handleChange}
            />
            {formErrors.last_name.length > 0 && (
              <span className="errorMessage">{formErrors.last_name}</span>
            )}

            <div className="confirm-section">
              <button type="submit">submit</button>
              <p>
                <Link to={paths.admins}>cancel</Link>
              </p>
            </div>
          </form>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default AdminForm;

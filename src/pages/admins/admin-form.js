import React, { PureComponent, Fragment } from "react";
import { getUsers, getRoles, createUser } from "../../graphqlAPI";
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

class AdminForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user && props.user.email,
      first_name: props.user && props.user.first_name,
      last_name: props.user && props.user.last_name,
      role: props.user && props.user.role,
      companies: props.user && props.user.companies,
      divisions: props.user && props.user.divisions,
      password: null,
      confirmpassword: null,
      formErrors: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "",
        divisions: "",
        companies: "",
      },
    };
  }
  async componentDidMount() {
    const users = await getUsers();
    const roles = await getRoles();
    console.log(users);
    console.log(roles);
  }
  handleSubmit = async (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.first_name}
        Last Name: ${this.state.last_name}
        Email: ${this.state.email}
        role: ${this.state.role}
        companies: ${this.state.companies}
        divisions: ${this.state.divisions}
        Password: ${this.state.password}
      `);
      await createUser({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
        companies: this.state.companies,
        divisions: this.state.divisions,
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
            window.location.href = paths.admins;
            console.log(result);
          }
        })
        .catch((e) => console.log(e));
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

      case "companies":
        formErrors.companies = value.length > 0 ? "" : "please input companies";
        break;

      case "divisions":
        formErrors.divisions = value.length > 0 ? "" : "please input division";
        break;

      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address try again ";
        break;

      case "password":
        formErrors.password =
          value.length < 8 ? "minimum 8 characters required" : "";
        break;

      case "confirmpassword":
        formErrors.confirmpassword =
          formErrors.confirmpassword !== formErrors.password
            ? formErrors.password !== formErrors.confirmpassword
            : formErrors.password === formErrors.confirmPassword
            ? "password match"
            : "password does not match";
        break;

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
        <form onSubmit={this.handleSubmit} noValidate>
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

          <input
            placeholder="Email Address"
            text="Email Address"
            type="email"
            name="email"
            required
            noValidate
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
            noValidate
            value={this.state.password}
            onChange={this.handleChange}
          />
          {formErrors.password.length > 0 && (
            <span className="errorMessage">{formErrors.password}</span>
          )}
          <input
            placeholder="Confirm Password"
            text="Password"
            type="password"
            name="confirmpassword"
            noValidate
            value={this.state.confirmpassword}
            onChange={this.handleChange}
          />
          {formErrors.password !== formErrors.confirmpassword && (
            <span className="errorMessage">{formErrors.confirmpassword}</span>
          )}

          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            noValidate
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
            noValidate
            value={this.state.last_name}
            onChange={this.handleChange}
          />
          {formErrors.last_name.length > 0 && (
            <span className="errorMessage">{formErrors.last_name}</span>
          )}

          {roleLevels.findIndex(({ value }) => this.state.role === value) >
            1 && (
            <Fragment>
              <input
                type="text"
                placeholder="Company Name"
                name="companies"
                noValidate
                value={this.state.companies}
                onChange={this.handleChange}
              />
              {formErrors.companies.length > 0 && (
                <span className="errorMessage">{formErrors.companies}</span>
              )}
            </Fragment>
          )}

          {roleLevels.findIndex(({ value }) => this.state.role === value) >
            2 && (
            <Fragment>
              <input
                placeholder="Division"
                type="text"
                name="divisions"
                noValidate
                value={this.state.divisions}
                onChange={this.handleChange}
              />
              {formErrors.divisions.length > 0 && (
                <span className="errorMessage">{formErrors.divisions}</span>
              )}
            </Fragment>
          )}
          <button type="submit">submit</button>
          <Link to={paths.admins}>cancel</Link>
        </form>
      </div>
    );
  }
}

export default AdminForm;

import React, { PureComponent } from "react";
import { getUsers, getRoles, createUser } from "../../graphqlAPI";

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

class divisionForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      first_name: null,
      last_name: null,
      role: null,
      companies: null,
      divisions: null,
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
      alert("user Created");
      await createUser({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
        companies: this.state.companies,
        divisions: this.state.divisions,
      })
        .then((result) => console.log(result))
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
      <form onSubmit={this.handleSubmit} noValidate>
        <input
          placeholder="Email Address"
          text="Email Address"
          type="email"
          name="email"
          required
          noValidate
          onChange={this.handleChange}
        />
        {formErrors.email.length > 0 && (
          <span className="errorMessage">{formErrors.email}</span>
        )}

        <input
          type="text"
          placeholder="Company Name"
          name="companies"
          noValidate
          onChange={this.handleChange}
        />
        {formErrors.companies.length > 0 && (
          <span className="errorMessage">{formErrors.companies}</span>
        )}

        <input
          type="text"
          placeholder="First Name"
          name="first_name"
          noValidate
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
          onChange={this.handleChange}
        />
        {formErrors.last_name.length > 0 && (
          <span className="errorMessage">{formErrors.last_name}</span>
        )}
        <input
          placeholder="Division"
          type="text"
          name="divisions"
          noValidate
          onChange={this.handleChange}
        />
        {formErrors.divisions.length > 0 && (
          <span className="errorMessage">{formErrors.divisions}</span>
        )}
        <input
                placeholder="Password"
                text="Password"
                type="password"
                name="password"
                noValidate
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
                onChange={this.handleChange}
              />
              {formErrors.password !== formErrors.confirmpassword && (
                <span className="errorMessage">
                  {formErrors.confirmpassword}
                </span>
              )}

        <select onChange={this.handleChange} name="role">
          <option>---Please Select---</option>
          <option value="super_admin">Super Admin</option>
          <option value="system_admin">System Admin</option>
          <option value="company_admin">Company admin</option>
          <option value="division_admin">Division Admin</option>
          <option value="user">Users</option>
        </select>

        <button type="submit">submit</button>
      </form>
    );
  }
}

export default divisionForm;

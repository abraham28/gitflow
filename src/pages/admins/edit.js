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
      middle_name: props.user && props.user.middle_name,
      last_name: props.user && props.user.last_name,
      role: props.user && props.user.role,
      status: props.user && props.user.status,
      formErrors: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        role: "",
        status: "",
      },
      isUpdate: Boolean(props.user),
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmpassword } = this.state;
    if (password !== confirmpassword) {
      alert("password not match");
      return null;
    }
    if (formValid(this.state)) {
      const {
        first_name,
        middle_name,
        last_name,
        email,
        status,
        role,
      } = this.state;
      console.log(`
      --SUBMITTING--
      First Name: ${first_name}
      Middle Name: ${middle_name}
      Last Name: ${last_name}
      Email: ${email}
      role: ${role}
      status: ${status}
      `);
      if (this.state.isUpdate) {
        await updateAdmin(this.state.email, {
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          email: email,
          status: status,
          role: role,
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
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          email: email,
          status: status,
          role: role,
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

      case "middle_name":
        formErrors.middle_name =
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
    const { formErrors } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div className="form-container">
        {user.role.toString() === "system_admin" ? (
          <div className="forms">
            <h3>ADMIN &gt; Edit Admin</h3>
            <div className="form-box">
              <p className="form-title">Edit Admin Form</p>
              <form onSubmit={this.handleSubmit}>
                {/* name field first name, middle name, last name */}
                <div className="form-input">
                  <label>Last Name</label>
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
                </div>

                <div className="form-input">
                  <label>First Name</label>
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
                    <span className="errorMessage">
                      {formErrors.first_name}
                    </span>
                  )}
                </div>
                <div className="form-input">
                  <label>Middle Name</label>
                  <input
                    className="namefield"
                    type="text"
                    placeholder="Middle name"
                    autoCapitalize="words"
                    name="middle_name"
                    pattern="[A-Za-z\s]{2,17}"
                    value={this.state.middle_name}
                    onChange={this.handleChange}
                  />
                  {formErrors.middle_name.length > 0 && (
                    <span className="errorMessage">
                      {formErrors.middle_name}
                    </span>
                  )}
                </div>

                <label>Email</label>
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

                <div className="form-input">
                  <label>Role</label>
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
                </div>

                <div className="form-input">
                  <labe>Status</labe>
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

                <div className="confirm-section">
                  <button type="submit">Edit Admin</button>
                  <p>
                    <Link to={paths.admins}>cancel</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : user.role.toString() === "super_admin" ? (
          <div className="forms">
            <h3>ADMIN &gt; Add Admin</h3>
            <div className="form-box">
              <p className="form-title">Add Admin Form</p>
              <form onSubmit={this.handleSubmit}>
                {/* name field first name, middle name, last name */}
                <div className="form-input">
                  <label>Last Name</label>
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
                </div>

                <div className="form-input">
                  <label>First Name</label>
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
                    <span className="errorMessage">
                      {formErrors.first_name}
                    </span>
                  )}
                </div>
                <div className="form-input">
                  <label>Middle Name</label>
                  <input
                    className="namefield"
                    type="text"
                    placeholder="Middle name"
                    autoCapitalize="words"
                    name="middle_name"
                    pattern="[A-Za-z\s]{2,17}"
                    value={this.state.middle_name}
                    onChange={this.handleChange}
                  />
                  {formErrors.middle_name.length > 0 && (
                    <span className="errorMessage">
                      {formErrors.middle_name}
                    </span>
                  )}
                </div>

                <label>Email</label>
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
                <div className="form-input">
                  <label>Role</label>
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
                </div>

                <div className="form-input">
                  <labe>Status</labe>
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

                <div className="confirm-section">
                  <button type="submit">Edit Admin</button>
                  <p>
                    <Link to={paths.admins}>cancel</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default AdminForm;

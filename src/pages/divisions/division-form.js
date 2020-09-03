import React, { PureComponent, Fragment } from "react";
import { getCompanies, createDivision, updateUser } from "../../graphqlAPI";
import { Link } from "react-router-dom";
import paths from "../../resources/paths";

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

class DivisionForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      name: props.user && props.user.name,
      company_id: props.user && props.user.company_id,
      formErrors: {
        name: "",
        company_id: "",
      },
      isUpdate: Boolean(props.user),
    };
  }
  
  async componentDidMount() {
    const result = await getCompanies();
    this.setState({ companies: result.data.companies });
    console.log(result);
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
      if (this.state.isUpdate) {
        await updateUser(this.state.email, {
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
              alert(`${this.state.email} Updated!`);
              window.location.href = paths.admins;
              console.log(result);
            }
          })
          .catch((e) => console.log(e));
      } else {
        await createDivision({
          name: this.state.name,
          company_id: this.state.company_id,
        })
          .then((result) => {
            if (result.errors) {
              const uniq = new RegExp("Uniqueness violation");
              if (uniq.test(result.errors[0].message)) {
                alert("Division already exists");
              } else {
                alert(result.errors[0].message);
              }
            } else {
              alert("Division Created");
              window.location.href = paths.admins;
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
      case "name":
        formErrors.name =
          value.length < 0 ? "minimum 4 characters required" : "";
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

          {/* Name field */}
          <input
            type="text"
            placeholder="Name"
            name="name"
            noValidate
            value={this.state.name}
            onChange={this.handleChange}
          />
          {formErrors.name.length > 0 && (
            <span className="errorMessage">{formErrors.name}</span>
          )}

          {/* option field */}
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
            

          <button type="submit">submit</button>
          <Link to={paths.admins}>cancel</Link>
        </form>
      </div>
    );
  }
}

export default DivisionForm;

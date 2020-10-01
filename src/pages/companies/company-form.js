import React, { PureComponent } from "react";
import { createCompany, updateCompany } from "../../graphqlAPI";
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

class CompanyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: props.company && props.company.name,
      company_address: props.company && props.company.company_address,
      contact_person: props.company && props.company.contact_person,
      contact_details: props.company && props.company.contact_details,
      formErrors: {
        id: "",
        name: "",
        company_address: "",
        contact_person: "",
        contact_details: "",
        updated_at: "",
        created_at: "",
      },
      isUpdate: Boolean(props.company),
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      const {
        name,
        company_address,
        contact_person,
        contact_details,
      } = this.state;
      console.log(`
        --SUBMITTING--
          Name: ${name}
          Company Address: ${company_address}
          Contact Person: ${contact_person}
          Contact Details: ${contact_details}
      `);
      if (this.state.isUpdate) {
        await updateCompany(this.props.company.id, {
          name: name,
          company_address: company_address,
          contact_person: contact_person,
          contact_details: contact_details,
        })
          .then((result) => {
            if (result.errors) {
              const uniq = new RegExp("Uniqueness violation");
              if (uniq.test(result.errors[0].message)) {
                alert("Company Name already exists");
              } else {
                alert(result.errors[0].message);
              }
            } else {
              alert(`${this.state.name} Updated!`);
              window.location.href = paths.companies;
            }
          })
          .catch((e) => console.log(e));
      } else {
        await createCompany({
          name: this.state.name,
          company_address: company_address,
          contact_person: contact_person,
          contact_details: contact_details,
        })
          .then((result) => {
            if (result.errors) {
              const uniq = new RegExp("Uniqueness violation");
              if (uniq.test(result.errors[0].message)) {
                alert("Company Name already exists");
              } else {
                alert(result.errors[0].message);
              }
            } else {
              alert("Company Created");
              window.location.href = paths.companies;
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
        formErrors.name = value.length < 0 ? "Company Name Required" : "";
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
        <div className="forms">
          <h3>ADMIN &gt; Add Admin</h3>
          <div className="form-box">
            <p className="form-title">Add Company Form</p>

            <form onSubmit={this.handleSubmit}>
              <label>Company Name</label>
              <input
                placeholder="Company Name"
                type="text"
                name="name"
                defaultValue={this.state.name}
                onChange={this.handleChange}
              />
              {formErrors.name.length > 0 && (
                <span className="errorMessage">{formErrors.name}</span>
              )}

              <label>Company Address</label>
              <input
                placeholder="Company Address"
                type="text"
                name="company_address"
                defaultValue={this.state.company_address}
                onChange={this.handleChange}
              />

              <label>Contact Person</label>
              <input
                placeholder="Full Name"
                type="text"
                name="contact_person"
                defaultValue={this.state.contact_person}
                onChange={this.handleChange}
              />

              <label>Contact Details</label>
              <textarea
                placeholder="Contact Details"
                type="text"
                name="contact_details"
                value={this.state.contact_details}
                onChange={this.handleChange}
              />

              <div className="confirm-section">
                <button type="submit">submit</button>
                <p>
                  <Link to={paths.companies}>cancel</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyForm;

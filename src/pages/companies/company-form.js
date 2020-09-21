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
      formErrors: {
        id: '',
        name: '',
        updated_at: '',
        created_at: '',
      },
      isUpdate: Boolean(props.company),
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
          Name: ${this.state.name}
      `);
      if (this.state.isUpdate) {
        await updateCompany(this.props.company.id, {
          name: this.state.name,
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
        formErrors.name =
          value.length < 0 ?  "Company Name Required" : "";
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

          <input
            placeholder="Company Name"
            text="text"
            type="text"
            name="name"
            defaultValue={this.state.name}
            onChange={this.handleChange}
          />
          {formErrors.name.length > 0 && (
            <span className="errorMessage">{formErrors.name}</span>
          )}

          <div className="confirm-section">
          <button type="submit">submit</button>
          <p><Link to={paths.companies}>cancel</Link></p>
          </div>
        </form>
      </div>
    );
  }
}

export default CompanyForm;

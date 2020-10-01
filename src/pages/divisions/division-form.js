import React, { PureComponent } from "react";
import { getCompanies, createDivision, updateDivision } from "../../graphqlAPI";
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

class DivisionForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      name: props.division && props.division.name,
      company_id: props.division && props.division.company_id,
      description: props.division && props.division.description,
      formErrors: {
        name: "",
        company_id: "",
      },
      isUpdate: Boolean(props.division),
    };
  }

  // check if company data didMount
  async componentDidMount() {
    const result = await getCompanies();
    this.setState({ companies: result.data.companies });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Division Name: ${this.state.name}
        Company Name: ${this.state.company_id}
        description: ${this.state.description}
      `);
      if (this.state.isUpdate) {
        await updateDivision(this.props.division.id, {
          name: this.state.name,
          company_id: this.state.company_id,
          description: this.state.description,
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
              alert(`${this.state.name} Updated!`);
              window.location.href = paths.divisions;
            }
          })
          .catch((e) => console.log(e));
      } else {
        await createDivision({
          name: this.state.name,
          description:this.state.description,
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
              window.location.href = paths.divisions;
            }
          })
          .catch((e) => console.log(e));
      }
    } else {
      alert("FORM INVALID COMPLETE THE FORM");
    }
  };

  onChange = event => {
    this.setState({ name: event.target.value.replace(/[^\w\s]/gi, "") });
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
        <form onSubmit={this.handleSubmit}>
          {/* Name field */}
          <input
            type="text"
            placeholder="Division Name"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
          />
          {formErrors.name.length > 0 && (
            <span className="errorMessage">{formErrors.name}</span>
          )}

          <textarea
            placeholder="description"
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />

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
          <div className="confirm-section">
            <button type="submit">submit</button>
            <p>
              <Link to={paths.divisions}>cancel</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default DivisionForm;

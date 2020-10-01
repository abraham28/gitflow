import React, { PureComponent, createRef } from "react";
import {  updateLogin } from "../../graphqlAPI";
import { Link } from "react-router-dom";
import paths from "../../resources/paths";

class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.psswordOneRef = createRef();
    this.passwordTwoRef = createRef();
    this.iconRevealPassword = createRef();
    this.state = {
      email: "",
      currentpassword: "",
      password: "",
      confirmpassword: "",
      match: null,
      charNumberValid: false,
      specialCharValid: false,
      uppercaseValid: false,
      numberValid: false,
      isUpdate: Boolean(props.user),
    };
    
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
    const user = JSON.parse(localStorage.getItem("user"));
    const {
      currentpassword,
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

    // if (this.state.isUpdate) {
    //   await updateLogin(this.state.email, {
    //     password: password,
    //   })
    //     .then((result) => {
    //       if (result.errors) {
    //         const uniq = new RegExp("Uniqueness violation");
    //         if (uniq.test(result.errors[0].message)) {
    //           alert("Company Name already exists");
    //         } else {
    //           alert(result.errors[0].message);
    //         }
    //       } else {
    //         alert(`${this.state.name} Updated!`);
    //         window.location.href = paths.companies;
    //       }
    //     })
    //     .catch((e) => console.log(e));
    // } else {
    //   alert("FORM INVALID COMPLETE THE FORM");
    // }
  };

  componentDidMount() {
    const user = updateLogin();
    console.log(user)
    const users = JSON.parse(localStorage.getItem("user"));
    console.log(users);
  }

  render() {
    const { isPasswordReveal } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div className="setting-main">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="password">
              <label>Current Password</label>
              <input
                placeholder="Current Password"
                text="Password"
                type={isPasswordReveal ? "text" : "password"}
                name="currentpassword"
                maxLength="20"
                ref={this.passwordOneRef}
                defaultValue={user.password}
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
            <div className="password">
              <label>New Password</label>
              <input
                placeholder="New Password"
                text="Password"
                type={isPasswordReveal ? "text" : "password"}
                name="password"
                maxLength="20"
                ref={this.passwordTwoRef}
                defaultValue={this.state.password}
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
            <label>Confirm Password</label>
            <input
              className={`input${this.state.match === false ? "--error" : ""}`}
              placeholder="Confirm Password"
              text="Password"
              type="password"
              name="confirmpassword"
              maxLength="20"
              defaultValue={this.state.confirmpassword}
              onChange={(event) => this.handleConfirmPasswordChange(event)}
              onBlur={this.comparePassword}
            />
            <div className="confirm-section">
              <button type="submit">submit</button>
              <p>
                <Link to={paths.dashboard}>cancel</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Setting;

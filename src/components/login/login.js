import React, { PureComponent } from "react";
import "./login.scss";
import { login } from "../../graphqlAPI";
import paths from "../../resources/paths";

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      status: "",
      email: "",
      password: "",
      message: "Please fill up email and password",
      submitted: false,
      active: false,
    };
    const userJSON = localStorage.getItem("user");
    if (userJSON !== null) {
      window.location.href = paths.root;
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && password) {
      const { errors, data } = await login(email, password);
      if (errors) {
        alert("error detected");
        console.log(errors);
      } else if (!data || data.users.length < 1) {
        alert("incorrect email/password");
      } else {
        alert("Welcome back");
        localStorage.setItem("user", JSON.stringify(data.users[0]));
        window.location.href = paths.dashboard;
      }
    } else {
      const message = this.state.message;
      alert(message);
    }

  };

  render() {
    const { email, password, submitted } = this.state;
    return (
      <div className="login-container">
        <div className="login-holder">
          <h1>ADMIN LOGIN</h1>
          <div className="login-flex">
            <div className="input-icons">
              <form onSubmit={this.handleSubmit}>
                <i className="fa fa-envelope icon"></i>
                <input
                  className="input-field"
                  placeholder="Email address"
                  text="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  autoFocus
                />

                {submitted && !email && (
                  <div className="errorMessage">
                    Please fiil up email address
                  </div>
                )}

                <i className="fas fa-key icon icons"></i>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Password"
                  name="password"
                  text="password"
                  value={password}
                  onChange={this.handleChange}
                />

                {submitted && !password && (
                  <div className="errorMessage">
                    Please fill up the password
                  </div>
                )}

                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

import React, { PureComponent } from "react";
import "./login.scss";
import { Route, Link } from "react-router-dom";
import Register from "../register/register";
import { login, getUsers } from "../../graphqlAPI";
import Header from "../header/header";

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      message: "Please fill up email and password",
      submitted: false,
    };
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
        alert(JSON.stringify(data.users[0]));
        localStorage.setItem("user", JSON.stringify(data.users[0]));
        window.location.href = "/dashboard";
      }
    } else {
      const message = this.state.message;
      alert(message);
    }
  };
  async componentDidMount() {
    const users = await getUsers();
    console.log(users);
  }
  render() {
    const { email, password, submitted } = this.state;
    return (
      <div>
        <Header />
        <div className="background">
          <div className="login-container">
            <div className="login-holder">
              <h1>Login</h1>
              <div className="login-flex">
                <form onSubmit={this.handleSubmit}>
                  <input
                    placeholder="Email Address"
                    text="Email Address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />

                  {submitted && !email && (
                    <div className="errorMessage">
                      Please fiil up email address
                    </div>
                  )}

                  <input
                    type="password"
                    placeholder="password"
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
              <h2>Not Register yet?</h2>
              <div className="Register">
                <Link to="/register">Click Here</Link>
                <Route path="/register">
                  <Register />
                </Route>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
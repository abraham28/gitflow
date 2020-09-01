import React, { PureComponent } from "react";
import paths from "../../resources/paths";

class Homepage extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href = paths.login;
    }
    this.state = {
      user: JSON.parse(userJSON),
    };
  }

  render() {
    const user = this.state.user;
    return (
      <div>
        {user.role.toString() === "company_admin" ? (
          <div>Hello mother father admin</div>
        ) : user.role.toString() === "super_admin" ? (
          <div>Yow Superman</div>
        ) : (
          <div>Youre not welcome here</div>
        )}
      </div>
    );
  }
}

export default Homepage;

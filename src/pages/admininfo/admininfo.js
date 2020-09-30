import React, { PureComponent } from "react";
import "../../components/layout/reset.scss";
import "../../App.css";

class Information extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      gender,
      role,
      skill,
    } = JSON.parse(localStorage.getItem("user"));
    const  user  = JSON.parse(localStorage.getItem("user"));
    return (
      
      <div className="inner">
        
          <div className="user-container">
            <h1>
              Admin &gt; {first_name} {last_name}
            </h1>
            <div className="flex-container">
              <div class="personal-info">
                <p>Personal Information</p>
                <table>
                  <tbody>
                    <th>Name:</th>
                    <td>
                      {first_name} {last_name}
                    </td>
                  </tbody>

                  <tbody>
                    <th>Email:</th>
                    <td>{email}</td>
                  </tbody>
                  <tbody>
                    <th>Role:</th>
                    <td>{role}</td>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Information;

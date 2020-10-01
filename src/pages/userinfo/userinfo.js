import React, { PureComponent } from "react";
import "../../components/layout/reset.scss";
import "./userinfo.css";
import "../../App.css";

class Information extends PureComponent {
  render() {
    const {
      first_name,
      last_name,
      email,
      gender,
      position,
      company: { name: companyName },
      division: { name: divisionName },
      skill,
    } = JSON.parse(localStorage.getItem("user"));
    const  user  = JSON.parse(localStorage.getItem("user"));
    return (
      
      <div className="inner">
        
          <div className="user-container">
            <h1>
              User &gt; {first_name} {last_name}
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
                    <th>gender:</th>
                    <td>{gender}</td>
                  </tbody>
                </table>
              </div>
              <div class="company-info">
                <p>Company Information</p>
                <table>
                  <tbody>
                    <th>Position:</th>
                    <td>{position}</td>
                  </tbody>
                  <tbody>
                    <th>Company:</th>
                    <td>{divisionName}</td>
                  </tbody>
                  <tbody>
                    <th>Division:</th>
                    <td>{companyName}</td>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="right-container">
              <div className="skill-info">
                <p>Skills:</p>
                <p>{skill}</p>
              </div>
            </div>
          </div>
        
      </div>
    );
  }
}

export default Information;

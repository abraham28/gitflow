import React, { PureComponent } from "react";
import paths from "../../resources/paths";
import { getUsers } from "../../graphqlAPI";
import "./userinfo.css";
import "../../App.css";
import "../../components/layout/reset.scss";
class Information extends PureComponent {
  constructor(props) {
    super(props);
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      window.location.href = paths.login;
    }
    this.state = {
      tableUser: [
        {
          companyName: "",
          divisionName: "",
        },
      ],
    };
  }

  async componentDidMount() {
    await getUsers().then((result) => {
      this.setState({
        tableUser: result.data.users.map((val) => ({
          ...val,
          companyName: val.company.name,
          divisionName: val.division.name,
        })),
      });
    });
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      gender,
      position,
      company_id,
      division_id,
      skill,
    } = JSON.parse(localStorage.getItem("user"));
    const { tableUser } = this.state;
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
                  <td>{company_id}</td>
                </tbody>
                <tbody>
                  <th>Division:</th>
                  <td>{division_id}</td>
                </tbody>

                {/* <tbody>
                  {tableUser.length > 0 ? (
                    this.state.tableUser.map((user, index) => {
                      const { companyName, divisionName } = user;
                      return (
                        <tr key={index}>
                          <th>Company:</th>
                          <th>{companyName}</th>
                        </tr>
                        
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">No data to display...</td>
                    </tr>
                  )}
                </tbody> */}
              </table>
            </div>
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

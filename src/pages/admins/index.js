import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";
import "../pages.scss";
import { getUsers } from "../../graphqlAPI";

class Admins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          email: "",
          first_name: "",
          last_name: "",
          role: "",
          created_at: "",
          updated_at: "",
        },
      ],
    };
  }

  async componentDidMount() {
    const { users } = this.props;
    await getUsers(users).then((data) => {
      this.setState({ tableUser: data.data.users });
    });
  }

  render() {
    const { tableUser } = this.state;
    return (
      <div className="super-container">
        <h2>Admins</h2>
        <NavLink to="/superadmin/superform">
          <button type="button" className="btn btn-info">
            Add
          </button>
        </NavLink>
        <div className="tableData">
          <h1 id="title">Table Data</h1>
          <table id="usersdata">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableUser.length > 0 ? (
                tableUser.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{user.email}</td>
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.role}</td>
                      <td className="btn-container">
                        <button className="edit">edit</button>
                        <button className="delete">delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Admins;

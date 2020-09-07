import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getUsers, deleteUser } from "../../graphqlAPI";
import paths from "../../resources/paths";
import UserForm from "./user-form";

class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          email: "",
          first_name: "",
          last_name: "",
          role: "",
          companyName: "",
          divisionName: "",
          created_at: "",
          updated_at: "",
        },
      ],
      selectedUser: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    // const users = await getUsers();
    // await getUsers(users).then((result) => {
    //   this.setState({ tableUser: result.data.users });
    // });

    await getUsers().then((result) => {
      console.log(result);
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
    const { tableUser } = this.state;
    return (
      <Switch>
        {this.state.redirect &&
          window.location.href !== this.state.redirect &&
          (() => {
            this.setState({ redirect: null });
            return <Redirect to={this.state.redirect} push />;
          })()}
        <Route path={paths.usersForm}>
          <UserForm user={this.state.selectedUser} />
        </Route>
        <Route>
          <div className="super-container">
            <h2>Users</h2>
            <NavLink
              to={paths.usersForm}
              onClick={() => this.setState({ selectedUser: null })}
            >
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
                    <th>Company</th>
                    <th>Division</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    tableUser.map((user, index) => {
                      const {
                        email,
                        first_name,
                        last_name,
                        role,
                        companyName,
                        divisionName,
                      } = user;
                      return (
                        <tr key={index}>
                          <td>{email}</td>
                          <td>
                            {first_name} {last_name}
                          </td>
                          <td>{companyName}</td>
                          <td>{divisionName}</td>
                          <td>{role}</td>
                          <td className="btn-container">
                            <button
                              className="edit"
                              onClick={() => {
                                this.setState({
                                  selectedUser: user,
                                  redirect: paths.usersForm,
                                });
                              }}
                            >
                              edit
                            </button>
                            <button
                              className="delete"
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  `are you sure you want to delete ${user.email}`
                                );
                                if (confirmed) {
                                  deleteUser(user.email).then((result) => {
                                    if (result.errors) {
                                      alert(result.errors);
                                    } else if (
                                      result.data.delete_users_by_pk === null
                                    ) {
                                      alert("no user has been deleted");
                                    } else if (
                                      result.data.delete_users_by_pk.email
                                    ) {
                                      this.componentDidMount();
                                      alert(
                                        `${result.data.delete_users_by_pk.email} has been deleted`
                                      );
                                    } else {
                                      alert("unknown error");
                                    }
                                  });
                                }
                              }}
                            >
                              delete
                            </button>
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
        </Route>
      </Switch>
    );
  }
}

export default Users;

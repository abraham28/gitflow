import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getAdmin, deleteUser } from "../../graphqlAPI";
import AdminForm from "./admin-form";
import paths from "../../resources/paths";

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
      selectedUser: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    const users = await getAdmin();
    await getAdmin(users).then((result) => {
      this.setState({ tableUser: result.data.users });
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
        <Route path={paths.adminsForm}>
          <AdminForm user={this.state.selectedUser} />
        </Route>
        <Route>
          <div className="super-container">
            <h2>Admins</h2>
            <NavLink
              to={paths.adminsForm}
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
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    tableUser.map((user, index) => {
                      const { email, first_name, last_name, role } = user;
                      return (
                        <tr key={index}>
                          <td>{email}</td>
                          <td>
                            {first_name} {last_name}
                          </td>
                          <td>{role}</td>
                          <td className="btn-container">
                            <button
                              className="edit"
                              onClick={() => {
                                this.setState({
                                  selectedUser: user,
                                  redirect: paths.adminsForm,
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

export default Admins;

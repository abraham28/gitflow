import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getAdmin, deleteUsers } from "../../graphqlAPI";
import AdminForm from "./admin-form";
import paths from "../../resources/paths";
import AdminEdit from "./edit";
import View from "./view";
import PageNotFound, { RedirectNotFound } from "../pagenotfound";

const sortTypes = {
  up: {
    class: "sort-up",
    fn: (a, b) =>
      a.email > b.email ? 1 : a.first_name > b.first_name ? 1 : "",
  },
  down: {
    class: "sort-down",
    fn: (a, b) =>
      a.email < b.email ? -1 : a.first_name > b.first_name ? -1 : "",
  },
  default: {
    class: "sort",
    fn: (a, b) => a,
  },
};
class Admins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      content: "",
      currentSort: "default",
      tableUser: [
        {
          status: "",
          email: "",
          first_name: "",
          middle_name: "",
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

  onSortChange = () => {
    const { currentSort } = this.state;
    let nextSort;

    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "default";
    else if (currentSort === "default") nextSort = "down";

    this.setState({
      currentSort: nextSort,
    });
  };

  async componentDidMount() {
    const users = await getAdmin();
    console.log(users);
    await getAdmin(users).then((result) => {
      this.setState({
        tableUser: result.data.admins,
        isLoading: false,
        result,
      });
    });
  }
  render() {
    const { tableUser, currentSort, loggedInStatus } = this.state;

    tableUser.sort((a, b) =>
      a.first_name > b.first_name ? 1 : b.first_name > a.first_name ? -1 : 0
    );
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && this.state.loggedInStatus === "inactive") {
      this.setState({
        loggedInStatus: "active",
      });
    } else if (!user & (this.state.loggedInStatus === "active")) {
      this.setState({
        loggedInStatus: "inactive",
      });
    }
    console.log(loggedInStatus);
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
        <Route path={paths.adminsEdit}>
          <AdminEdit user={this.state.selectedUser} />
        </Route>
        <Route path={paths.viewsAdmin}>
          <View user={this.state.selectedUser} />
        </Route>
        <Route>
          {user.role.toString() === "system_admin" ? (
            <div className="super-container">
              <div className="block01">
                <h2>ADMIN PAGE</h2>
                {loggedInStatus}
                <p className="btn1">
                  <NavLink
                    to={paths.adminsForm}
                    onClick={() => this.setState({ selectedUser: null })}
                  >
                    ADD ADMIN<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="tableData">
                <h1 id="title">Admin Data</h1>
                {tableUser.length > 0 ? (
                  <table id="usersdata">
                    <thead>
                      <tr>
                        <th>
                          Email
                          <button
                            className="sort-button"
                            onClick={this.onSortChange}
                          >
                            <i
                              className={`fas fa-${sortTypes[currentSort].class}`}
                            />
                          </button>
                        </th>

                        <th>
                          Full Name
                          <button
                            className="sort-button"
                            onClick={this.onSortChange}
                          >
                            <i
                              className={`fas fa-${sortTypes[currentSort].class}`}
                            />
                          </button>
                        </th>

                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...tableUser]
                        .sort(sortTypes[currentSort].fn)
                        .map((user, index) => {
                          const {
                            email,
                            first_name,
                            middle_name,
                            last_name,
                            role,
                            status,
                          } = user;
                          return (
                            <tr key={index}>
                              <td>{email}</td>
                              <td>
                                {first_name} {middle_name} {last_name}
                              </td>
                              <td>{role}</td>
                              <td>{status}</td>
                              <td className="btn-container">
                                <button
                                  className="edit"
                                  onClick={() => {
                                    this.setState({
                                      selectedUser: user,
                                      redirect: paths.viewsAdmin,
                                    });
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className="edit"
                                  onClick={() => {
                                    this.setState({
                                      selectedUser: user,
                                      redirect: paths.adminsEdit,
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
                                      deleteUsers(user.email).then((result) => {
                                        if (result.errors) {
                                          alert(result.errors);
                                        } else if (
                                          result.data.delete_users_by_pk ===
                                          null
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
                        })}
                    </tbody>
                  </table>
                ) : (
                  <tr>
                    <td colSpan="5">No data to display...</td>
                  </tr>
                )}
              </div>
            </div>
          ) : user.role.toString() === "super_admin" ? (
            <div className="super-container">
              <div className="block01">
                <h2>ADMIN PAGE</h2>
                <p className="btn1">
                  <NavLink
                    to={paths.adminsForm}
                    onClick={() => this.setState({ selectedUser: null })}
                  >
                    ADD ADMIN<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="tableData">
                <h1 id="title">Admin Data</h1>
                {tableUser.length > 0 ? (
                  <table id="usersdata">
                    <thead>
                      <tr>
                        <th>
                          Email
                          <button
                            className="sort-button"
                            onClick={this.onSortChange}
                          >
                            <i
                              className={`fas fa-${sortTypes[currentSort].class}`}
                            />
                          </button>
                        </th>

                        <th>Full Name</th>

                        <th>Role</th>

                        <th>Status</th>

                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...tableUser]
                        .sort(sortTypes[currentSort].fn)
                        .map((user, index) => {
                          const {
                            email,
                            first_name,
                            middle_name,
                            last_name,
                            role,
                            status,
                          } = user;
                          return (
                            <tr key={index}>
                              <td>{email}</td>
                              <td>
                                {first_name} {middle_name} {last_name}
                              </td>
                              <td>{role}</td>
                              <td>{status}</td>
                              <td className="btn-container">
                                <button
                                  className="edit"
                                  onClick={() => {
                                    this.setState({
                                      selectedUser: user,
                                      redirect: paths.viewsAdmin,
                                    });
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className="edit"
                                  onClick={() => {
                                    this.setState({
                                      selectedUser: user,
                                      redirect: paths.adminsEdit,
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
                                      deleteUsers(user.email).then((result) => {
                                        if (result.errors) {
                                          alert(result.errors);
                                        } else if (
                                          result.data.delete_users_by_pk ===
                                          null
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
                        })}
                    </tbody>
                  </table>
                ) : (
                  <tr>
                    <td colSpan="5">No data to display...</td>
                  </tr>
                )}
              </div>
            </div>
          ) : (
            <p>admin role only</p>
          )}
        </Route>
      </Switch>
    );
  }
}

export default Admins;

import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getUsers, deleteUser } from "../../graphqlAPI";
import paths from "../../resources/paths";
import UserForm from "./user-form";

const sortTypes = {
  up: {
    class: "sort-up",
    fn: (a, b) => a.mobile - b.mobile,
  },
  down: {
    class: "sort-down",
    fn: (a, b) => b.mobile - a.mobile,
  },
  default: {
    class: "sort",
    fn: (a, b) => a,
  },
};

class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSort: "default",
      tableUser: [
        {
          email: "",
          first_name: "",
          last_name: "",
          role: "",
          companyName: "",
          divisionName: "",
          mobile: "",
          created_at: "",
          updated_at: "",
        },
      ],
      selectedUser: null,
      redirect: null,
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

  render() {
    const { tableUser, currentSort } = this.state;
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
            <div className="block01">
              <h2>USER PAGE</h2>
              <p className="btn1">
                <NavLink
                  to={paths.usersForm}
                  onClick={() => this.setState({ selectedUser: null })}
                >
                  ADD USER<i className="fas fa-plus"></i>
                </NavLink>
              </p>
            </div>
            <div className="tableData">
              <h1 id="title">User Data</h1>
              <table id="usersdata">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Company</th>
                    <th>Division</th>
                    <th>Mobile
                    <button className="sort-button" onClick={this.onSortChange}>
                      <i className={`fas fa-${sortTypes[currentSort].class}`} />
                    </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    [...tableUser]
                      .sort(sortTypes[currentSort].fn)
                      .map((user, index) => {
                        const {
                          email,
                          first_name,
                          last_name,
                          companyName,
                          divisionName,
                          mobile,
                        } = user;
                        return (
                          <tr key={index}>
                            <td>{email}</td>
                            <td>
                              {first_name} {last_name}
                            </td>
                            <td>{companyName}</td>
                            <td>{divisionName}</td>
                            <td>{mobile}</td>
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
                      <td colSpan="6">No data to display...</td>
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
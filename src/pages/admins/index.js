import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getAdmin, deleteUser } from "../../graphqlAPI";
import AdminForm from "./admin-form";
import paths from "../../resources/paths";

// const array = ['mozzarella', 'gouda', 'cheddar'];
// array.sort();
// console.log(array); // ['cheddar', 'gouda', 'mozzarella']

const sortTypes = {
  up: {
    class: "sort-up",
    fn: (a, b) => a.email - b.email, 

  },
  down: {
    class: "sort-down",
    fn: (a, b) => b.email - a.email,

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
    // this.onSort = this.onSort.bind(this);
  }
  // onSort(event, sortKey) {
  //   const result = this.state.tableUser;
  //   result.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  //   this.setState({ result });
  // }

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
    await getAdmin(users).then((result) => {
      this.setState({ tableUser: result.data.users, isLoading: false, result });
    });
  }
  render() {
    const { tableUser, currentSort } = this.state;
    console.log(currentSort);
    console.log(tableUser);
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

                      <th>
                        Full Name
                      </th>

                      <th>Role</th>

                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tableUser].sort(sortTypes[currentSort].fn).map((user, index) => {
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
        </Route>
      </Switch>
    );
  }
}

export default Admins;

import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getDivisions, deleteDivision } from "../../graphqlAPI";
import DivisionForm from "./division-form";
import paths from "../../resources/paths";
import Pagination from "../../components/pagination/pagination";

class Divisions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageOfItems: [],
      tableUser: [
        {
          id: "",
          name: "",
          updated_at: "",
          // companyName: "",
          users: 0,
          companies: 0,
          description: "",
        },
      ],
      selectedDivision: null,
      redirect: null,
    };
    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  async componentDidMount() {
    await getDivisions().then((result) => {
      this.setState({
        tableUser: result.data.divisions.map((val) => ({
          ...val,
          users: val.users_aggregate.aggregate.count,
        })),
      });
    });
  }

  render() {
    const { tableUser, pageOfItems } = this.state;
    tableUser.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <Switch>
        {this.state.redirect &&
          window.location.href !== this.state.redirect &&
          (() => {
            this.setState({ redirect: null });
            return <Redirect to={this.state.redirect} push />;
          })()}
        <Route path={paths.divisionsForm}>
          <DivisionForm division={this.state.selectedDivision} />
        </Route>
        <Route>
          {user.role.toString() === "division_admin" ? (
            <div className="super-container">
              <div className="block01">
                <h2>DIVISION PAGE</h2>
              </div>
              <div className="table-header">
                <p className="table-title">Divisions List</p>
                <p className="btnAdd">
                  <NavLink
                    to={paths.divisionsForm}
                    onClick={() => this.setState({ selectedDivision: null })}
                  >
                    ADD DIVISION<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="table-main">
                <Pagination
                  items={tableUser}
                  onChangePage={this.onChangePage}
                />
                <table id="usersdata">
                  <thead>
                    <tr>
                      <th>Division</th>
                      <th>Description</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOfItems.length > 0 ? (
                      pageOfItems.map((divisions, index) => {
                        const { name, description, users } = divisions;
                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{users.toString()}</td>
                            <td className="btn-container">
                              <button
                                className="edit"
                                onClick={() => {
                                  this.setState({
                                    selectedDivision: divisions,
                                    redirect: paths.divisionsForm,
                                  });
                                }}
                              >
                                edit
                              </button>
                              <button
                                className="delete"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `are you sure you want to delete ${divisions.name}`
                                  );
                                  if (confirmed) {
                                    deleteDivision(divisions.id).then(
                                      (result) => {
                                        if (result.errors) {
                                          alert(
                                            "Cant delete data, Delete users first"
                                          );
                                        } else if (
                                          result.data.delete_divisions_by_pk ===
                                          null
                                        ) {
                                          alert("no user has been deleted");
                                        } else if (
                                          result.data.delete_divisions_by_pk
                                            .name
                                        ) {
                                          this.componentDidMount();
                                          alert(
                                            `${result.data.delete_divisions_by_pk.name} has been deleted`
                                          );
                                        } else {
                                          alert("unknown error");
                                        }
                                      }
                                    );
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
                        <td colSpan="5">No data to display...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : user.role.toString() === "system_admin" ? (
            <div className="super-container">
              <div className="block01">
                <h2>DIVISION PAGE</h2>
              </div>
              <div className="table-header">
                <p className="table-title">Divisions List</p>
                <p className="btnAdd">
                  <NavLink
                    to={paths.divisionsForm}
                    onClick={() => this.setState({ selectedDivision: null })}
                  >
                    ADD DIVISION<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="table-main">
                <Pagination
                  items={tableUser}
                  onChangePage={this.onChangePage}
                />
                <table id="usersdata">
                  <thead>
                    <tr>
                      <th>Division</th>
                      <th>Description</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOfItems.length > 0 ? (
                      pageOfItems.map((divisions, index) => {
                        const { name, description, users } = divisions;
                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{users.toString()}</td>
                            <td className="btn-container">
                              <button
                                className="edit"
                                onClick={() => {
                                  this.setState({
                                    selectedDivision: divisions,
                                    redirect: paths.divisionsForm,
                                  });
                                }}
                              >
                                edit
                              </button>
                              <button
                                className="delete"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `are you sure you want to delete ${divisions.name}`
                                  );
                                  if (confirmed) {
                                    deleteDivision(divisions.id).then(
                                      (result) => {
                                        if (result.errors) {
                                          alert(
                                            "Cant delete data, Delete users first"
                                          );
                                        } else if (
                                          result.data.delete_divisions_by_pk ===
                                          null
                                        ) {
                                          alert("no user has been deleted");
                                        } else if (
                                          result.data.delete_divisions_by_pk
                                            .name
                                        ) {
                                          this.componentDidMount();
                                          alert(
                                            `${result.data.delete_divisions_by_pk.name} has been deleted`
                                          );
                                        } else {
                                          alert("unknown error");
                                        }
                                      }
                                    );
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
                        <td colSpan="5">No data to display...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : user.role.toString() === "super_admin" ? (
            <div className="super-container">
              <div className="block01">
                <h2>DIVISION PAGE</h2>
              </div>
              <div className="table-header">
                <p className="table-title">Divisions List</p>
                <p className="btnAdd">
                  <NavLink
                    to={paths.divisionsForm}
                    onClick={() => this.setState({ selectedDivision: null })}
                  >
                    ADD DIVISION<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="table-main">
                <Pagination
                  items={tableUser}
                  onChangePage={this.onChangePage}
                />
                <table id="usersdata">
                  <thead>
                    <tr>
                      <th>Division</th>
                      <th>Description</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOfItems.length > 0 ? (
                      pageOfItems.map((divisions, index) => {
                        const { name, description, users } = divisions;
                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{users.toString()}</td>
                            <td className="btn-container">
                              <button
                                className="edit"
                                onClick={() => {
                                  this.setState({
                                    selectedDivision: divisions,
                                    redirect: paths.divisionsForm,
                                  });
                                }}
                              >
                                edit
                              </button>
                              <button
                                className="delete"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `are you sure you want to delete ${divisions.name}`
                                  );
                                  if (confirmed) {
                                    deleteDivision(divisions.id).then(
                                      (result) => {
                                        if (result.errors) {
                                          alert(
                                            "Cant delete data, Delete users first"
                                          );
                                        } else if (
                                          result.data.delete_divisions_by_pk ===
                                          null
                                        ) {
                                          alert("no user has been deleted");
                                        } else if (
                                          result.data.delete_divisions_by_pk
                                            .name
                                        ) {
                                          this.componentDidMount();
                                          alert(
                                            `${result.data.delete_divisions_by_pk.name} has been deleted`
                                          );
                                        } else {
                                          alert("unknown error");
                                        }
                                      }
                                    );
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
                        <td colSpan="5">No data to display...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div> Division Role Only</div>
          )}
        </Route>
      </Switch>
    );
  }
}

export default Divisions;

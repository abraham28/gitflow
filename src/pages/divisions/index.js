import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getDivisions, deleteUser } from "../../graphqlAPI";
import DivisionForm from "./division-form";
import paths from "../../resources/paths";
import { formatDate } from "../../helpers";

class Divisions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          id: "",
          name: "",
          updated_at: "",
          companyName: "",
          users: 0,
        },
      ],
      selectedUser: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    await getDivisions().then((result) => {
      this.setState({
        tableUser: result.data.divisions.map((val) => ({
          ...val,
          companyName: val.company.name,
          users: val.users_aggregate.aggregate.count,
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
        <Route path={paths.divisionsForm}>
          <DivisionForm user={this.state.selectedUser} />
        </Route>
        <Route>
          <div className="super-container">
            <h2>Division</h2>
            <NavLink
              to={paths.divisionsForm}
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
                    <th>Division</th>
                    <th>Company Name</th>
                    <th>Users</th>
                    <th>Updated at</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    tableUser.map((divisions, index) => {
                      return (
                        <tr key={index}>
                          <td>{divisions.name}</td>
                          <td> {divisions.companyName} </td>
                          <td>{divisions.users.toString()}</td>
                          <td>{formatDate(divisions.updated_at)}</td>
                          <td className="btn-container">
                            <button
                              className="edit"
                              onClick={() => {
                                this.setState({
                                  selectedUser: divisions,
                                  redirect: paths.divisionsForm,
                                });
                              }}
                            >
                              edit
                            </button>
                            <button
                              className="delete"
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  `are you sure you want to delete ${divisions.email}`
                                );
                                if (confirmed) {
                                  deleteUser(divisions.email).then((result) => {
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

export default Divisions;

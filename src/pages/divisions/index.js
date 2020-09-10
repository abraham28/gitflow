import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getDivisions, deleteDivision } from "../../graphqlAPI";
import DivisionForm from "./division-form";
import paths from "../../resources/paths";


class Divisions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          id: "",
          name: "",
          updated_at: "",
          // companyName: "",
          users: 0,
        },
      ],
      selectedDivision: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    await getDivisions().then((result) => {
      console.log(result);
      this.setState({
        tableUser: result.data.divisions.map((val) => ({
          ...val,
          users: val.users_aggregate.aggregate.count,
          // companyName: val.company.name,   
        })),   
      });
    });
  }

  render() {
    const { tableUser } = this.state;
    console.log(tableUser);
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
          <div className="super-container">
            <h2>Division</h2>
            <NavLink
              to={paths.divisionsForm}
              onClick={() => this.setState({ selectedDivision: null })}
            >
              <button type="button" className="btn btn-info">
                Add
              </button>
            </NavLink>
            <div className="tableData">
              <h1 id="title">Division Data</h1>
              <table id="usersdata">
                <thead>
                  <tr>
                    <th>Division</th>
                     {/* <th>Company Name</th> */}
                    <th>Users</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    tableUser.map((divisions, index) => {
                      const {
                        name,
                        // companyName,
                        users,
                      } = divisions;
                      return (
                        <tr key={index}>
                          <td>{name}</td>
                           {/* <td> {companyName} </td> */}
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
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  `are you sure you want to delete ${divisions.name}`
                                );
                                if (confirmed) {
                                  deleteDivision(divisions.id).then((result) => {
                                    if (result.errors) {
                                      alert(result.errors);
                                    } else if (
                                      result.data.delete_divisions_by_pk === null
                                    ) {
                                      alert("no user has been deleted");
                                    } else if (
                                      result.data.delete_divisions_by_pk.name
                                    ) {
                                      this.componentDidMount();
                                      alert(
                                        `${result.data.delete_divisions_by_pk.name} has been deleted`
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

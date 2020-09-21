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
      this.setState({
        tableUser: result.data.divisions.map((val) => ({
          ...val,
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
          <DivisionForm division={this.state.selectedDivision} />
        </Route>
        <Route>
          <div className="super-container">
          <div className="block01">
              <h2>DIVISION PAGE</h2>
            <p className="btn1">
              <NavLink
                to={paths.divisionsForm}
                onClick={() => this.setState({ selectedDivision: null })}
              >
                ADD DIVISION<i className="fas fa-plus"></i>
              </NavLink>
            </p>
            </div>
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
                              onClick={ () => {
                                const confirmed = window.confirm(
                                  `are you sure you want to delete ${divisions.name}`
                                );
                                if (confirmed) {
                                  deleteDivision(divisions.id).then((result) => {
                                    if (result.errors) {
                                      alert('Cant delete data, Delete users first');
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
                      <td colSpan="5">No data to display...</td>
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

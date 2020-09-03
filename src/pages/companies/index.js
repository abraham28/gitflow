import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getCompanies, deleteCompany } from "../../graphqlAPI";
import CompanyForm from "./company-form";
import paths from "../../resources/paths";
import { formatDate } from "../../helpers";

class Admins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          id: "",
          name: "",
          divisions: 0,
          created_at: "",
          updated_at: "",
          users: 0,
        },
      ],
      selectedUser: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    await getCompanies().then((result) => {
      this.setState({
        tableUser: result.data.companies.map((val) => ({
          ...val,
          users: val.users_aggregate.aggregate.count,
          divisions: val.divisions_aggregate.aggregate.count,
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
        <Route path={paths.companiesForm}>
          <CompanyForm user={this.state.selectedUser} />
        </Route>
        <Route>
          <div className="super-container">
            <h2>Companies</h2>
            <NavLink to={paths.companiesForm}>
              <button type="button" className="btn btn-info">
                Add
              </button>
            </NavLink>
            <div className="tableData">
              <h1 id="title">Table Data</h1>
              <table id="usersdata">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Division</th>
                    <th>Users</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUser.length > 0 ? (
                    tableUser.map((companies, index) => {
                      const {
                        name,
                        divisions,
                        users,
                        created_at,
                        updated_at,
                      } = companies;
                      return (
                        <tr key={index}>
                          <td>{name}</td>
                          <td>{divisions}</td>
                          <td>{users.toString()}</td>
                          <td>{formatDate(created_at)}</td>
                          <td>{formatDate(updated_at)}</td>
                          <td className="btn-container">
                            <button
                              className="edit"
                              onClick={() => {
                                this.setState({
                                  selectedUser: companies,
                                  redirect: paths.companiesForm,
                                });
                              }}
                            >
                              edit
                            </button>
                            <button
                              className="delete"
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  `are you sure you want to delete ${companies.name}`
                                );
                                if (confirmed) {
                                  deleteCompany(companies.id).then((result) => {
                                    if (result.errors) {
                                      alert(result.errors);
                                    } else if (
                                      result.data.delete_companies_by_pk === null
                                    ) {
                                      alert("no user has been deleted");
                                    } else if (
                                      result.data.delete_companies_by_pk.name
                                    ) {
                                      this.componentDidMount();
                                      alert(
                                        `${result.data.delete_companies_by_pk.name} has been deleted`
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

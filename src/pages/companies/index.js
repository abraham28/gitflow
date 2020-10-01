import React, { PureComponent } from "react";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import "../pages.scss";
import { getCompanies, deleteCompany } from "../../graphqlAPI";
import CompanyForm from "./company-form";
import paths from "../../resources/paths";
import Pagination from "../../components/pagination/pagination";

class Admins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageOfItems: [],
      companies: [
        {
          company_address: "",
          contact_person: "",
          contact_details: "",
          id: "",
          name: "",
          divisions: 0,
          created_at: "",
          updated_at: "",
          users: 0,
        },
      ],
      selectedCompany: null,
      redirect: null,
    };
    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  async componentDidMount() {
    await getCompanies().then((result) => {
      this.setState({
        companies: result.data.companies.map((val) => ({
          ...val,
          users: val.users_aggregate.aggregate.count,
          divisions: val.divisions_aggregate.aggregate.count,
        })),
      });
    });
  }

  render() {
    const { companies, pageOfItems } = this.state;
    companies.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <Switch>
        {this.state.redirect &&
          window.location.href !== this.state.redirect &&
          (() => {
            this.setState({ redirect: null });
            return <Redirect to={this.state.redirect} push />;
          })()}
        <Route path={paths.companiesForm}>
          <CompanyForm company={this.state.selectedCompany} />
        </Route>
        <Route>
          {user.role.toString() === "company_admin" ? (
            <div className="super-container">
            <div className="block01">
              <h2>COMPANY PAGE</h2>
            </div>
            <div className="table-header">
              <p className="table-title">Company List</p>
              <p className="btnAdd">
                <NavLink
                  to={paths.companiesForm}
                  onClick={() => this.setState({ selectedCompany: null })}
                >
                  ADD COMPANY<i className="fas fa-plus"></i>
                </NavLink>
              </p>
            </div>
            <div className="table-main">
              <Pagination
                items={companies}
                onChangePage={this.onChangePage}
              />
              <table id="usersdata">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th> Company Address </th>
                    <th>Contact Person</th>
                    <th>Contact Detail</th>
                    <th>Division</th>
                    <th>Users</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageOfItems.length > 0 ? (
                    pageOfItems.map((company, index) => {
                      const {
                        name,
                        divisions,
                        users,
                        company_address,
                        contact_person,
                        contact_details,
                      } = company;
                      return (
                        <tr key={index}>
                          <td>{name}</td>
                          <td>{company_address}</td>
                          <td>{contact_person}</td>
                          <td>{contact_details}</td>
                          <td>{divisions}</td>
                          <td>{users.toString()}</td>
                          <td className="btn-container">
                            <button
                              className="edit"
                              onClick={() => {
                                this.setState({
                                  selectedCompany: company,
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
                                  `are you sure you want to delete ${company.name}`
                                );
                                if (confirmed) {
                                  deleteCompany(company.id).then((result) => {
                                    if (result.errors) {
                                      alert(
                                        "Cant delete data. Delete users first, then division"
                                      );
                                    } else if (
                                      result.data.delete_companies_by_pk ===
                                      null
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
                <h2>COMPANY PAGE</h2>
              </div>
              <div className="table-header">
                <p className="table-title">Company List</p>
                <p className="btnAdd">
                  <NavLink
                    to={paths.companiesForm}
                    onClick={() => this.setState({ selectedCompany: null })}
                  >
                    ADD COMPANY<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="table-main">
                <Pagination
                  items={companies}
                  onChangePage={this.onChangePage}
                />
                <table id="usersdata">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th> Company Address </th>
                      <th>Contact Person</th>
                      <th>Contact Detail</th>
                      <th>Division</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOfItems.length > 0 ? (
                      pageOfItems.map((company, index) => {
                        const {
                          name,
                          divisions,
                          users,
                          company_address,
                          contact_person,
                          contact_details,
                        } = company;
                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{company_address}</td>
                            <td>{contact_person}</td>
                            <td>{contact_details}</td>
                            <td>{divisions}</td>
                            <td>{users.toString()}</td>
                            <td className="btn-container">
                              <button
                                className="edit"
                                onClick={() => {
                                  this.setState({
                                    selectedCompany: company,
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
                                    `are you sure you want to delete ${company.name}`
                                  );
                                  if (confirmed) {
                                    deleteCompany(company.id).then((result) => {
                                      if (result.errors) {
                                        alert(
                                          "Cant delete data. Delete users first, then division"
                                        );
                                      } else if (
                                        result.data.delete_companies_by_pk ===
                                        null
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
                <h2>COMPANY PAGE</h2>
              </div>
              <div className="table-header">
                <p className="table-title">Company List</p>
                <p className="btnAdd">
                  <NavLink
                    to={paths.companiesForm}
                    onClick={() => this.setState({ selectedCompany: null })}
                  >
                    ADD COMPANY<i className="fas fa-plus"></i>
                  </NavLink>
                </p>
              </div>
              <div className="table-main">
                <Pagination
                  items={companies}
                  onChangePage={this.onChangePage}
                />
                <table id="usersdata">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th> Company Address </th>
                      <th>Contact Person</th>
                      <th>Contact Detail</th>
                      <th>Division</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOfItems.length > 0 ? (
                      pageOfItems.map((company, index) => {
                        const {
                          name,
                          divisions,
                          users,
                          company_address,
                          contact_person,
                          contact_details,
                        } = company;
                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{company_address}</td>
                            <td>{contact_person}</td>
                            <td>{contact_details}</td>
                            <td>{divisions}</td>
                            <td>{users.toString()}</td>
                            <td className="btn-container">
                              <button
                                className="edit"
                                onClick={() => {
                                  this.setState({
                                    selectedCompany: company,
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
                                    `are you sure you want to delete ${company.name}`
                                  );
                                  if (confirmed) {
                                    deleteCompany(company.id).then((result) => {
                                      if (result.errors) {
                                        alert(
                                          "Cant delete data. Delete users first, then division"
                                        );
                                      } else if (
                                        result.data.delete_companies_by_pk ===
                                        null
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
                        <td colSpan="5">No data to display...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>Company User Only</div>
          )}
        </Route>
      </Switch>
    );
  }
}

export default Admins;

import React, { PureComponent } from "react";
import { dashData } from "../../graphqlAPI";

class DashBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dashboard: {
        companies: 0,
        divisions: 0,
        users: 0,
        admins: 0,
      },
    };
  }

  async componentDidMount() {
    this.fakeRequest().then(() => {
      const el = document.querySelector(".loader-container");
      if (el) {
        el.remove(); // removing the spinner element
        this.setState({ loading: false }); // showing the app
      }
    });
    const dashboardData = await dashData();
    await dashData(dashboardData).then((result) => {
      console.log(result);
      this.setState({
        dashboard: result.data.data,
        companies: result.data.companies_aggregate.aggregate.count,
        divisions: result.data.divisions_aggregate.aggregate.count,
        users: result.data.users_aggregate.aggregate.count,
        admins: result.data.admins_aggregate.aggregate.count,
      });
    });
  }

  fakeRequest = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1500));
  };

  render() {
    const { companies, divisions, users, admins } = this.state;
    // if (this.state.loading) {
    //   return null; //app is not ready (fake request is in process)
    // }
    return (
      <div className="dashboard">
        <div class="loader-container">
          <div class="loader"></div>
        </div>
        <h2>DASHBOARD</h2>
        <div className="row">
          <div className="col-xl-3 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-content">
                <div className="contain-counter divisions-bg">{divisions}</div>
                <div className="card-body">
                  <h4 className="card-title">DIVISION</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-content">
                <div className="contain-counter companies-bg">{companies}</div>
                <div className="card-body">
                  <h4 className="card-title">COMPANY</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-content">
                <div className="contain-counter users-bg">{users}</div>
                <div className="card-body">
                  <h4 className="card-title">USER</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-content">
                <div className="contain-counter admins-bg">{admins}</div>
                <div className="card-body">
                  <h4 className="card-title">ADMIN</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashBoard;

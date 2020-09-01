import React, { PureComponent } from "react";
import { getUsers } from "../../graphqlAPI";
import Delete from '../../components/delete/delete';
class SuperTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        tableUser:[{
            email: '',
            first_name: '',
            last_name: '',
            role: '',
            created_at: '',
            updated_at: '',
        }],
    };
  }
  async componentDidMount() {
    const {users} = this.props;
   await getUsers(users)
    .then (data => {
        this.setState({tableUser: data.data.users})
    })
  }
  render() {
    const {tableUser} = this.state;
    return (
      <div className="tableData">
        <h1 id="title">Table Data</h1>
        <table 
        id="usersdata">
          <thead>
          <tr>
              <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Company</th>
            <th>Update</th>
            
          </tr>
          </thead>

          <tbody>
          { (tableUser.length > 0 ) ? tableUser.map( (user, index) => {
           return (
            <tr key={ index }>
                <td>{ user.email}</td>
              <td>{ user.first_name }</td>
              <td>{ user.last_name }</td>
              <td>{ user.companies}</td>
              <td>{ user.updated_at }</td>

            </tr>
          )
         }) : <tr><td colSpan="5">Loading...</td></tr> }
          </tbody>
        </table>
        <Delete />
      </div>
    );

  }
}

export default SuperTable;

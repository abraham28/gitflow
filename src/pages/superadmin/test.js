
import React from 'react';

const Table = ({ users }) => {
    return (
      <table id="usersdata">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Company</th>
            <th>Division</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          { (users.length > 0) ? users.map( (user, index) => {
             return (
              <tr key={ index }>
                <td>{ user.first_name }</td>
              <td>{ user.last_name }</td>
              <td>{ user.companies}</td>
              <td>{ user.divisions }</td>
              <td>{ user.role }</td>
              </tr>
            )
           }) : <tr><td colSpan="5">Loading...</td></tr> }
        </tbody>
      </table>
    );
  }

  export default Table;
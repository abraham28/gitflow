import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
class Header extends PureComponent {
  render() {
    return (
      <div className="navbar">
        <div className="logo">
          <h1>
            Admin <span>Management</span>
          </h1>
        </div>
        <ul className="nav-link">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;

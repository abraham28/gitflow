import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import "./index.scss";

class PageNotFound extends PureComponent {
  render() {
    return (
      <div className="pagenotfound container">
        <h1>404 page not found</h1>
        <button
          onClick={() => {
            window.location.href = "/";
          }}
        >
          go to home
        </button>
      </div>
    );
  }
}

export default PageNotFound;

export const RedirectNotFound = () => <Redirect to="/404" />;

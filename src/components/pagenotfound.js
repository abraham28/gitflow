import React, { PureComponent } from "react";

class PageNotFound extends PureComponent {
  render() {
    return (
      <div>
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

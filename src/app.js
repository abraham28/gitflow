import React, { PureComponent } from "react";
import "./app.scss";
import Timer from "./components/Timer/timer";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showTimer: true,
    };
  }

  render() {
    const showTimer = this.state.showTimer;
    return (
      <div>
        {showTimer && <Timer />}
        <div className="red">
          <p className="textContainer">
            clicked <br />
            <span className="bold"> 12 </span>
            <br /> times
          </p>
        </div>
        <div className="button">
          <button
            onClick={() => {
              this.setState({ showTimer: !showTimer });
            }}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}

export default App;

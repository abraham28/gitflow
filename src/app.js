import React, { PureComponent } from "react";
import "./app.scss";
import Timer from "./components/Timer/timer";
import Counter from "./components/counter/counter";

class App extends PureComponent {
  render() {
    return (
      <div>
        <Timer />
        <Counter name="James" />
      </div>
    );
  }
}

export default App;

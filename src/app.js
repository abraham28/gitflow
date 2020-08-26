import React, { PureComponent } from "react";
import "./app.scss";
import Timer from "./components/Timer/timer";
import Counter from "./components/counter/counter";
import Todo from "./components/todolist/todolist";
class App extends PureComponent {
  render() {
    return (
      <div class="wrap">
        <div class="inner">
        <Timer />
        <Counter />
        <Todo />
      </div>
      </div>
    );
  }
}

export default App;

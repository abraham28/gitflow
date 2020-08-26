import React, { PureComponent } from "react";
import "./todolist.scss";

class Todo extends PureComponent {
  render() {
    return (
      <div className="todo">
        <h2>TO-DO LIST</h2>
        <div className="todoSection01">
          <form>
            <input
              type="text"
              id="new-todo-input"
              className="input input__lg"
              name="text"
              autoComplete="off"
              placeholder="new task"
            />
            <button type="submit" className="btn btn__primary btn__lg">
              Add
            </button>
          </form>
          <ul>
            <li>
              <input id="todo-0" type="checkbox" defaultChecked={true} />
              <label className="todo-label" htmlFor="todo-0">
                Vanilla Javascript
              </label>
            </li>
            <li>
              <input id="todo-1" type="checkbox" defaultChecked={true} />
              <label className="todo-label" htmlFor="todo-0">
                Vue.js
              </label>
            </li>
            <li>
              <input id="todo-2" type="checkbox" defaultChecked={true} />
              <label className="todo-label" htmlFor="todo-0">
                React.js
              </label>
            </li>
            <li>
              <input id="todo-3" type="checkbox" defaultChecked={true} />
              <label className="todo-label" htmlFor="todo-0">
                Node.js
              </label>
            </li>
          </ul>
        </div>
        <p className="blue">Clear</p>
      </div>
    );
  }
}

export default Todo;

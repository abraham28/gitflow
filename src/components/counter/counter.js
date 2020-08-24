import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Counter extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      count: 0,
      message: '',
    };
  }

  getClick() {
    const count = this.state.count;
    if (count < 10) {
      this.setState({
        count: count + 1,
        message: count + 1 === 10 ? "Congratulations" : null,
      });
    }
  }

  componentDidMount() {
    const data = localStorage.getItem("count");
    return JSON.parse(data);
  }

  render() {
    const name = this.props.name;
    return (
      <div>
        <div className="red">
          <p className="textContainer">
            Clicked <br />
            <span className="bold"> {this.state.count} </span>
            <br /> times
          </p>
        </div>
        <div className="button">
          <button onClick={this.getClick.bind(this)}>Add </button>
          <sub className="error">{this.state.message}</sub>
          <p>Click add to vote {name} </p>
        </div>
      </div>
    );
  }
}

export default Counter;

import React, { PureComponent } from "react";
import "./timer.scss";
import moment from "moment-timezone";

class Timer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTimer: moment
        .tz(new Date(), "Asia/Manila")
        .format("MMMM DD, YYYY HH:mm:ss Z z"),
    };
  }

  componentDidMount() {
    this.interval = window.setInterval(() => {
      this.setState({
        currentTimer: moment
          .tz(new Date(), "Asia/Manila")
          .format("MMMM DD, YYYY HH:mm:ss Z z"),
      });
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    const date = this.state.currentTimer;
    return (
      <div className="dTime">
        <div>{date}</div>
      </div>
    );
  }
}

export default Timer;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Counter extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      message: "",
      name: "",
      display: true,
    };
  }
  NameHandler = (e) => {
    let NewName = e.target.value;
    this.setState({ name: NewName });
    localStorage.setItem("NewName", NewName);
    console.log(NewName);
  };

  SubmitHandler = (e) => {
  e.preventDefault();
   this.setState({
     display: false,
   });
 };


  getClick() {
    const count = this.state.count;
    if (count < 10) {
      this.setState({
        count: count + 1,
        message: count + 1 === 10 ? "Congratulations" : null,
      });
      localStorage.setItem("Increment", count);
    }
  }

  componentDidMount() {
    const data = localStorage.getItem("count");
    return JSON.parse(data);
  }

  render() {
    const name = this.state.name;
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

          {<p>Click add to vote {name}</p>}
        </div>
        
        {
        this.state.display?
        <div className="forms">
          <form onSubmit={this.SubmitHandler}>
            <input
              type="text"
              name="name"
              onChange={this.NameHandler}
              value={name}
            />
            <input type="submit" onClick={this.SubmitHandler} />
          </form>
        </div> 
        :null 
        }
      </div>
    );
  }
}

export default Counter;

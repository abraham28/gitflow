import React, { PureComponent } from "react";


class Click extends PureComponent {
    constructor() {
        super()
        this.state = {
          count: 0,
          click: true
        }
      }
    getClick() {
      const clicked = this.state.click
      if(clicked){
        console.log (clicked);
        this.setState({count: this.state.count + 1, click: true});
      } 
    }
    render() {
      return  <div>
                      <button onClick={this.getClick.bind(this)}>Add </button>
                  </div>;
    }
  }
  

export default Click;

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Counter extends PureComponent {
    static propTypes = {
      name : PropTypes.string,
    };
    render() {
      const name = this.props.name;
      return (
        <div>
          <div className="red">
            <p className="textContainer">
              clicked <br />
              <span className="bold"> 12 </span>
              <br /> times
            </p>
          </div>
          <div className="button">
            <button>Add</button>
            <p>Click add to vote {name} </p>
          </div>
        </div>
      );
    }
  }
  
  export default Counter;
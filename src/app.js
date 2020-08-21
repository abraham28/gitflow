import React, { PureComponent } from 'react';
import './app.scss';

class App extends PureComponent {
  render() {
    return <div>
        <div className="red">
            <p className="textContainer">clicked <br /><span className="bold"> 12 </span><br /> times</p>
        </div>
        <div className="button">
        <button>Add</button>
        </div>
    </div>
    
  }
}

export default App;
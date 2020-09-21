import React, {PureComponent,Fragment} from "react";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { Link } from "react-router-dom";

class ConfirmStatusChange extends PureComponent {
  state = {
    open: false,
    callback: null
  }

  show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    this.setState({
      open: true,
      callback: () => callback(event)
    })
  }

  hide = () => this.setState({ open: false, callback: null })

  confirm = () => {
    this.state.callback()
    this.hide()
  }

  render() {
    return (
      <Fragment>
        {this.props.children(this.show)}

        {this.state.open && (
          <Dialog>
            <h1>{this.props.title}</h1>
            <p>{this.props.description}</p>

            <button onClick={this.hide}><a href="#" className="red">Cancel</a></button>
            <button><Link to="/login" onClick={() => localStorage.removeItem("user")}><i className="fas fa-sign-out-alt"></i>Logout</Link></button>
          </Dialog>
        )}
      </Fragment>
    )
  }
}
export default ConfirmStatusChange;
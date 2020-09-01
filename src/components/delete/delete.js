import React, { PureComponent } from "react";
import { getUsers } from "../../graphqlAPI";

class Delete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableUser: [
        {
          email: "",
          first_name: "",
          last_name: "",
          role: "",
        },
      ],
    };
  }

  async componentDidMount() {
    const { users } = this.props;
    await getUsers(users).then((data) => {
      this.setState({ tableUser: data });
      console.log(data);
    });
  }

  removeData() {}

  render() {
    return <p>test</p>;
  }
}

export default Delete;

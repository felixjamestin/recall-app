import React from "react";
import { Root } from "./src/config/Router";

class App extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      isReady: false
    };
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  async componentDidMount() {
    this.setState({ isReady: true });
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <Root
        ref={nav => {
          this.navigator = nav;
        }}
      />
    );
  }
}

export default App;

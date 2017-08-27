import React from "react";
import { Root } from "./src/config/Router";
import { PushService } from "./src/screens/Index";

PushService.configurePushNotifications();
PushService.handlePushActions();

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
    PushService.setCallbacks(
      this.handleOnPushRegister,
      this.handleOnPushNotification
    );
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleOnPushNotification(notification) {
    console.log("NOTIFICATION:", notification);
  }

  handleOnPushRegister(device) {}

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

import React from "react";
import { View, Text } from "react-native";
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
    // await this.handleLoadFonts();
    this.setState({ isReady: true });
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleLoadFonts() {
    // Font.loadAsync({
    //   "overpass-regular": require("./assets/fonts/Overpass-Regular.ttf"),
    //   "overpass-thin": require("./assets/fonts/Overpass-Thin.ttf"),
    //   "overpass-semi-bold": require("./assets/fonts/Overpass-SemiBold.ttf"),
    //   "overpass-bold": require("./assets/fonts/Overpass-Bold.ttf")
    // });
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    // return (
    //   <View>
    //     <Text>Hi!</Text>
    //   </View>
    // );

    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    return (
      <Root
        ref={nav => {
          this.navigator = nav;
        }}
      />
    );

    // this.state.fontLoaded
    //   ? <Text style={{ fontFamily: "overpass-thin", fontSize: 56 }}>
    //       Hello, world!
    //     </Text>
    //   : null
  }
}

export default App;

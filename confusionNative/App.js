import React from 'react';
import { View } from 'react-native';
import Main from './components/MainComponent';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     isFontLoaded: false
   };
  }
  async componentWillMount() {
    await Font.loadAsync({ 'MaterialIcons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  'FontAwesome': require('react-native-vector-icons/Fonts/FontAwesome.ttf') })
    this.setState({ isFontLoaded: true })
  }

  render() {
    if (this.state.isFontLoaded) {
      return (<Provider store={store}>
                <Main />
              </Provider>);
    } else {
      return(<View/>);
    }
  }
}

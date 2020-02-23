import React from 'react';
import { View } from 'react-native';
import Main from './components/MainComponent';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './components/LoadingComponent';

const { persistor, store } = ConfigureStore();

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
                <PersistGate
                  loading={<Loading />}
                  persistor={persistor}>
                  <Main />
                </PersistGate>
              </Provider>);
    } else {
      return(<View/>);
    }
  }
}

import { AppRegistry } from 'react-native';
import App from './src/App';
import codePush from 'react-native-code-push';

const MyApp = codePush({
  updateDialog: false,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESTART,
  installMode: codePush.InstallMode.IMMEDIATE,
})(App);
AppRegistry.registerComponent('tipappReactNative', () => MyApp);

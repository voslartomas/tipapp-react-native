import { AppRegistry } from 'react-native';
import App from './src/App';
import codePush from 'react-native-code-push';

const MyApp = codePush({
  updateDialog: true,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
})(App);
AppRegistry.registerComponent('tipappReactNative', () => MyApp);

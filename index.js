/**
 * @format
 */
// import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import './shim'
import "react-native-get-random-values"
import "@ethersproject/shims"
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //I

AppRegistry.registerComponent(appName, () => App);


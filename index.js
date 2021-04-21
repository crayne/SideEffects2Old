/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

//Fix for fetch returning Blob
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
global.FormData = global.originalFormData || global.FormData;

if (window.FETCH_SUPPORT) {
  window.FETCH_SUPPORT.blob = false;
} else {
  global.Blob = global.originalBlob || global.Blob;
  global.FileReader = global.originalFileReader || global.FileReader;
}

global.filteredMedicationList;
global.filteredReverseSearchMenuList;
global.filteredReverseSearchResultList;
global.interactionsList;
global.MedicationListData = Array();

global.localHost =  "http://192.168.1.228:8888/sideEffectsNewData";
global.serverHost = "http://www.oryxtech.net/sideEffectsNewData";
global.urlBase = global.localHost;



console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);

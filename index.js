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
global.sideEffectsList;


global.backgroundColor = '#0d47a1';



console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);

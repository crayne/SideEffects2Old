import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';

 const localHost =  "http://192.168.1.161:8888/sideEffectsNewData";

 const serverHost = "http://www.oryxtech.net/sideEffectsNewData";
 const nuiUrl =  "http://rxnav.nlm.nih.gov/REST/search?conceptName=";
 const getInteractionsPhpUrl = "/interactions.php";

 //const urlBase =  serverHost;
 const urlBase =  localHost;
 var outsideResponse;

function GetAllMedicationNames(query) {
  const searchUrl = urlBase + "/autoComplete.php?searchValue=" + query;
  console.log("In GetAllMedicationNames, searchUrl = " + searchUrl);

  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      global.filteredMedicationList = request.responseText;
      console.log ("global.filteredMedicationList = " + global.filteredMedicationList);
    } else {
      console.warn('error');
    }
  }

  request.open('GET', searchUrl);
  request.send();





}








module.exports = GetAllMedicationNames;

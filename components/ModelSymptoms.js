import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';

 const localHost =  "http://192.168.1.161:8888/sideEffectsNewRxnav";

 const serverHost = "http://www.oryxtech.net/sideEffectsNewRxnav";
 const nuiUrl =  "http://rxnav.nlm.nih.gov/REST/search?conceptName=";
 const getInteractionsPhpUrl = "/interactions.php";

 //const urlBase =  serverHost;
 const urlBase =  serverHost;
 var outsideResponse;

function GetAllSymptomNames(query) {
  const searchUrl = urlBase + "/autoCompleteSymptoms.php?searchValue=" + query;
  console.log("In GetAllSymptomNames, searchUrl = " + searchUrl);

  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      global.filteredSymptomList = request.responseText;
      console.log ("global.filteredSymptomList = " + global.filteredSymptomList);
    } else {
      console.warn('error');
    }
  }

  request.open('GET', searchUrl);
  request.send();





}








module.exports = GetAllSymptomNames;

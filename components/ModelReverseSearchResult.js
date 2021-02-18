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

function MedicationHasSideEffect(medication, symptom){
  console.log("In MedicationHasSideEffect, symptom = " + symptom);
  const searchUrl = urlBase + "/searchSideEffectVerbal.php?symptom=" + symptom + "&medication=" + medication;
  SearchSideEffect(searchUrl);
}

function SearchSideEffect(searchUrl) {
  console.log("In SearchSideEffect, searchUrl = " + searchUrl);

  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      global.filteredReverseSearchResultList = global.filteredReverseSearchResultList + request.responseText + ",";
      console.log ("global.filteredReverseSearchResultList = " + global.filteredReverseSearchResultList);
    } else {
      console.warn('error');
    }
  }

  request.open('GET', searchUrl);
  request.send();

}


module.exports =  MedicationHasSideEffect;

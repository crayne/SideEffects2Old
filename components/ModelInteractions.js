import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';

 const localHost =  "http://192.168.1.161:8888/sideEffectsNewRxnav";

 const serverHost = "http://www.oryxtech.net/sideEffectsNewRxnav";
 const getInteractionsPhpUrl = "/interactions.php";

 //const urlBase =  serverHost;
 const urlBase =  serverHost;
 var outsideResponse;

function GetInteractions(medNames){
  console.log("In GetInteractions, medNames = " + medNames);
  const searchUrl = urlBase + "/interactions.php?medNames=" + medNames;
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
      global.interactionsList = global.interactionsList + request.responseText + ",";
      console.log ("global.interactionsList = " + global.interactionsList);
    } else {
      console.warn('error');
    }
  }

  request.open('GET', searchUrl);
  request.send();

}


module.exports =  GetInteractions;
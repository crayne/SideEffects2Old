import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';

 const localHost =  "http://192.168.1.170:8888/sideEffectsNewRxnav";
 const serverHost = "http://www.oryxtech.net/sideEffectsNewRxnav";
 const nuiUrl =  "http://rxnav.nlm.nih.gov/REST/search?conceptName=";
 const getInteractionsPhpUrl = "/interactions.php";

 const urlBase =  serverHost;
 //const urlBase =  localHost;


function GetAllMedicationNames() {
  console.log("In GetAllMedicationNames");

}






module.exports = GetAllMedicationNames;

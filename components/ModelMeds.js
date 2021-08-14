import 'react-native-gesture-handler';
import React, {useState, Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Menu,
} from 'react-native-paper';
import {Searchbar} from 'react-native-paper';
import {GetHost} from './SetHost.js'


const getInteractionsPhpUrl = '/interactions.php';

var outsideResponse;

function GetAllMedicationNames(query) {
  var searchUrl = GetHost();
  searchUrl = searchUrl + '/autoComplete.php?searchValue=' + query;
  console.log('In GetAllMedicationNames, searchUrl = ' + searchUrl);

  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      global.filteredMedicationList = request.responseText;
      console.log(
        'global.filteredMedicationList = ' + global.filteredMedicationList,
      );
    } else {
      console.warn('error');
    }
  };

  request.open('GET', searchUrl);
  request.send();
}

module.exports = GetAllMedicationNames;

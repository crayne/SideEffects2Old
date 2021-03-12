import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {TouchableHighlight} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu, List} from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GetAllSymptomNames from './ModelReverseSearchMenu.js';
import MedicationHasSideEffect from './ModelReverseSearchResult.js';
import {se2MainButton} from './SE2Styles.js'
import { useFocusEffect } from '@react-navigation/native';



var interactionsInterval;
var filterIntervalMedications;
const localHost =  "http://192.168.1.161:8888/sideEffectsNewData";

const serverHost = "http://www.oryxtech.net/sideEffectsNewData";

const urlBase =  localHost;

state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
  refreshFlatList: false
}


var medicationListVisibility = 0;

const InteractionData = Array();
//List of all user Medications
var AllUserMedications = Array();

function InteractionsScreen(props) {
  state.navigate = props.navigation.navigate;
  const { navigation } = props;
  AllUserMedications = global.MedicationListData;
  const unsubscribe = navigation.addListener('beforeRemove', e => {
    InteractionData.length = 0;
  });
  console.log("In InteractionsScreen, AllUserMedications length is: " + AllUserMedications.length);
  console.log("AllUserMedications first item is: " + AllUserMedications[0].title);
    return (
      FindInteractions()
    );
}

function FindInteractions(){
  const [searchQuery, setSearchQuery] = React.useState('');
  const renderMedicationListItem = ({ item }) => (
        <Item title={item.title} />
  );
  //fgetI the medication names
  var concatMedications = "";
  var numMedications = AllUserMedications.length;
  for (var i = 0; i < numMedications; i++){
      concatMedications += AllUserMedications[i].title;
      if (i != numMedications-1) concatMedications += ",";
  }
  global.interactionsList = "";

  GetInteractions(concatMedications);
  //interactionsInterval = setInterval(CheckInteractionsList, 1000);

  const Item = ({ title }) => (
    <View style={styles.medicationListItem}>
      <Text style={styles.medicationListItemText}>{title}</Text>
    </View>
  );

  /* TODO - put "Get Interactions" button on Interactions screen and call FindInteractions from the handler
  tried -- doesn't work .  Try "onComponentLoaded" */
  function CheckInteractionsList(){
    if (global.interactionsList == ""){
      return;
    }
    clearInterval(interactionsInterval);
    global.interactionsList = global.interactionsList.toLowerCase();
    global.interactionsList = global.interactionsList.substr(0,global.interactionsList.length-1);

    console.log("In CheckInteractionsList, global.interactionsList: " + global.interactionsList);
    var jsonInteractionsList = JSON.parse(global.interactionsList);
    console.log("In CheckInteractionsList, number of JSON object = " + jsonInteractionsList.length);
    var descriptionText = jsonInteractionsList[0].descriptiontext[0];

    console.log("In CheckInteractionsList, first description in jsonInteractionsList = " + descriptionText);
    InteractionData.push({title:descriptionText, id:"1"});
    console.log("In CheckInteractionsList, pushed object to InteractionData, length = " + InteractionData.length);
    state.refreshFlatList = !state.refreshFlatList;
    console.log("In CheckInteractionsList, state.refreshFlatList = " + state.refreshFlatList);
    console.log("In CheckInteractionsList, after second push, state.refreshFlatList = " + state.refreshFlatList);
    /*Do not delete -- allows Interaction List to update*/
    setSearchQuery("ab");
    global.interactionsList = "";

  }

  function GetInteractions(medNames){
    console.log("In New GetInteractions, medNames = " + medNames);
    const searchUrl = urlBase + "/interactions.php?medNames=" + medNames;
    console.log("In GetInteractions, searchUrl = " + searchUrl);

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        console.log('In GetInteractions, success', request.responseText);
        global.interactionsList = global.interactionsList + request.responseText + ",";
        console.log ("In GetInteractions, global.interactionsList = " + global.interactionsList);
        CheckInteractionsList();
      } else {
        console.warn('error');
      }
    }

    request.open('GET', searchUrl);
    request.send();

  }

  const medicationListStyle = function(medicationListVisibility) {
   return {
     marginTop: 20,
     fontSize: 24,
     alignItems: 'flex-start',
     height: 400,
     flexGrow: 0,
     opacity: 1,
     borderRadius: 4,
     backgroundColor: 'transparent',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 1,
     },
     shadowOpacity: 0.22,
     shadowRadius: 2.22,
     elevation: 3,
   }
 }

  return (
  /*
  The purpose of the searchbar is only to make updates to the interactions list display
  The list will update only if I set the contents of the searchbar to a string.  The searchbar
  is invisible.
  This is terrible, and I will try to find some other way of solving this problem
  */

  <View
    style = {{
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 20,
      marginRight: 20
    }}>

    <Searchbar style={styles.searchbar}
      placeholder="Search"
    />

    <Text style={styles.listTitleText}>Interactions Between Your Medications</Text>

    <SafeAreaView style={medicationListStyle(medicationListVisibility)}>
       <FlatList style={styles.medicationList}
         ItemSeparatorComponent={
           (({ highlighted }) => (
           <View
            style={[
            styles.separator,
            highlighted && { marginLeft: 0 }
            ]}
           />
          ))
         }
         data={InteractionData}
         renderItem={renderMedicationListItem}
         keyExtractor={item => item.id.toString()}
         extraData={state.refreshFlatList}
       />
     </SafeAreaView>

     <View style={se2MainButton.buttonView} >
       <TouchableOpacity style={se2MainButton.innerButtonStyle}>
         <Text style = {se2MainButton.innerButtonStyle}  onPress={() => state.navigate('Home')}>
             Home
         </Text>
       </TouchableOpacity>
     </View>


  </View>

  );

}

const styles = StyleSheet.create ({
   view: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 100,
   },

   menu: {
     marginTop: -210
   },

   menuItem: {
   },

   searchbar: {
     width: '100%',
     marginBottom: 0,
     opacity: 0,
     display: 'none',
     height: 10
   },

   enterText: {
      fontSize :26,
      marginTop:20,
      marginBottom: 20
    },

    listTitleText: {
       fontSize :26,
       marginTop:20,
       textAlign: 'center'
     },

    medicationList: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 4,
    },

    medicationListItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 5,
      marginRight: 5
    },

    medicationListItemText: {
      fontSize: 24,
      marginLeft: 5,
    },

    medicationListItemIcon: {
      marginRight: 5,
      marginTop: 2
    },

    separator: {
      color: 'red',
      borderWidth: 1,
      backgroundColor: 'blue'
    },

})






module.exports = InteractionsScreen;

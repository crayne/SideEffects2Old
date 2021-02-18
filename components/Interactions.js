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
import GetInteractions from './ModelInteractions.js';
import {se2MainButton} from './SE2Styles.js'
import { useFocusEffect } from '@react-navigation/native';



var interactionsInterval;
var filterIntervalMedications;

state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
}


var medicationListVisibility = 0;

//List of medications which might cause this symptom
const InteractionData = Array();
//List of all user Medications
var AllUserMedications = Array();

function InteractionsScreen(props) {
  state.navigate = props.navigation.navigate;
  const { navigation } = props;
  AllUserMedications = props.route.params.MedicationListData;
  const unsubscribe = navigation.addListener('beforeRemove', e => {
    InteractionData.length = 0;
  });
  console.log("In InteractionsScreen, AllUserMedications length is: " + AllUserMedications.length);
  console.log("AllUserMedications first item is: " + AllUserMedications[0].title);

    return (
      <PaperProvider>
        <View style={styles.view}>
          <Text style={styles.enterText}>Interactions</Text>
          {FindInteractions()}
        </View>
      </PaperProvider>
    );
}

function FindInteractions(){
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
  interactionsInterval = setInterval(CheckInteractionsList, 1000);

  const Item = ({ title }) => (
    <View style={styles.medicationListItem}>
      <Text style={styles.medicationListItemText}>{title}</Text>
    </View>
  );

  function CheckInteractionsList(){
    if (global.interactionsList == ""){
      return;
    }
    clearInterval(interactionsInterval);
    global.interactionsList = global.interactionsList.toLowerCase();
    global.interactionsList = global.interactionsList.substr(0,global.interactionsList.length-1);

    console.log("In CheckInteractionsList, global.interactionsList: " + global.interactionsList);
    var jsonInteractionsList = JSON.parse(global.interactionsList);
    console.log("In CheckInteractionsList, first item in jsonInteractionsList = " + jsonInteractionsList[0]);
    InteractionData.push({title:"title1", id:"1"});
    console.log("In CheckInteractionsList, push object to InteractionData");

    /*
    var resultArray = global.interactionsList.split(",");
    var newId;
    for (var i=0; i<resultArray.length-1; i++) {
      if (InteractionData.length == 0) newId = "1";
      else {
        var lastId = InteractionData[InteractionData.length-1].id;
        newId = Number(lastId) + 1;
      }
      const medicationObject = {title:resultArray[i], id:newId};
      console.log("pushing object to InteractionData: " + medicationObject.title + ", " + medicationObject.id);
      InteractionData.push(medicationObject);

    }
    */
    global.interactionsList = "";

  }

  const medicationListStyle = function(medicationListVisibility) {
   return {
     marginTop: 20,
     fontSize: 24,
     alignItems: 'flex-start',
     height: 200,
     flexGrow: 0,
     opacity: medicationListVisibility,
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

  <View
    style = {{
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>

    <Searchbar style={styles.searchbar}
      placeholder="Search"
    />

    <Text style={styles.listTitleText}>Medications which could cause the symptom:</Text>

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
     marginBottom: 0
   },

   enterText: {
      fontSize :26,
      marginTop:80,
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

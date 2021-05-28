import 'react-native-gesture-handler';
import React, {useState, Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {TouchableHighlight} from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Menu,
  List,
} from 'react-native-paper';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GetAllSymptomNames from './ModelReverseSearchMenu.js';
import MedicationHasSideEffect from './ModelReverseSearchResult.js';
import {se2MainButton} from './SE2Styles.js';
import {StyleHeader} from './SE2Styles.js';
import {BackgroundColor} from './SE2Styles.js';
import {useFocusEffect} from '@react-navigation/native';
import {GetHost} from './SetHost.js'


var interactionsInterval;
var filterIntervalMedications;

state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
};

//This is used to keep the interaction search from happening more than once
var firstPass = false;

const InteractionData = Array();
//List of all user Medications
var AllUserMedications = Array();

function InteractionsScreen(props) {
  console.log("firstPass = " + firstPass);
  state.navigate = props.navigation.navigate;
  StyleHeader(props.navigation, "Interactions");
  const {navigation} = props;

  AllUserMedications = global.MedicationListData;

  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    InteractionData.length = 0;
    firstPass = false;
  });
  console.log(
    'In InteractionsScreen, AllUserMedications length is: ' +
      AllUserMedications.length,
  );

  return FindInteractions();
}

function FindInteractions() {
  const [refreshData, setRefreshData] = React.useState(false);

  const renderMedicationListItem = ({item}) => <Item title={item.title} />;
  //fgetI the medication names
  var concatMedications = '';
  var numMedications = AllUserMedications.length;
  for (var i = 0; i < numMedications; i++) {
    concatMedications += AllUserMedications[i].title;
    if (i != numMedications - 1) concatMedications += ',';
  }
  global.interactionsList = '';

  if (firstPass != true){
    GetInteractions(concatMedications);
    firstPass = true;
  }
  //interactionsInterval = setInterval(CheckInteractionsList, 1000);

  const Item = ({title}) => (
    <View style={styles.medicationListItem}>
      <Text style={styles.medicationListItemText}>{title}</Text>
    </View>
  );

  /* TODO - put "Get Interactions" button on Interactions screen and call FindInteractions from the handler
  tried -- doesn't work .  Try "onComponentLoaded" */
  function CheckInteractionsList() {
    clearInterval(interactionsInterval);
    if (global.interactionsList == '') {
      return;
    }
    global.interactionsList = global.interactionsList.toLowerCase();
    global.interactionsList = global.interactionsList.substr(
      0,
      global.interactionsList.length - 1,
    );

    console.log(
      'In CheckInteractionsList, global.interactionsList: ' +
        global.interactionsList,
    );
    var jsonInteractionsList = JSON.parse(global.interactionsList);
    console.log(
      'In CheckInteractionsList, number of JSON objects = ' +
        jsonInteractionsList.length,
    );

    for (var i = 0; i < jsonInteractionsList.length; i++) {
      if (
        jsonInteractionsList[i].originaldrugname1 ==
        jsonInteractionsList[i].originaldrugname2
      ) {
        continue;
      }
      var descriptionText = jsonInteractionsList[i].descriptiontext[0];
      var listText =
        'Interaction between ' +
        jsonInteractionsList[i].originaldrugname1 +
        ' and ' +
        jsonInteractionsList[i].originaldrugname2 +
        ': ' +
        descriptionText;
      InteractionData.push({title: listText, id: '1' + i});
      console.log(
        'In CheckInteractionsList, pushed object to InteractionData, length = ' +
          InteractionData.length,
      );
    }
    global.interactionsList = '';
    setRefreshData(!refreshData);
  }

  function GetInteractions(medNames) {
    console.log('In New GetInteractions, medNames = ' + medNames);
    const searchUrl = GetHost() + '/interactions.php?medNames=' + medNames;
    console.log('In GetInteractions, searchUrl = ' + searchUrl);

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        console.log('In GetInteractions, success', request.responseText);
        global.interactionsList =
          global.interactionsList + request.responseText + ',';
        console.log(
          'In GetInteractions, global.interactionsList = ' +
            global.interactionsList,
        );
        CheckInteractionsList();
      } else {
        console.warn('error');
      }
    };

    request.open('GET', searchUrl);
    request.send();
  }

  return (

  <SafeAreaView style={styles.safeAreaView}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: BackgroundColor
        }}>

        <Text style={styles.listTitleText}>
          Interactions Between Your Medications
        </Text>

        <View style={styles.medicationListStyle}>
          <FlatList
            style={styles.medicationList}
            ItemSeparatorComponent={({highlighted}) => (
              <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
            )}
            data={InteractionData}
            renderItem={renderMedicationListItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={refreshData}
          />
        </View>

        <View style={se2MainButton.buttonView}>
          <TouchableOpacity style={se2MainButton.innerButtonStyle}>
            <Text
              style={se2MainButton.innerButtonStyle}
              onPress={() => state.navigate('Home')}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: -210,
  },

  menuItem: {},

  enterText: {
    fontSize: 26,
    marginTop: 20,
    marginBottom: 20,
  },

  listTitleText: {
    fontSize: 26,
    marginTop: 20,
    textAlign: 'center',
    color: "white"
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
    marginRight: 5,
  },

  medicationListItemText: {
    fontSize: 24,
    marginLeft: 5,
  },

  medicationListItemIcon: {
    marginRight: 5,
    marginTop: 2,
  },


  medicationListStyle: {
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
  },

  separator: {
    color: 'red',
    borderWidth: 1,
    backgroundColor: 'blue',
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: BackgroundColor
  }

});

module.exports = InteractionsScreen;

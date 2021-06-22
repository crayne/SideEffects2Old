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
  List,
} from 'react-native-paper';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {se2MainButton} from './SE2Styles.js';
import {StyleHeader} from './SE2Styles.js';
import {BackgroundColor} from './SE2Styles.js';
import {useFocusEffect} from '@react-navigation/native';
import {GetHost} from './SetHost.js'


var sideEffectsInterval;
var filterIntervalMedications;

//menuItems must be in here
state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
  medicationName: null
};

//This is used to keep the side effect search from happening more than once
var firstPass = false;

const SideEffectsData = Array();
//List of all side effects for a given medication
var AllSideEffects = Array();

function SideEffectsListScreen(props) {
  console.log("In SideEffectsListScreen, firstPass = " + firstPass);
  state.navigate = props.navigation.navigate;
  state.medicationName = props.route.params.medicationName;
  state.medicationName = state.medicationName.charAt(0).toUpperCase() + state.medicationName.slice(1);
  console.log("In SideEffectsListScreen, medication name is " + state.medicationName);

  StyleHeader(props.navigation, "SideEffectsList");
  const {navigation} = props;

  AllSideEffects = global.sideEffectsList;

  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    SideEffectsData.length = 0;
    firstPass = false;
  });
  if (typeof AllSideEffects != "undefined"){
    console.log("AllSideEffects length = " + AllSideEffects.length);
  }
  return FindSideEffects();
}

function FindSideEffects() {
  const [refreshData, setRefreshData] = React.useState(false);

  const renderSideEffectItem = ({item}) => <Item title={item.title} />;
  //get the side effect names

  global.sideEffectsList = '';

  if (firstPass != true){
    //GetSideEffects();
    firstPass = true;
  }
  //sideEffectsInterval = setInterval(CheckSideEffectsList, 1000);

  const Item = ({title}) => (
    <View style={styles.sideEffectsListItem}>
      <Text style={styles.sideEffectsListItemText}>{title}</Text>
    </View>
  );

  function CheckSideEffectsList() {
    clearInterval(sideEffectsInterval);
    if (global.sideEffectsList == '') {
      return;
    }
    global.sideEffectsList = global.sideEffectsList.toLowerCase();
    global.sideEffectsList = global.sideEffectsList.substr(
      0,
      global.sideEffectsList.length - 1,
    );

    console.log(
      'In CheckSideEffectsList, global.sideEffectsList: ' +
        global.sideEffectsList,
    );
    var jsonSideEffectsList = JSON.parse(global.sideEffectsList);
    console.log(
      'In CheckSideEffectsList, number of JSON objects = ' +
        jsonSideEffectsList.length,
    );

    for (var i = 0; i < jsonSideEffectsList.length; i++) {

      var descriptionText = jsonSideEffectsList[i].descriptiontext[0];
      SideEffectsData.push({title: jsonSideEffectsList[i], id: '1' + i});
      console.log(
        'In CheckSideEffectsList, pushed object to SideEffectsData, length = ' +
          SideEffectsData.length,
      );
    }
    global.sideEffectsList = '';
    setRefreshData(!refreshData);
  }

  function GetSideEffects() {
    console.log('In New GetSideEffects, medName = ' + state.medName);
    //Need to create getSideEffectsFromMedName.php
    const searchUrl = GetHost() + '/getSideEffectsFromMedName.php?medName=' + state.medName;
    console.log('In GetSideEffects, searchUrl = ' + searchUrl);

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        console.log('In GetSideEffects, success', request.responseText);
        global.sideEffectsList =
          global.sideEffectsList + request.responseText + ',';
        console.log(
          'In GetSideEffects, global.sideEffectsList = ' +
            global.sideEffectsList,
        );
        CheckSideEffectsList();
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
          Side Effects of {state.medicationName}
        </Text>

        <View style={styles.sideEffectsListStyle}>
          <FlatList
            style={styles.sideEffectsList}
            ItemSeparatorComponent={({highlighted}) => (
              <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
            )}
            data={SideEffectsData}
            renderItem={renderSideEffectItem}
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

  listTitleText: {
    fontSize: 26,
    marginTop: 20,
    textAlign: 'center',
    color: "white"
  },

  sideEffectsList: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },

  sideEffectsListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
  },

  sideEffectsListItemText: {
    fontSize: 24,
    marginLeft: 5,
  },

  sideEffectsListItemIcon: {
    marginRight: 5,
    marginTop: 2,
  },


  sideEffectsListStyle: {
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

module.exports = SideEffectsListScreen;

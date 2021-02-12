import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {TouchableHighlight} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu, List} from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GetAllSymptomNames from './ModelSymptoms.js';
import {se2MainButton} from './SE2Styles.js'



var filterInterval;

state = {
  items: Array(),
  menuItems: Array(),
  doMedListRefresh: false,
  navigate: null
}


var medicationListVisibility = 0;

//List of medications which might cause this symptom
const MedicationsForSymptom = Array();

//Save medication list to persistent storage
function saveMedicationData(){

}

// returns the index of the item in the list -- else returns -1
function findItemInMedicationList(medName){
  for (var i=0; i<MedicationsForSymptom.length; i++){
    if (medName == MedicationsForSymptom[i].title){
      return i;
    }
  }
  return -1;
}







function ReverseSearchScreen(props) {
  state.navigate = props.navigation.navigate;
  const { navigation } = props;
  var MedicationsForSymptom = props.route.params.MedicationListData;
  console.log("First medication for symptom is: " + MedicationsForSymptom[0].title);

    return (
      <PaperProvider>
        <View style={styles.view}>
          <Text style={styles.enterText}>Enter a symptom:</Text>
          {AddMedicationsDropdown()}
        </View>
      </PaperProvider>
    );
}



function AddMedicationsDropdown(){

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => displayText(query);

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const renderMedicationListItem = ({ item }) => (
      <Item title={item.title} />
  );


  //Hijacked setSearchQuery -- called displayText instead and called setSearchQuery within it
  function displayText(query){
    setSearchQuery(query);
    //alert("text = " + query);
    //Show menu with all medications that start with the letters in "query"
    if (query.length < 3){
      closeMenu();
      return;
    }
    //TODO: if query.length == 3, get all medications from database that start with the 3 letters of the query, and
    //   put them into the "items" array, clearing the array first
    //TODO: include ids - make menuItems an array of objects
    if (query.length >= 3){
      //Get all medications that start with the characters in 'query' and store them in 'items'
      console.log("Search string is = " + query);
      global.filteredSymptomList = "";
      GetAllSymptomNames(query);
      filterInterval = setInterval(CheckFilteredMedicationList, 1000);

    }
    var i = 0;
    console.log("Putting items from server into menu");
    state.menuItems.length = 0;
    for (i=0; i<state.items.length; i++){
        var itemName = state.items[i];
        if (itemName.indexOf(query) != -1){
          state.menuItems.push(itemName);
        }
    }
    if (state.menuItems.length != 0){
      closeMenu();
      openMenu();
    }
    return query;
  }

  function CheckFilteredMedicationList(){
    if (global.filteredSymptomList == ""){
      return;
    }
    clearInterval(filterInterval);
    global.filteredSymptomList = global.filteredSymptomList.toLowerCase();
    console.log("Filtered Medication List =  " + global.filteredSymptomList);
    state.items = global.filteredSymptomList.split(",");
    console.log("last item is: " + state.items[state.items.length - 1]);
    if (state.items.length != 0){
      state.items.pop();
      closeMenu();
      openMenu();

    }
    global.filteredSymptomList = "";
  }

  const Item = ({ title }) => (
    <View style={styles.medicationListItem}>
      <Text style={styles.medicationListItemText}>{title}</Text>
    </View>
  );

  const onPressDropdownItemHandler = (value) => {
    //Put the value chosen from the medication menu into the medication list
    console.log("In onPressDropdownItemHandler, value = " + value);
    var newId;
    //Check for duplicates
    var index = findItemInMedicationList(value);
    console.log("item is: " + value + ". index is: " + index);
    if (index != -1) {
      closeMenu();
      return;
    }
    if (MedicationsForSymptom.length == 0) newId = "1";
    else {
      var lastId = MedicationsForSymptom[MedicationsForSymptom.length-1].id;
      newId = Number(lastId) + 1;
    }
    const medicationObject = {title:value, id:newId};
    MedicationsForSymptom.push(medicationObject);
    saveMedicationData();
    for (var i=0; i<MedicationsForSymptom.length; i++){
      const item = MedicationsForSymptom[i];
      console.log("pushing to medication list, title and id: " + item.title + ", " + item.id);
    }
    closeMenu();
    medicationListVisibility = 1;
  };

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
      onChangeText={onChangeSearch}
      value={searchQuery}
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
         data={MedicationsForSymptom}
         renderItem={renderMedicationListItem}
         keyExtractor={item => item.id.toString()}
       />
     </SafeAreaView>

     <View style={se2MainButton.buttonView} >
       <TouchableOpacity style={se2MainButton.outerButtonStyle}>
         <Text style = {se2MainButton.innerButtonStyle}  onPress={() => state.navigate('Home')}>
             Home
         </Text>
       </TouchableOpacity>
     </View>



    <ScrollView>
      <Menu style={styles.menu}
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button style={{height: 1, color: "white"}}></Button>}>
        {state.items.map((row, index) => (
            <Menu.Item style={styles.menuItem}
            key={index}
            title={row}
            onPress={() => onPressDropdownItemHandler(row)}
          />
        ))}

      </Menu>
    </ScrollView>


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
     marginTop: -278
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






module.exports = ReverseSearchScreen;

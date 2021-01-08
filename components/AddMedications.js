import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import GetAllMedicationNames from './Mode.js';




var filterInterval;

state = {
  /*
  items: [
	{
		id: 1,
		name: 'abcxy'
	},
	{
		id: 2,
		name: 'abcxz'
	},
	{
		id: 3,
		name: 'abcyz'
	}
],
*/
  items: Array(),
  menuItems: Array(),
}

function EnterMedicationsScreen() {
    return (
      <PaperProvider>
        <View style={styles.view}>
          <Text style={styles.enterText}>Enter your medications</Text>
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



  //Hijacked setSearchQuery -- called displayText instead and called setSearchQuery within it
  function displayText(query){
    setSearchQuery(query);
    //alert("text = " + query);
    //Show menu with all medications that start with the letters in "query"
    if (query.length < 3) return;
    //TODO: if query.length == 3, get all medications from database that start with the 3 letters of the query, and
    //   put them into the "items" array, clearing the array first
    //TODO: include ids - make menuItems an array of objects
    if (query.length == 3){
      //Get all medications that start with the characters in 'query' and store them in 'items'
      console.log("Search string is = " + query);
      global.filteredMedicationList = "";
      GetAllMedicationNames(query);
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
    if (global.filteredMedicationList == ""){
      return;
    }
    clearInterval(filterInterval);
    console.log("Filtered Medication List =  " + global.filteredMedicationList);
    state.items = global.filteredMedicationList.split(",");
    console.log("last item is: " + state.items[state.items.length - 1]);
    if (state.items.length != 0){
      state.items.pop();
      closeMenu();
      openMenu();

    }
    global.filteredMedicationList = "";
  }

  const onPressItemHandler = (value) => {
    //Put the value into the medication list
  };

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

    <Menu style={styles.menu}
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Button style={{height: 1, color: "white"}}></Button>}>

      {state.items.map((row, index) => (
        console.log("menu item is: " + row),
        <Menu.Item
          key={index}
          title={row}
          onPress={() => onPressItemHandler(row)}
        />
      ))}

    </Menu>
  </View>

  );

}

const styles = StyleSheet.create ({
   view: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      paddingTop: 20,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 100
   },
   menu: {
     marginTop: -54
   },
   menuItem: {

   },
   searchbar: {
     width: '80%',
     marginBottom: 0,
   },
   title: {
      fontSize : 24,
      marginBottom: 10
   },
   enterText: {
      fontSize :24,
      marginBottom: 20
    },
    containerStyle: {
      flex: 1,
      marginHorizontal: 20,
      justifyContent: 'center'
    }
})






module.exports = EnterMedicationsScreen;

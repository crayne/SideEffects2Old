import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import GetAllMedicationNames from './Mode.js';




state = {
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
  menuItems: Array()
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

/*
to add menu items dynamically:
<Menu>{this.generateMenuItems()</Menu>
  */
/*
Use react-native-paper Searchbar
Use react-native-paper Menu
instead of react-native-searchable-SearchableDropDown
*/



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
    var i = 0;
    state.menuItems.length = 0;
    for (i=0; i<state.items.length; i++){
        var itemName = state.items[i].name;
        if (itemName.indexOf(query) != -1){
          state.menuItems.push(itemName);
        }
    }
    for (i=0; i<state.menuItems.length; i++){
    }
    if (state.menuItems.length != 0){
      openMenu();
    }
    return query;
  }

  const onPressItemHandler = (value) => {
      console.log("Medication chosen = " + value);
      closeMenu();
      GetAllMedicationNames();
  };

  return (

  <View>

    <Searchbar style={{maxHeight: 50, width: '80%', marginBottom: 0}}
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}

    />

    <Menu
      style={{justifyContent: 'center'}}
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Button style={{height: 1, color: "white"}}></Button>}>


      {state.menuItems.map((row, index) => (
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

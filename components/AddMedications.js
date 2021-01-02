import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';




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
]
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
    //Get these medications from the database - for now, just look in "items"
    var menuItems = Array();
    var i = 0;
    console.log("starting to make menu");
    for (i=0; i<state.items.length; i++){
        var itemName = state.items[i].name;
        if (itemName.indexOf(query) != -1){
          menuItems.push(itemName);
        }
    }

    for (i=0; i<menuItems.length; i++){
      console.log("i = " + i +". menuItems[i] = " + menuItems[i]);
    }
    console.log("Menu making ended\n\n")

    //openMenu();
    return query;
  }

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

      {state.items.map((row, index) => (
        <Menu.Item key={index} title={row.name} />
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

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, TextInput, Text, Provider as PaperProvider, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';


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

var  items  = [
	{
		id: 1,
		name: 'Javascript'
	},
	{
		id: 2,
		name: 'Java'
	},
	{
		id: 3,
		name: 'Ruby'
	},
	{
		id: 4,
		name: 'React Native'
	},
	{
		id: 5,
		name: 'PHP'
	},
	{
		id: 6,
		name: 'Python'
	},
	{
		id: 7,
		name: 'Go'
	},
	{
		id: 8,
		name: 'Swift'
	},
];

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

  //function onChangeSearch(char){
  //  alert("char = " + char);
  //}
  function displayText(query){
    setSearchQuery(query);
    alert("text = " + query);
    return query;
  }

  return (


<View>
      <Searchbar style={{maxHeight: 50, width: '80%', marginBottom: 0, backgroundColor: 'red'}}
        placeholder="Search"
        onChangeText={onChangeSearch}

        value={searchQuery}
      />



        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            backgroundColor: 'blue',
            paddingBottom: 0
          }}>
          <Menu
            style = {{backgroundColor: 'green'}}
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Button onPress={openMenu}>Show menu</Button>}>
            <Menu.Item onPress={() => {}} title="Item 1" />
            <Menu.Item onPress={() => {}} title="Item 2" />
            <Menu.Item onPress={() => {}} title="Item 3" />
          </Menu>
        </View>
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

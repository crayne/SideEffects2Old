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
import {TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Menu,
} from 'react-native-paper';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GetAllMedicationNames from './ModelMeds.js';
import {se2MainButton} from './SE2Styles.js';
import ReverseSearchScreen from './ReverseSearch.js';
import InteractionsScreen from './Interactions.js';
import {
  SaveMedicationList,
  IsMedicationListNull,
} from './PersistMedicationList.js';
import {StyleHeader} from './SE2Styles.js';
import {BackgroundColor} from './SE2Styles.js';


state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
  isSwiping: false,
  filterInterval: 0,
};

//Save medication list to persistent storage
function saveMedicationData() {
  SaveMedicationList(global.MedicationListData).then(
    function (value) {
      console.log('SaveMedicationList succeeded');
    },
    function (error) {
      console.log('SaveMedicationList failed with error: ' + error);
    },
  );
}

// returns the index of the item in the list -- else returns -1
function findItemInMedicationList(medName) {
  for (var i = 0; i < global.MedicationListData.length; i++) {
    if (medName == global.MedicationListData[i].title) {
      return i;
    }
  }
  return -1;
}

function EnterMedicationsScreen(props) {
  state.navigate = props.navigation.navigate;
  StyleHeader(props.navigation, "Enter Medications");

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.view}>
        <Text style={styles.enterText}>Enter your medications:</Text>
        {AddMedicationsDropdown()}
      </View>
    </SafeAreaView>
  );
}

function AddMedicationsDropdown() {
  const [shouldShow, setShouldShow] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => displayText(query);

  const [visible, setVisible] = React.useState(false);
  const [refreshData, setRefreshData] = React.useState(false);


  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const renderMedicationListItem = ({item}) => <Item title={item.title} />;
  const renderMenuListItem = ({item}) => <MedMenuItem title={item} />;

  //Hijacked setSearchQuery -- called displayText instead and called setSearchQuery within it
  function displayText(query) {
    setSearchQuery(query);
    console.log('In AddMedication.displayText, query length = ' + query.length);
    //Show menu with all medications that start with the letters in "query"
    if (query.length < 3) {
      closeMenu();
      hideMenuItems();
      setShouldShow(false);
      return;
    }
    //TODO: if query.length == 3, get all medications from database that start with the 3 letters of the query, and
    //   put them into the "items" array, clearing the array first
    //TODO: include ids - make menuItems an array of objects
    if (query.length >= 3) {
      //Get all medications that start with the characters in 'query' and store them in 'items'
      console.log('Search string is = ' + query);
      global.filteredMedicationList = '';
      GetAllMedicationNames(query);
      clearInterval(state.filterInterval);
      state.filterInterval = setInterval(function () {
        CheckFilteredMedicationList(query);
      }, 1000);
      console.log(
        'After setInterval, state.filterInterval = ' + state.filterInterval,
      );
    }

    return query;
  }

  function CheckFilteredMedicationList(query) {
    clearInterval(state.filterInterval);

    console.log(
      'After clearInterval, state.filterInterval = ' + state.filterInterval,
    );

    if (global.filteredMedicationList == '') {
      return;
    }
    global.filteredMedicationList = global.filteredMedicationList.toLowerCase();
    console.log(
      'In CheckFilteredMedicationList, Filtered Medication List =  ' +
        global.filteredMedicationList,
    );
    state.items = global.filteredMedicationList.split(':');
    console.log(
      'In CheckFilteredMedicationList, split global.filteredMedicationList length = ' +
        state.items.length,
    );
    if (state.items.length == 0) {
      global.filteredMedicationList = '';
    }
    var i = 0;
    console.log(
      'Putting items from server into menu, state.items.length = ' +
        state.items.length,
    );
    state.menuItems.length = 0;
    for (i = 0; i < state.items.length; i++) {
      var itemName = state.items[i];
      if (itemName.indexOf(query) != -1) {
        state.menuItems.push(itemName);
      }
    }
    state.items.pop();
    closeMenu();
    openMenu();
    setShouldShow(true);
  }

  const handleMedicationListItemDelete = (medName) => {
    console.log('In handleMedicationListItemDelete');
    console.log('In handleMedicationListItemDelete, title = ' + medName);
    var index = findItemInMedicationList(medName);
    console.log('In handleMedicationListItemDelete, index = ' + index);
    if (index == -1) return;
    global.MedicationListData.splice(index, 1);
    console.log(
      'In handleMedicationListItemDelete, size of MedicationListData after delete = ' +
        global.MedicationListData.length,
    );
    saveMedicationData();
    setRefreshData(!refreshData);
    //This weird code makes the medication list update visually correctly
    //state.navigate('Home');
    //state.navigate('EnterMedications');
  };

  const medicationNamePressed = (medicationName) => {
    alert("Medication name pressed");
  }

  const Item = ({title}) => (
      <View style={styles.medicationListItem}>
        <Text style={styles.medicationListItemText}
          onPress={() => medicationNamePressed(title)}
        >{title}</Text>
        <Icon
          style={styles.deleteIcon}
          name="trash-can-outline"
          size={20}
          color="#000"
          onPress={() => handleMedicationListItemDelete(title)}
        />
   </View>
  );

  const MedMenuItem = ({title}) => (
    <View style={styles.medicationListItem}>
      <ScrollView horizontal keyboardShouldPersistTaps="handled">
        <TouchableHighlight>
          <Text
            numberOfLines={1}
            style={styles.menuListItemText}
            onPress={() => onPressDropdownItemHandler(title)}>
            {title}
          </Text>
        </TouchableHighlight>
      </ScrollView>
    </View>
  );

  const hideMenuItems = () => {
    state.items.length = 0;
  };

  const onPressDropdownItemHandler = (value) => {
    //Put the value chosen from the medication menu into the medication list
    console.log('In onPressDropdownItemHandler, value = ' + value);
    var newId;
    //Check for duplicates
    var index = findItemInMedicationList(value);
    console.log('item is: ' + value + '. index is: ' + index);
    if (index != -1) {
      closeMenu();
      return;
    }
    if (global.MedicationListData.length == 0) newId = '1';
    else {
      var lastId =
        global.MedicationListData[global.MedicationListData.length - 1].id;
      newId = Number(lastId) + 1;
    }
    const medicationObject = {title: value, id: newId};
    if (global.MedicationListData.includes(medicationObject) == false) {
      console.log(
        'In onPressDropdownHandler, Pushing medication object with title = ' +
          medicationObject.title,
      );
      global.MedicationListData.push(medicationObject);
    }
    closeMenu();
    hideMenuItems();
    setShouldShow(false);

    saveMedicationData();
  };

  const verifyAndGo = (destination) => {
    setShouldShow(false);
    console.log('In verifyAndGo, destination = ' + destination);
    if (global.MedicationListData.length == 0) {
      alert('The medication list contains no medications.');
      return;
    }
    if (
      global.MedicationListData.length == 1 &&
      destination == 'Interactions'
    ) {
      alert('The interaction check requires two or more medications.');
      return;
    }
    if (destination == 'SideEffectsList'){
      state.navigate(destination,{medicationName: 'diltiazem'});
    }
    else {
      state.navigate(destination);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <Searchbar
        style={styles.searchbar}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        autoCapitalize="none"
      />

      <ScrollView style={styles.medicationListStyle}>
        <FlatList
          style={styles.medicationList}
          ItemSeparatorComponent={({highlighted}) => (
            <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
          )}
          data={global.MedicationListData}
          renderItem={renderMedicationListItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={refreshData}
        />
      </ScrollView>

      {shouldShow ? (
        <ScrollView style={styles.menuListStyle} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={() => setShouldShow(false)}>
            <FlatList
              style={styles.menuList}
              data={state.items}
              renderItem={renderMenuListItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.menuContentContainer}
              keyboardShouldPersistTaps="handled"
            />
          </TouchableWithoutFeedback>
        </ScrollView>
      ) : null}

      <View style={se2MainButton.buttonView}>
        <TouchableOpacity style={se2MainButton.innerButtonStyle}>
          <Text
            style={se2MainButton.innerButtonStyle}
            onPress={() => verifyAndGo('ReverseSearch')}>
            Reverse Search
          </Text>
        </TouchableOpacity>
      </View>

      <View style={se2MainButton.buttonView}>
        <TouchableOpacity style={se2MainButton.innerButtonStyle}>
          <Text
            style={se2MainButton.innerButtonStyle}
            onPress={() => verifyAndGo('Interactions')}>
            Interactions
          </Text>
        </TouchableOpacity>
      </View>
      <View style={se2MainButton.buttonView}>
        <TouchableOpacity style={se2MainButton.innerButtonStyle}>
          <Text
            style={se2MainButton.innerButtonStyle}
            onPress={() => verifyAndGo('SideEffectsList')}>
            Medication Side Effects
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    marginLeft: 16,
    marginRight: 16,
  },

  menu: {},

  menuItem: {},

  searchbar: {
    width: '100%',
    marginBottom: 0,
  },

  enterText: {
    fontSize: 26,
    marginTop: 20,
    marginBottom: 20,
    color: "white"
  },

  menuListStyle: {
    marginTop: 0,
    fontSize: 24,
    height: 200,
    width: '90%',
    flexGrow: 0,
    opacity: 1,
    backgroundColor: 'transparent',
    elevation: 3,
    position: 'absolute',
    top: 52,
    left: 20,
    bottom: 0,
  },

  menuList: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
    minHeight: 40,
    maxHeight: 200,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'purple',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  menuContentContainer: {
    alignItems: 'flex-start',
  },

  medicationListStyle: {
    marginTop: 20,
    fontSize: 24,
    height: 200,
    flexGrow: 0,
    opacity: 1,
    borderRadius: 4,
    elevation: 1,
    backgroundColor: 'transparent',

  },

  medicationList: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22

  },

  medicationListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
  },

  medicationListItemText: {
    width: "90%",
    fontSize: 24,
    marginLeft: 5,
  },

  medicationListItemIcon: {
    width: "10%",
    marginRight: 5,
    marginTop: 2,
  },

  menuListItemText: {
    fontSize: 24,
    marginLeft: 5,
    marginRight: 40,
    textAlign: 'right',
  },

  separator: {
    color: 'red',
    borderWidth: 1,
    backgroundColor: 'blue',
  },

  deleteIcon: {
    marginTop: 5,
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: BackgroundColor
  }
});

module.exports = EnterMedicationsScreen;

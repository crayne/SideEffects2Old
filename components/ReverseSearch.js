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

var filterIntervalSymptoms;
var filterIntervalMedications;

state = {
  items: Array(),
  menuItems: Array(),
  navigate: null,
};

var medicationListVisibility = 0;

//List of medications which might cause this symptom
const MedicationsForSymptom = Array();
//List of all user Medications
var AllUserMedications = Array();

var testTitle = 'glurb';

//Save medication list to persistent storage
function saveMedicationData() {}

function ReverseSearchScreen(props) {
  state.navigate = props.navigation.navigate;
  StyleHeader(props.navigation, "Reverse Search");

  const {navigation} = props;
  AllUserMedications = global.MedicationListData;
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    MedicationsForSymptom.length = 0;
  });
  console.log(
    'In ReverseSearchScreen, AllUserMedications length is: ' +
      AllUserMedications.length,
  );
  console.log('AllUserMedications item is: ' + AllUserMedications[0].title);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.view}>
        <Text style={styles.enterText}>Enter a symptom:</Text>
        {AddMedicationsDropdown()}
      </View>
    </SafeAreaView>
  );
}

function AddMedicationsDropdown() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => displayText(query);

  const [visible, setVisible] = React.useState(false);
  const [shouldShow, setShouldShow] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const renderMedicationListItem = ({item}) => <Item title={item.title} />;
  const renderMenuListItem = ({item}) => <SymptomMenuItem title={item} />;

  //Hijacked setSearchQuery -- called displayText instead and called setSearchQuery within it
  function displayText(query) {
    setSearchQuery(query);
    //Show menu with all symptoms that start with the letters in "query"
    if (query.length < 3) {
      closeMenu();
      setShouldShow(false);
      return;
    }
    //TODO: if query.length == 3, get all medications from database that start with the 3 letters of the query, and
    //   put them into the "items" array, clearing the array first
    //TODO: include ids - make menuItems an array of objects
    if (query.length >= 3) {
      //Get all medications that start with the characters in 'query' and store them in 'items'
      console.log('Search string is = ' + query);
      global.filteredReverseSearchMenuList = '';
      GetAllSymptomNames(query);
      clearInterval(filterIntervalSymptoms);
      filterIntervalSymptoms = setInterval(function () {
        CheckFilteredSymptomList(query);
      }, 1000);
    }
    return query;
  }

  function CheckFilteredSymptomList(query) {
    clearInterval(filterIntervalSymptoms);

    if (global.filteredReverseSearchMenuList == '') {
      return;
    }
    global.filteredReverseSearchMenuList = global.filteredReverseSearchMenuList.toLowerCase();
    console.log(
      'Filtered Symptom List =  ' + global.filteredReverseSearchMenuList,
    );
    state.items = global.filteredReverseSearchMenuList.split('+');
    if (state.items.length == 0 || state.items[0] == null) {
      global.filteredReverseSearchMenuList = '';
    }
    var i = 0;
    console.log(
      'Putting items from server into menu, number of items = ' +
        state.items.length,
    );
    state.menuItems.length = 0;
    for (i = 0; i < state.items.length; i++) {
      var itemName = state.items[i];
      if (itemName.indexOf(query) != -1) {
        state.menuItems.push(itemName);
      }
    }
    if (state.menuItems.length != 0) {
      closeMenu();
      openMenu();
      setShouldShow(true);
    }
  }

  const Item = ({title}) => (
    <View style={styles.medicationListItem}>
      <Text style={styles.medicationListItemText}>{title}</Text>
    </View>
  );

  const SymptomMenuItem = ({title}) => (
    <View style={styles.medicationListItem}>
      <ScrollView horizontal keyboardShouldPersistTaps="handled">
        <TouchableHighlight>
          <Text
            numberOfLines={1}
            style={styles.menuListItemText}
            onPress={() => onPressDropdownItemHandlerReverse(title)}>
            {title}
          </Text>
        </TouchableHighlight>
      </ScrollView>
    </View>
  );

  const onPressDropdownItemHandlerReverse = (value) => {
    console.log(
      'In ReverseSearch onPressDropdownItemHandlerReverse, symptom = ' + value,
    );

    /*
    Check in database to see if value (symptom) occurs with any of the user's medications
    */
    console.log(
      'in onPressDropdownItemHandlerReverse, AllUserMedications = ' +
        AllUserMedications,
    );

    console.log(
      'in onPressDropdownItemHandlerReverse, AllUserMedications.length = ' +
        AllUserMedications.length,
    );
    global.filteredReverseSearchResultList = '';
    MedicationsForSymptom.length = 0;
    for (var i = 0; i < AllUserMedications.length; i++) {
      var medication = AllUserMedications[i].title;
      console.log('Call MedicationHasSideEffect, symptom = ' + value);
      MedicationHasSideEffect(medication, value);
    }
    filterIntervalMedications = setInterval(CheckFilteredMedicationList, 1000);

    /* console.log("MedicationHasSideEffect returned: " + global.filteredReverseSearchResultList); */
    closeMenu();
    setShouldShow(false);
    medicationListVisibility = 1;
  };

  function CheckFilteredMedicationList() {
    clearInterval(filterIntervalMedications);

    if (global.filteredReverseSearchResultList == '') {
      console.log('In CheckFilteredMedicationList, returning because of null list');
      const mObject = {
        title: 'None of your medications have this side effect',
        id: '1',
      };
      MedicationsForSymptom.push(mObject);
      setSearchQuery('');
      return;
    }
    global.filteredReverseSearchResultList = global.filteredReverseSearchResultList.toLowerCase();
    console.log(
      'Filtered Medication List =  ' + global.filteredReverseSearchResultList,
    );
    var resultArray = global.filteredReverseSearchResultList.split(',');
    var newId;
    console.log(
      'In CheckFilteredMedicationList, resultArray length = ' +
        resultArray.length,
    );
    for (var i = 0; i < resultArray.length; i++) {
      if (MedicationsForSymptom.length == 0) newId = '1';
      else {
        var lastId = MedicationsForSymptom[MedicationsForSymptom.length - 1].id;
        newId = Number(lastId) + 1;
      }
      const medicationObject = {title: resultArray[i], id: newId};
      if (medicationObject.title == '') continue;
      console.log(
        'Returned for reverse search, value returned = ' + resultArray[i],
      );
      console.log(
        'pushing object to MedicationsForSymptom: ' +
          medicationObject.title +
          ', ' +
          medicationObject.id,
      );
      MedicationsForSymptom.push(medicationObject);
    }
    global.filteredReverseSearchResultList = '';
    setSearchQuery('');
  }

  const medicationListStyle = function (medicationListVisibility) {
    return {
      marginTop: 20,
      fontSize: 24,
      height: 200,
      flexGrow: 0,
      opacity: medicationListVisibility,
      backgroundColor: 'transparent',
     elevation: 3,
    };
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
      <Searchbar
        style={styles.searchbar}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        theme={{colors: {text: 'black'}}}
        autoCapitalize="none"
      />

      <Text style={styles.listTitleText}>
        Medications which could cause the symptom:
      </Text>

      <ScrollView style={medicationListStyle(medicationListVisibility)}>
        <FlatList
          style={styles.medicationList}
          ItemSeparatorComponent={({highlighted}) => (
            <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
          )}
          data={MedicationsForSymptom}
          renderItem={renderMedicationListItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
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
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            />
        </TouchableWithoutFeedback>
        </ScrollView>

      ) : null}

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
    marginTop: -82,
  },

  menuItem: {},

  searchbar: {
    width: '100%',
    marginBottom: 0,
    backgroundColor: 'white',
  },

  enterText: {
    fontSize: 26,
    marginTop: 80,
    marginBottom: 20,
    color: "white"
  },

  listTitleText: {
    fontSize: 26,
    marginTop: 20,
    textAlign: 'center',
    color: "white"
  },

  menuListStyle: {
    marginTop: 0,
    fontSize: 24,
    height: 200,
    width: '90%',
    flexGrow: 0,
    backgroundColor: 'transparent',
    opacity: 1,
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
      minHeight: 0,
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
      paddingTop: 15,
    },

    contentContainer: {
      alignItems: 'flex-start'
    },

  menuListItemText: {
    fontSize: 24,
    marginLeft: 5,
    marginRight: 40,
    textAlign: 'right',
  },

  medicationList: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
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
    fontSize: 24,
    marginLeft: 5,
  },

  medicationListItemIcon: {
    marginRight: 5,
    marginTop: 2,
  },

  separator: {
    borderWidth: 2,
    borderColor: "transparent"
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: BackgroundColor
  }

});



module.exports = ReverseSearchScreen;

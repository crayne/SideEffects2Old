import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import EnterMedicationsScreen from './components/AddMedications.js';
import ReverseSearchScreen from './components/ReverseSearch.js';
import InteractionsScreen from './components/Interactions.js';
import SideEffectsListScreen from './components/SideEffectList.js';
import {se2MainButton} from './components/SE2Styles.js';
import {StyleHeader} from './components/SE2Styles.js';
import {BackgroundColor} from './components/SE2Styles.js';
import {RetrieveMedicationList} from './components/PersistMedicationList.js';

const Stack = createStackNavigator();

function getMedsAndNavigate(navigation) {
  RetrieveMedicationList().then(
    function (value) {
      console.log('In App RetrieveMedicationList succeeded');
      if (value == null)
        console.log('In App, RetrieveMedicationList returned null');
      else {
        console.log(
          'In App RetrieveMedicationList, length of returned array is: ' +
            value.length,
        );
        global.MedicationListData.length = 0;
        for (var i = 0; i < value.length; i++) {
          console.log(
            'In App RetrieveMedicationList, adding item to MedicationListDate, title = ' +
              value[i].title,
          );
          console.log(
            'In App RetrieveMedicationList, adding item to MedicationListDate, id = ' +
              value[i].id,
          );
          value[i].id = '' + value[i].id;
          if (global.MedicationListData.includes(value[i]) == false) {
            console.log('In getMedicationData, pushing value');
            global.MedicationListData.push(value[i]);
          }
        }
      }
      navigation.navigate('EnterMedications');
    },
    function (error) {
      console.log('RetrieveMedicationList failed with error: ' + error);
    },
  );
}

function HomeScreen({navigation}) {

  StyleHeader(navigation, "Home");

  return (
    <View style={styles.mainView}>
    <View style={styles.view}>
      <Text style={styles.title}>Welcome to SideEffects2</Text>

      <Text style={styles.explainText}>
        Is a medication causing your symptoms?
      </Text>

      <TouchableOpacity style={se2MainButton.buttonView}>
        <Text
          style={se2MainButton.homeButtonStyle}
          onPress={() => getMedsAndNavigate(navigation)}>
          Find Out!
        </Text>
      </TouchableOpacity>
    </View>
    </View>

  );
}



function SideEffects2() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="EnterMedications"
          component={EnterMedicationsScreen}
        />
        <Stack.Screen name="ReverseSearch" component={ReverseSearchScreen} />
        <Stack.Screen name="Interactions" component={InteractionsScreen} />
        <Stack.Screen name="SideEffectsList" component={SideEffectsListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SideEffects2;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: BackgroundColor
  },

  mainView: {
    height: "100%",
    width: "100%",
    backgroundColor: BackgroundColor
  },

  title: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
  explainText: {
    fontSize: 26,
    marginTop: 40,
    marginBottom: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
});

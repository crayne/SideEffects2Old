import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EnterMedicationsScreen from './components/AddMedications.js'
import ReverseSearchScreen from './components/ReverseSearch.js'
import {se2MainButton} from './components/SE2Styles.js'


/*
function EnterMedicationsScreen({navigation}) {
  return (
    <View style={styles.explainText}>
      <Text>Enter Medications Screen</Text>
    </View>
  );
}
*/

const Stack = createStackNavigator();



function HomeScreen({navigation}) {
  return (
    <View style = {styles.view}>
      <Text style = {styles.title}>Welcome to SideEffects2</Text>

      <Text style = {styles.explainText}>Is a medication causing your symptoms?</Text>

      <TouchableOpacity style={se2MainButton.buttonView}>
      <Text style = {se2MainButton.homeButtonStyle}  onPress={() => navigation.navigate('EnterMedications')}>
          Find Out!
      </Text>
      </TouchableOpacity>

    </View>
  );
}

function SideEffects2() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EnterMedications" component={EnterMedicationsScreen} />
        <Stack.Screen name="ReverseSearch" component={ReverseSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SideEffects2;

const styles = StyleSheet.create ({
   view: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 200,
      marginLeft: 16,
      marginRight: 16
   },
   title: {
      fontSize : 30,
      marginBottom: 10
   },
   explainText: {
      fontSize : 24,
      marginBottom: 20,
      textAlign: "center"
    },

})

import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <View style = {styles.view}>
      <Text style = {styles.title}>Welcome to SideEffects2</Text>

      <Text style = {styles.explainText}>Is a medication causing your symptoms?</Text>

      <Button mode="contained" onPress={() => console.log('Pressed')}>
          Find out!
      </Button>

    </View>
  );
}

function SideEffects2() {
  const [checked, setChecked] = React.useState('male');

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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
      fontSize : 24,
      marginBottom: 10
   },
   explainText: {
      fontSize :18,
      marginBottom: 20
    }
})

import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, Text} from 'react-native';

const BackgroundColor = '#0d47a1';
const SecondTextColor = '#90caf9';
const ButtonBackground = '#2196f3';


function StyleHeader(navigation, title) {
  React.useLayoutEffect(() => {
      navigation.setOptions({
        /*
        headerTitle: (props) => (
          <Text
            {...props}
            style={{color: SecondTextColor, fontSize: 24}}>
              {title}
          </Text>
        ),
        */
        headerTintColor: SecondTextColor,
        headerStyle: {
          backgroundColor: BackgroundColor, //Set Header color
        },
      });
    }, [navigation]);


}

const se2MainButton = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  homeButtonStyle: {
    backgroundColor: ButtonBackground,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },

  innerButtonStyle: {
    backgroundColor: ButtonBackground,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
});

export {se2MainButton};
export {StyleHeader};
export {BackgroundColor};

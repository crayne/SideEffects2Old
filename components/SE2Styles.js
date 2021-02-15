import { StyleSheet, View, TouchableOpacity } from 'react-native';


const se2MainButton = StyleSheet.create({
  buttonView: {
    alignItems: 'center'
  },

  outerButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: 20
  },

  innerButtonStyle: {
    backgroundColor: 'purple',
    color: "white",
    width: 200,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center'
  }

})

export {se2MainButton}

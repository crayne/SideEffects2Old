import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { AsyncStorage } from 'react-native';



async function SaveMedicationList(medListArray) {
  var strMedListArray = JSON.stringify(medListArray);
  console.log("In SaveMedicationList, medListArray length = " + medListArray.length);
  console.log("In SaveMedicationList, first medListArray med = " + medListArray[0].title);
  console.log("In SaveMedicationList stringified medListArray = " + JSON.stringify(medListArray));
  try {
    await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(medListArray));
  } catch (error) {
    console.log("Error saving medication list: " + error + ", " + medListArray);
  }

}

//Retrieves MedicationListArray
async function RetrieveMedicationList(){
  try {
    const myArray = await AsyncStorage.getItem('@MySuperStore:key');
    if (myArray !== null) {
      // We have data!!
      var parsedArray = JSON.parse(myArray);
      return parsedArray;
    }
  } catch (error) {
        console.log("Error retrieving medication list: " + medListArray);
        return;
  }
}

async function IsMedicationListNull(){
  try {
    const myArray = await AsyncStorage.getItem('@MySuperStore:key');
    if (myArray !== null) {
      // We have data!!
      return false;
    }
  } catch (error) {
        return true;
  }
}





module.exports = {SaveMedicationList, RetrieveMedicationList, IsMedicationListNull};

import 'react-native-gesture-handler';
import React, { useState, Component } from 'react';
import { AsyncStorage } from 'react-native';

const medListKey = "MEDLISTKEY1";

async function SaveMedicationList(medListArray) {
  var strMedListArray = JSON.stringify(medListArray);
  console.log("In SaveMedicationList, medListArray length = " + medListArray.length);
  console.log("In SaveMedicationList, first medListArray titleColor = " + medListArray[0].title);
  console.log("In SaveMedicationList, first medListArray id = " + medListArray[0].id);

  console.log("In SaveMedicationList stringified medListArray = " + JSON.stringify(medListArray));
  try {
    await AsyncStorage.setItem(medListKey, JSON.stringify(medListArray));
  } catch (error) {
    console.log("Error saving medication list: " + error + ", " + medListArray);
  }

}

//Retrieves MedicationListArray
async function RetrieveMedicationList(){
  try {
    const myArray = await AsyncStorage.getItem(medListKey);
    if (myArray !== null) {
      // We have data!!
      var parsedArray = JSON.parse(myArray);
      return parsedArray;
    }
    else {
      return null;
    }
  } catch (error) {
        console.log("Error retrieving medication list: " + medListArray);
        return;
  }
}

async function IsMedicationListNull(){
  try {
    const myArray = await AsyncStorage.getItem(medListKey);
    if (myArray !== null) {
      // We have data!!
      return false;
    }
    else {
      return true;
    }
  } catch (error) {
        return true;
  }
}





module.exports = {SaveMedicationList, RetrieveMedicationList, IsMedicationListNull};

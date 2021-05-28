import 'react-native-gesture-handler';
import React, {useState, Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';

//This is for an emulator
var localHost =  "http://192.168.1.228:8888/sideEffectsNewData";
//This is for a connected Android phone
//localHost =  "http://localhost:8888/sideEffectsNewData";

var serverHost = "http://www.oryxtech.net/sideEffectsNewData";

//var currentHost = global.serverHost;

function GetHost(){
  return serverHost;
}


export {GetHost};

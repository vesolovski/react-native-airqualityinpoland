import React, { Component } from "react";
import { Button, StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from "../components/Lottie";
import {Context} from '../components/Context';
import {Paragraph, Text} from '../components/Components';
import {Fonts, Themes} from "../components/Context";
import SectionHeader from '../components/SectionHeader';
const FAVOURITESKEY = 'favourites';
const SETTINGSKEY = 'settings';
const STATIONSKEY = 'stations';
export default (props) => {
  const currentContext = React.useContext(Context);
  const navigation = props.navigation; 
  const isFocused = useIsFocused();
  const [settings, setSettings] = React.useState({});
  const [favourites, setFavourites] = React.useState([]);
  const [stations, setStations] = React.useState([]);
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 2,
      elevation: 1,
      marginBottom:5,
      backgroundColor: currentContext.theme.colors.primary,
    },
    buttonText: {
      fontSize:15,
      fontFamily:currentContext.fonts.light,
      color: 'white',
    },
})
	React.useLayoutEffect(() => { props.navigation.setOptions({ headerTitle: props.route.name.split('.')[0] });},[props.navigation,props.route.name]);
  React.useEffect(() => {
    const fetchDB = async () => { 
      let settings = await AsyncStorage.getItem(SETTINGSKEY);
      settings = settings ? JSON.parse(settings) : {}; 
      setSettings(settings); 
      let favourites = await AsyncStorage.getItem(FAVOURITESKEY); 
      favourites = favourites ? JSON.parse(favourites) : []; 
      setFavourites(favourites); 
      let stations = await AsyncStorage.getItem(STATIONSKEY);
      stations = stations ? JSON.parse(stations) : []; 
      setStations(stations); 
    }
    fetchDB().catch(console.error);
    return true;
  },[isFocused]);
  const saveContextThemeInStorage = React.useCallback(async () => {
    settings.theme = settings.theme == 'dark' ? 'default' : 'dark';
    AsyncStorage.setItem(SETTINGSKEY, JSON.stringify(settings));
    setSettings({theme: settings.theme});
    if(settings.theme == 'dark') { currentContext.setContextTheme.current(settings.theme); }
    else { settings.theme == 'default'; currentContext.setContextTheme.current(settings.theme); }
  },[settings,currentContext.setContextTheme]);
  const clearStations = React.useCallback(async () => {
    AsyncStorage.removeItem(STATIONSKEY);
    setStations([]);
  },[]);
  const clearFavourites = React.useCallback(async () => {
    AsyncStorage.removeItem(FAVOURITESKEY);
    setFavourites([]);
  },[]);
  return (
    <View style={{flex:1, padding:10, alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column'}}>
     <SectionHeader>AsyncStorage.stations:</SectionHeader>
      <Text style={{color:currentContext.theme.colors.primary}}>{JSON.stringify(stations.length)} entries</Text>
      <Pressable style={styles.button} onPress={()=>clearStations()}><Text style={styles.buttonText}>clear entries</Text></Pressable>
      <Text style={{color:currentContext.theme.colors.text}}>(this will force a new fetch from https://api.gios.gov.pl/pjp-api/rest/station/findAll. please note that this list is stored locally in order for our ip not to get blacklisted by gios for too frequent requests, when we are performing filtering and sorting).</Text>
      <SectionHeader>AsyncStorage.favourites:</SectionHeader>
      <Text style={{color:currentContext.theme.colors.primary}}>{JSON.stringify(favourites.length)} entries</Text>
      <Pressable style={styles.button} onPress={()=>clearFavourites()}><Text style={styles.buttonText}>clear favourites</Text></Pressable>
      <SectionHeader>AsyncStorage.settings:</SectionHeader>
      <Text style={{color:currentContext.theme.colors.primary}}>{JSON.stringify(settings)}</Text>
      <Pressable style={styles.button} onPress={()=>saveContextThemeInStorage()}><Text style={styles.buttonText}>change theme</Text></Pressable>
      <SectionHeader>OpenStreetMap</SectionHeader>
      <Text>Occasionally the map loads incorrectly due to some issue that openstreenmap has (https://forum.openstreetmap.org/viewtopic.php?id=68432)</Text>
    </View>
  );
}
import React, { Component } from "react";
import { Image, FlatList, StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Pressable, StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from "react-native-vector-icons/Entypo";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from 'expo-constants';
import {Paragraph, Text} from '../components/Components';
import {Context} from '../components/Context';
import StationBasicCard from '../components/StationBasicCard';
import SectionHeader from '../components/SectionHeader';
import Logo from '../components/Logo';
import {cleanup, normalize, distance, globals} from '../components/Helpers';
const STATIONSKEY = 'stations';
export default (props) => {
  const currentContext = React.useContext(Context);
  const navigation = props.navigation;
  const isFocused = useIsFocused();
  const [forceStorageFetch, setforceStorageFetch] = React.useState(0);
  const [routerTab, setRouterTab] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [allData, setAllData] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const fetchAllData = React.useRef(()=>{}).current; //opcjonalnie uselayoutEffect
  const forceStorageFetchCallback = () => {
    setforceStorageFetch(Math.random());
  }
  React.useEffect(() => { 
    fetchAllData.current = async () => {
      try {
        let stationsData = await AsyncStorage.getItem(STATIONSKEY); 
        stationsData = stationsData ? JSON.parse(stationsData) : [];
        console.log('fetching stations from device storage: ' + stationsData.length);
        if(stationsData.length == 0)
        {
          let stationsData = await fetch(globals.proxy+globals.stations);
          stationsData = await stationsData.json();
          console.log('fetching from api.gios.gov.pl: ' + stationsData.length);
          AsyncStorage.removeItem(STATIONSKEY);
          AsyncStorage.setItem(STATIONSKEY, JSON.stringify(stationsData));
        }
        const json = stationsData;
        setAllData(json);
      } catch (error) { console.log(error); }
    }
    if(isFocused == true) fetchAllData.current(); 
  }, [fetchAllData, isFocused, allData.length]);
  React.useEffect(() => { 
    const fetchDB = async () => { 
      let FAVOURITESKEY = 'favourites';
	    let favourites = await AsyncStorage.getItem(FAVOURITESKEY); 
      favourites = favourites ? JSON.parse(favourites) : [];
      console.log('fetching favourites from device storage: ' + favourites.length);
      if(isFocused == true) setFavourites(favourites);
    }
    if(isFocused) fetchDB().catch(console.error);
  },[isFocused, forceStorageFetch]);
  React.useEffect(() => { 
    if(search.length) {
      props.navigation.setOptions({ headerTitle: 'Szukaj w: ' + search, headerBackground: () => null});
    } else {
      props.navigation.setOptions({ headerTitle: '', headerBackground: () => (<Logo/>)});
    }
  },[props.route.name,props.navigation,search]);
  React.useEffect(() => { let routerTab = props.route.name.split('.'); routerTab = routerTab[0]; setRouterTab(routerTab); }, [props.route.name]);
  React.useEffect(() => {
    let data = [...allData]; //let data = allData - wtedy referencja a nie kopia
    for (let j = 0; j < data.length; j++) { 
      data[j].stationName = data[j].stationName.trim(); 
      if(props.location) {
        data[j].distance = distance(data[j].gegrLat, data[j].gegrLon, props.location.coords.latitude, props.location.coords.longitude);
      } else {
        data[j].distance = null;
      }
    }
    if (search.length) {
      let output = [];
      let outputCouter = 0;
      for (let j = 0; j < data.length; j++) {
        if (cleanup(normalize(data[j].city.name)).indexOf(cleanup(normalize(search))) !== -1) {
          output[outputCouter] = data[j];
          outputCouter = outputCouter + 1;
        }
      }
      data = output;
    }
    if (routerTab == 'Favourites') {
      let output = [];
      let outputCouter = 0;
      for (let j = 0; j < data.length; j++) {
        if (favourites.includes(data[j].id)) {
          output[outputCouter] = data[j];
          outputCouter = outputCouter + 1;
        }
      }
      data = output;
    }
    if(routerTab == 'Favourites') {
      data.sort(function(a,b){return a.city.name.localeCompare(b.city.name,"pl")}); 
    } else if(routerTab == 'Near') {
      data.sort(function(a,b){return a.distance - b.distance});
      data.splice(9);
    } else if(routerTab == 'Search') {
      data.sort(function(a,b){return a.city.name.localeCompare(b.city.name,"pl")});
      if (search.length == 0) {
        data.splice(0);
      } else {
        data.sort(function(a,b){return a.city.name.localeCompare(b.city.name,"pl")});
      }
    }
    setData(data);
  }, [allData, props.route.name, props.location, routerTab, search, favourites, isFocused, forceStorageFetch]);
  return (
    <View style={styles.container}>{ props.location || routerTab != 'Near' ? 
      <View style={styles.scrollArea}>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea_contentContainerStyle}>
          { routerTab == 'Search' ?
          <View style={[styles.searchView,{borderColor:currentContext.theme.colors.border,backgroundColor:currentContext.theme.colors.card}]}>
            <TextInput placeholderTextColor={currentContext.theme.colors.text} style={[styles.searchTextInput,{color:currentContext.theme.colors.text,fontFamily:currentContext.fonts.light}]} value={search} onChangeText={(value) => setSearch(value)} placeholder="-- find station by city --" />
            {search.length ? (<TouchableOpacity onPress={() => setSearch("")}><IoniconsIcon name="close-circle-outline" style={{marginRight:5,color:currentContext.theme.colors.text}} size={20}/></TouchableOpacity>) : (null)}
          </View> : null }
          <SectionHeader>{routerTab}</SectionHeader>
          {data.map((item)=>{ return (
          <StationBasicCard {...props} item={item} favourite={favourites.includes(item.id)} forceStorageFetchCallback={forceStorageFetchCallback}/>
        )})}
          {routerTab == 'Favourites' && data.length == 0 ? <Text>You may use swipe gestures on this and on other screens to mark/unmark your favourite stations</Text> : null}
        </ScrollView>
      </View>
      : 
      <>
        <SectionHeader>Fetching gps in progress</SectionHeader>
        <Text>Please mind that location services must be enabled on your device in order for us to display your nearest stations. Please allow access to location services on your device.</Text>
      </>
    }
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  scrollArea: {
    alignSelf: "stretch",
    flex: 1
  },
  scrollArea_contentContainerStyle: {
    paddingTop: 0,
    paddingRight: 10,
    paddingLeft: 10
  },
  searchView: {borderRadius:5,borderWidth:0,flexDirection:"row",marginBottom:5,alignItems:'center',justifyContent:'space-between'},
  searchTextInput: {height:30,width:'90%',paddingLeft:10},
});
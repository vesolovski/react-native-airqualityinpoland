import React, { Component } from "react";
import {StyleSheet, ScrollView, View, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from "react-native-vector-icons/Entypo";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Paragraph, Text} from '../components/Components';
import SectionHeader from '../components/SectionHeader';
import {Context} from '../components/Context';
import IndicatorMainIndex from '../components/IndicatorMainIndex';
import IndicatorSensorIndex from '../components/IndicatorSensorIndex';
import MapFrame from '../components/MapFrame';
const FAVOURITESKEY = 'favourites';
import {cleanup, normalize, distance, globals, colorIndicator, sensorsScale} from '../components/Helpers';
export default function Home (props) {
  let station = props.route.params.item;
  const currentContext = React.useContext(Context);
  const isFocused = useIsFocused();
  const [favourites, setFavourites] = React.useState([]);
  const [isFavourite, setIsFavourite] = React.useState(null);
  const [sensorsData, setSensorsData] = React.useState([]);
  const [indexData, setIndexData] = React.useState({});
  const [sensorsByKey, setSensorsByKey] = React.useState({pm10:null,pm25:null,so2:null,no2:null,o3:null,co:null,c6h6:null});
  const fetchData = React.useRef(()=>{}).current;
  React.useLayoutEffect(() => { props.navigation.setOptions({ 
    headerShown:true, 
    headerTitle: station.city.name + ', ' + station.addressStreet,
    headerRight: () => (
      isFavourite ? <Pressable onPress={toggleFavourite}><MaterialCommunityIconsIcon style={[styles.icon,{color:currentContext.theme.colors.primary}]} name="heart"/></Pressable> : <Pressable onPress={toggleFavourite}><MaterialCommunityIconsIcon style={[styles.icon,{color:currentContext.theme.colors.primary}]} name="heart-outline"/></Pressable>
    ),
  });},[props.navigation, station.city.name, station.addressStreet, isFavourite, currentContext.theme.colors.primary, toggleFavourite]);
  const toggleFavourite = React.useCallback(async () => {
    if(favourites.includes(station.id)) {
      const index = favourites.indexOf(station.id);
      if (index > -1) {
        favourites.splice(index, 1);
        AsyncStorage.setItem(FAVOURITESKEY, JSON.stringify(favourites));
        setIsFavourite(false);
        setFavourites(favourites);
      }
    } else {
      favourites.push(station.id);
      AsyncStorage.setItem(FAVOURITESKEY, JSON.stringify(favourites));
      setIsFavourite(true);
      setFavourites(favourites);
    }
  },[station.id, favourites]);
  React.useEffect(() => { 
    fetchData.current = async () => {
      try {
        let sensorsData = await fetch(globals.proxy+globals.sensors+'/'+station.id);
        sensorsData = await sensorsData.json();
        setSensorsData(sensorsData);
        for(let i = 0; i < sensorsData.length; i++) {
          if(sensorsData[i].param.paramCode == 'PM10') sensorsByKey.pm10 = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'PM2.5') sensorsByKey.pm25 = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'SO2') sensorsByKey.so2 = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'NO2') sensorsByKey.no2 = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'O3') sensorsByKey.o3 = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'CO') sensorsByKey.co = sensorsData[i].id;
          else if(sensorsData[i].param.paramCode == 'C6H6') sensorsByKey.c6h6 = sensorsData[i].id;
        }
        setSensorsByKey(sensorsByKey);
        console.log('fetching from api.gios.gov.pl: ' + sensorsData.length + ' sensors');
        let indexData = await fetch(globals.proxy+globals.index+'/'+station.id);
        indexData = await indexData.json();
        setIndexData(indexData);
        console.log('fetching from api.gios.gov.pl: ' + Object.keys(indexData).length + ' indexData');
      } catch (error) { console.log(error); }
    }
    if(isFocused == true) fetchData.current(); 
  }, [fetchData, isFocused, sensorsByKey, station.id]);
  React.useLayoutEffect(() => { 
    const fetchDB = async () => { 
	    let favourites = await AsyncStorage.getItem(FAVOURITESKEY); 
      favourites = favourites ? JSON.parse(favourites) : [];
      setFavourites(favourites);
      if(favourites.includes(station.id)) {setIsFavourite(true);} else {setIsFavourite(false);}
    }
    fetchDB().catch(console.error);
  },[station.id]);
  return (
    <>
      <View style={styles.container}>
      <View style={styles.scrollArea}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea_contentContainerStyle}>
        <SectionHeader>{station.city.name}, {station.addressStreet}</SectionHeader><Text>{station.distance} km from here</Text>
        <View style={styles.mapFrameContainer}><MapFrame style={styles.mapFrame} lat={props.route.params.item.gegrLat} lon={props.route.params.item.gegrLon}></MapFrame></View>
        <IndicatorMainIndex date={indexData.stSourceDataDate} value={indexData.stIndexLevel}/>
        <IndicatorSensorIndex name='pm10' sensor={sensorsByKey.pm10} date={indexData.pm10SourceDataDate} value={indexData.pm10IndexLevel}/>
        <IndicatorSensorIndex name='pm25' sensor={sensorsByKey.pm25} date={indexData.pm25SourceDataDate} value={indexData.pm25IndexLevel}/>
        <IndicatorSensorIndex name='so2' sensor={sensorsByKey.so2} date={indexData.so2SourceDataDate} value={indexData.so2IndexLevel}/>
        <IndicatorSensorIndex name='no2' sensor={sensorsByKey.no2} date={indexData.no2SourceDataDate} value={indexData.no2IndexLevel}/>
        <IndicatorSensorIndex name='o3' sensor={sensorsByKey.o3} date={indexData.o3SourceDataDate} value={indexData.o3IndexLevel}/>
        <IndicatorSensorIndex name='co' sensor={sensorsByKey.co} date={null} value={null}/>
        <IndicatorSensorIndex name='c6h6' sensor={sensorsByKey.c6h6} date={null} value={null}/>
      </ScrollView>
      </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  scrollArea: {
    alignSelf: "stretch",
    flex: 1,
    padding:10,
  },
  scrollArea_contentContainerStyle: {
    padding: 0,
  },
  mapFrameContainer: {
    height: 300,
    borderRadius: 0,
    padding:0,
    alignSelf: "stretch",
    marginTop: 10,
    marginBottom: 10,
    //position:'absolute',
    width:'100%',
  },
  mapFrame: {
    flex: 1,
    padding:0,
  },
  icon: {fontSize: 20,width:20,height:20, marginRight:15},
})
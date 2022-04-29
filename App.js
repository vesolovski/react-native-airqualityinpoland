import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Animated, Easing, Pressable, StatusBar, StyleSheet, Vibration, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useRoute, useIsFocused } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Constants from 'expo-constants';
import * as Location from "expo-location";
import * as Font from "expo-font"; 
import Stations from "./src/screens/Stations";
import Station from "./src/screens/Station";
import Settings from "./src/screens/Settings";
import Lottie from './src/components/Lottie';
import {Fonts, Themes, Context} from "./src/components/Context";
import {Text} from './src/components/Components';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SETTINGSKEY = 'settings';
export default function App() {
  const [settings, setSettings] = React.useState({});
  const [location, setLocation] = React.useState(null);
  const[currentContext,setCurrentContext]=React.useState({theme:Themes.DefaultTheme,fonts:null,setContextTheme});
  const[fontsLoaded,setFontsLoaded]=React.useState(false);
  const duration = 400;
  const setContextTheme = React.useRef(()=>{}).current;
  setContextTheme.current = async(theme)=>{setCurrentContext((prev)=>({theme:theme=='dark'?Themes.DarkTheme:Themes.DefaultTheme,fonts:prev.fonts,setContextTheme}));}
	const tabsAnimated = useRef(new Animated.Value(0)).current;
  const tabsTranslateXProgress = tabsAnimated.interpolate({inputRange:[0,1],outputRange:[0,0]});
  const tabsScaleProgress = tabsAnimated.interpolate({inputRange:[0,1],outputRange:[1,1]});
  const tabsOpacityProgress = tabsAnimated.interpolate({inputRange:[0,1],outputRange:[0,1]});
  const tabsFadeIn = useCallback(()=>{Animated.timing(tabsAnimated,{easing:Easing.linear,toValue:1,duration:duration,useNativeDriver:false}).start();},[tabsAnimated]);
  const tabsFadeOut = useCallback((navigate)=>{Animated.timing(tabsAnimated,{easing: Easing.linear,toValue:0,duration:1,useNativeDriver:false}).start(({finished})=>{if(finished){navigate();}});},[tabsAnimated]);
  const listeners = ({navigation,route})=>({
    tabPress:e => { Vibration.vibrate(60); if(navigation.isFocused() == false) { e.preventDefault(); tabsFadeOut(()=>navigation.navigate(route.name));}},
    focus:e => { tabsFadeIn() },
  });
  React.useEffect(() => {
    const fetchDB = async () => { 
      let settings = await AsyncStorage.getItem(SETTINGSKEY); settings = settings ? JSON.parse(settings) : {};
      if(settings.theme == 'dark') {setContextTheme.current(settings.theme);} else {settings.theme == 'default';setContextTheme.current(settings.theme);}
      setSettings(settings); 
    }
    fetchDB().catch(console.error);
    return true;
  },[setContextTheme]);
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { return; }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  },[]);
  React.useEffect(()=>{ 
    const load = async () => {
      await Font.loadAsync( Fonts.sources ); setFontsLoaded(true);
    }; load();
    currentContext.fonts = Fonts.names;
  },[currentContext]);  if(!fontsLoaded) return null;
  return (
    <Context.Provider value={currentContext}>
    <SafeAreaProvider>
      <NavigationContainer theme={currentContext.theme}>
        <StatusBar translucent={true} backgroundColor="transparent" barStyle={currentContext.theme===Themes.DarkTheme ? 'light-content' : 'dark-content'}/>
        <Tab.Navigator initialRouteName="Favourites" headerMode="float" sceneContainerStyle={{backgroundColor: currentContext.theme.colors.background}}
          screenOptions={tabScreenOptions(currentContext)} tabBarOptions={tabBarOptions(currentContext)}>
          <Tab.Screen name="Favourites" options={({route,navigation})=>({cardStyle: {backgroundColor: 'transparent'}, tabBarLabel:'Favourites', tabBarIcon:({color,size})=>{return <Lottie props={{...tabBarLottie(currentContext),lottie:'heart',color:color}}/>;}})} listeners={listeners}>
            {(props)=>(
              <Animated.View style={stackAnimatedView(tabsOpacityProgress,tabsScaleProgress,tabsTranslateXProgress)}>
                <Stack.Navigator sceneContainerStyle={{backgroundColor:'transparent'}} screenOptions={stackScreenOptions(currentContext)}>
                  <Stack.Screen name="Favourites.Home">{(props)=>(
                      <Stations {...props} location={location}/>
                  )}</Stack.Screen>
                  <Stack.Screen name="Favourites.Station">{(props)=>(<Station {...props}/>)}</Stack.Screen>
                </Stack.Navigator>
              </Animated.View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Near" options={({route,navigation})=>({cardStyle: {backgroundColor: 'transparent'}, tabBarLabel:'Near', tabBarIcon:({color,size})=>{return <Lottie props={{...tabBarLottie(currentContext),lottie:'gps',color:color}}/>;}})} listeners={listeners}>
            {(props)=>(
              <Animated.View style={stackAnimatedView(tabsOpacityProgress,tabsScaleProgress,tabsTranslateXProgress)}>
                <Stack.Navigator sceneContainerStyle={{backgroundColor:'transparent'}} screenOptions={stackScreenOptions(currentContext)}>
                  <Stack.Screen name="Near.Home">{(props)=>(
                      <Stations {...props} location={location}/>
                  )}</Stack.Screen>
                  <Stack.Screen name="Near.Station">{(props)=>(<Station {...props}/>)}</Stack.Screen>
                </Stack.Navigator>
              </Animated.View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Search" options={({route,navigation})=>({cardStyle: {backgroundColor: 'transparent'}, tabBarLabel:'Search', tabBarIcon:({color,size})=>{return <Lottie props={{...tabBarLottie(currentContext),lottie:'search',color:color}}/>;}})} listeners={listeners}>
            {(props)=>(
              <Animated.View style={stackAnimatedView(tabsOpacityProgress,tabsScaleProgress,tabsTranslateXProgress)}>
                <Stack.Navigator sceneContainerStyle={{backgroundColor:'transparent'}} screenOptions={stackScreenOptions(currentContext)}>
                  <Stack.Screen name="Search.Home">{(props)=>(
                      <Stations {...props} location={location}/>
                  )}</Stack.Screen>
                  <Stack.Screen name="Search.Station">{(props)=>(<Station {...props}/>)}</Stack.Screen>
                </Stack.Navigator>
              </Animated.View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Settings" options={({route,navigation})=>({cardStyle: {backgroundColor: 'transparent'}, tabBarLabel:'Settings', tabBarIcon:({color,size})=>{return <Lottie props={{lottie:'settings',color:color,...tabBarLottie(currentContext)}}/>;}})} listeners={listeners}>
            {(props)=>(
              <Animated.View style={stackAnimatedView(tabsOpacityProgress,tabsScaleProgress,tabsTranslateXProgress)}>
                <Stack.Navigator sceneContainerStyle={{backgroundColor:'transparent'}} screenOptions={stackScreenOptions(currentContext)}>
                  <Stack.Screen name="Settings.Home">{(props)=>(
                    <Settings {...props}/>
                  )}</Stack.Screen>
                  <Stack.Screen name="Settings.Station">{(props)=>(<Station {...props}/>)}</Stack.Screen>
                </Stack.Navigator>
              </Animated.View>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </Context.Provider>);
}
const tabScreenOptions = (currentContext) => ({
  cardStyle: { backgroundColor: "transparent" },
  tabBarLabelPosition: "below-icon",
  headerShown: false,
  headerStyle: { backgroundColor: "transparent" },
  headerTintColor: "transparent",
  headerTitleStyle: {fontFamily: currentContext.fonts.light},
  lazy: true,
  tabBarStyle: {
    height: 60,
    paddingBottom: 12,
    borderTopWidth: 0,
    borderTopColor: currentContext.theme.colors.border,
    //backgroundColor: currentContext.theme.colors.accent,
    //shadowOpacity: 0,
    elevation: 5,
  },
  tabBarIconStyle: { marginBottom: 0 },
  tabBarPosition: "top"
});
const tabBarOptions = (currentContext) => ({
  showIcon: true,
  activeTintColor: currentContext.theme.colors.primary,
  inactiveTintColor: "#AAAAAA",
  labelStyle: { textAlign: "center", fontFamily: currentContext.fonts.light },
  indicatorStyle: {}
});
const tabBarLottie = (currentContext) => ({
  size:20,
  autoplay:false,
  loop:false
})
const stackScreenOptions = (currentContext) => ({
  headerTitleAlign:'center',
  //autoCapitalize:'words',
  //orientation:'landscape',
  cardOverlayEnabled: true,
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 200,
        easing: Easing.linear,
        timing: Animated.timing,
        useNativeDriver: false
      }
    },
    close: {
      animation: "timing",
      config: {
        duration: 200,
        easing: Easing.linear,
        timing: Animated.timing,
        useNativeDriver: false
      }
    }
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({ current, next, inverted, layouts: { screen } }) => {
    const ranges = {
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp"
    };
    const stackAnimated = Animated.add(
      current.progress.interpolate(ranges),
      next ? Animated.add(next.progress.interpolate(ranges), 1) : 0
    );
    const stackTranslateXProgress = Animated.multiply(
      stackAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [screen.width, 0, 0, -screen.width],
        extrapolate: "clamp"
      }),
      inverted
    );
    const stackOpacityProgress = Animated.multiply(
      stackAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 1, 1, 0],
        extrapolate: "clamp"
      }),
      inverted
    );
    return {
      cardStyle: { transform: [{ translateX: stackTranslateXProgress }] }
    };
  },
  cardStyle: { backgroundColor: 'transparent' },
  headerStyle: {
    borderBottomWidth: 0,
    borderBottomColor: currentContext.theme.colors.border,
    //backgroundColor: currentContext.theme.colors.accent,
    //shadowOpacity: 0,
    elevation: 5,
  },
  headerTitleStyle: {fontFamily: currentContext.fonts.light, color:currentContext.theme.colors.primary},
  presentation: "card"
});
const stackAnimatedView = (
  tabsOpacityProgress,
  tabsScaleProgress,
  tabsTranslateXProgress
) => ({
  flex: 1,
  opacity: tabsOpacityProgress,
  transform: [
    { scale: tabsScaleProgress },
    { translateX: tabsTranslateXProgress }
  ]
});

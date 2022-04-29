import React from 'react';
import { StyleSheet, StatusBar, Text  } from 'react-native';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
const Fonts = { 
  sources: {
    LatoThin: require("../assets/fonts/lato-thin.ttf"), 
    LatoThinItalic: require("../assets/fonts/lato-thin-italic.ttf"),
    LatoLight: require("../assets/fonts/lato-light.ttf"), 
    LatoLightItalic: require("../assets/fonts/lato-light-italic.ttf"),
    LatoRegular: require("../assets/fonts/lato-regular.ttf"), 
    LatoRegularItalic: require("../assets/fonts/lato-regular-italic.ttf"),
    LatoBold: require("../assets/fonts/lato-bold.ttf"), 
    LatoBoldItalic: require("../assets/fonts/lato-bold-italic.ttf"),
    LatoBlack: require("../assets/fonts/lato-black.ttf"), 
    LatoBlackItalic: require("../assets/fonts/lato-black-italic.ttf"),
  },
  names: {
    thin:'LatoThin',
    light:'LatoLight',
    regular:'LatoRegular',
    bold:'LatoBold',
    black:'LatoBlack',
    thinitalic:'LatoThinItalic',
    lightitalic:'LatoLightItalic',
    regularitalic:'LatoRegularItalic',
    bolditalic:'LatoBoldItalic',
    blackitalic:'LatoBlackItalic',
  }
};
export const SomeComponent = () => {
  const key = React.useState(10);
  return ({style:'niewiadomo'});
}
const Themes = {
  DefaultTheme: {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary:"#123574",
      accent:"#FFFFFF",
      background:"rgb(240, 245, 252)",
      surface:"#ffffff",
      error:"#B00020",
      text:"rgb(28, 28, 30)",
      onSurface:"#000000",
      disabled:"rgba(0, 0, 0, 0.26)",
      placeholder:"rgba(0, 0, 0, 0.54)",
      backdrop:"rgba(0, 0, 0, 0.5)",
      notification:"rgb(255, 59, 48)",
      card:"rgb(255, 255, 255)",
      border:"rgb(216, 216, 216)"
    },
  },
  DarkTheme: {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary:"#5991DD",
      accent:"#1e1e1e",
      background:"rgb(40, 40, 40)",
      surface:"#121212",
      error:"#CF6679",
      text:"rgb(229, 229, 231)",
      onSurface:"#FFFFFF",
      disabled:"rgba(255, 255, 255, 0.38)",
      placeholder:"rgba(255, 255, 255, 0.54)",
      backdrop:"rgba(0, 0, 0, 0.5)",
      notification:"rgb(255, 69, 58)",
      card:"rgb(18, 18, 18)",
      border:"rgb(100, 100, 100)"
    },
  }
}
const Context = React.createContext();
export {Fonts, Themes, Context};
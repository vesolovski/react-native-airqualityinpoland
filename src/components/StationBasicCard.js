import React from 'react';
import {Pressable, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from "react-native-vector-icons/Entypo";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Context} from '../components/Context';
import {Paragraph, Text} from '../components/Components';
import {cleanup, normalize, distance, globals} from '../components/Helpers';
const FAVOURITESKEY = 'favourites';
export default (props) => {
  const currentContext = React.useContext(Context);
  const [routerTab, setRouterTab] = React.useState(null);
  const [favourites, setFavourites] = React.useState([]);
  const [isFavourite, setIsFavourite] = React.useState(null);
  const swipeableRef = React.useRef(null);
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    pressable: {marginBottom:5, backgroundColor:currentContext.theme.colors.accent,borderRadius:5,padding:0},
    icon: {fontSize: 20,width:20,height:20,color:currentContext.theme.colors.primary}
    });
  React.useEffect(()=>{ let routerTab = props.route.name.split('.'); routerTab = routerTab[0]; setRouterTab(routerTab); }, [props.route.name]);
  React.useEffect(() => { 
    setIsFavourite(props.favourite);
  }, [props.favourite]);
  const SwipeFromRightActions = () => {
    return (
      <View style={{ borderTopRightRadius:5, borderBottomRightRadius:5, paddingHorizontal:10, backgroundColor: currentContext.theme.colors.primary, justifyContent: 'center', alignItems: 'flex-start'}} >
        <MaterialCommunityIconsIcon style={[styles.icon,{color:'white'}]} name="heart"/>
      </View>
    );
  };
  const SwipeFromLeftActions = () => {
    return (
      <View style={{ borderTopLeftRadius:5, borderBottomLeftRadius:5, paddingHorizontal:10, backgroundColor: currentContext.theme.colors.error, justifyContent: 'center', alignItems: 'flex-end'}} >
        <MaterialCommunityIconsIcon style={[styles.icon,{color:'white'}]} name="heart-off-outline"/>
      </View>
    );
  };
  const swipeFromRightOpen = () => { 
    const addToFavouritesStorage = async () => {
      swipeableRef.current.close();
      let favourites = await AsyncStorage.getItem(FAVOURITESKEY);
      favourites = favourites ? JSON.parse(favourites) : [];
      const index = favourites.indexOf(props.item.id);
      if (index == -1) {
        favourites.push(props.item.id);
        AsyncStorage.setItem(FAVOURITESKEY, JSON.stringify(favourites));
        setIsFavourite(true);
      }
      props.forceStorageFetchCallback();
    }
    addToFavouritesStorage().catch(console.error);
  };
  const swipeFromLeftOpen = () => { 
    const removeFromFavouritesStorage = async () => { 
      swipeableRef.current.close();
      let favourites = await AsyncStorage.getItem(FAVOURITESKEY);
      favourites = favourites ? JSON.parse(favourites) : [];
      const index = favourites.indexOf(props.item.id);
      if (index > -1) {
        favourites.splice(index, 1);
        AsyncStorage.setItem(FAVOURITESKEY, JSON.stringify(favourites));
        setIsFavourite(false);
      }
      props.forceStorageFetchCallback();
    }
    removeFromFavouritesStorage().catch(console.error);
  };

  return (
    <Pressable onPress={() => navigation.navigate(routerTab,{screen: routerTab + '.Station', params:{item:props.item}})} style={[styles.pressable]}>
      <Swipeable ref={swipeableRef} renderLeftActions={SwipeFromLeftActions} renderRightActions={SwipeFromRightActions} onSwipeableRightOpen={swipeFromRightOpen} onSwipeableLeftOpen={swipeFromLeftOpen} >
        <View style={{borderRadius:5,backgroundColor:currentContext.theme.colors.accent,padding:10,flex:1,flexDirection:'row'}}>
          <View style={{flex:1}}>
            <Text>{props.item.city.name}, {props.item.addressStreet}</Text>
            {props.item.distance ? <Text style={{fontSize:9}}>{props.item.distance} km from here</Text> : null }
          </View>
          <View style={{alignItems:'flex-end', width:25, paddingTop:3}}>
            {isFavourite ? <MaterialCommunityIconsIcon style={styles.icon} name="heart"/> : null}
          </View>
        </View>
      </Swipeable>
    </Pressable>
  );
}
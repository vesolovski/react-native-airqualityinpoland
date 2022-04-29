import React from 'react';
import {Animated,Easing,Platform,StatusBar,Text} from 'react-native';
import {NavigationContainer, useRoute, useIsFocused } from '@react-navigation/native';
import LottieView from './LottieLibrary';
const lotties = {
home: {url:'https://assets3.lottiefiles.com/packages/lf20_TYZsbM.json',keypaths:[{keypath:"Home Outlines 3"}],start:0,stop:1,base:0.99,duration:1000},
settings:{url:'https://assets9.lottiefiles.com/packages/lf20_TLvONX.json',keypaths:[{keypath:"settings Outlines"}],start:0.05,stop:1,base:0.5,duration:1000},
profile:{url:'https://assets3.lottiefiles.com/packages/lf20_jX856c.json',keypaths:[{keypath:"user Outlines"},{keypath:"user Outlines 2"}],start:0.2,stop:1,base:0.9,duration:1000},
search:{url:'https://assets1.lottiefiles.com/private_files/lf30_mjhcquiz.json',keypaths:[{keypath:"Layer 2 Outlines"},{keypath:"Layer 3 Outlines"}],start:0,stop:0.5,base:0.5,duration:1000},
meta:{url:'https://assets1.lottiefiles.com/packages/lf20_l7ae0ipa.json',keypaths:[{keypath:"line Outlines"},{keypath:"line Outlines 2"}],start:0.4,stop:1,base:0.99,duration:1000},
paperplane:{url:'https://assets7.lottiefiles.com/packages/lf20_2SQG3l.json',keypaths:[{keypath:"Shape Layer 4"}],start:0,stop:1,base:0,duration:3000},
gps:{url:'https://assets4.lottiefiles.com/packages/lf20_okngnjqj.json',keypaths:[{keypath:"Layer 3/animated-icon-set Outlines"}],start:0,stop:1,base:0.9,duration:3000},
heart:{url:'https://assets8.lottiefiles.com/packages/lf20_817ube/heart_03.json',keypaths:[{keypath:"explosion Outlines 2"},{keypath:"explosion Outlines"},{keypath:"hear Outlines"}],start:0,stop:1,base:1,duration:3000},
};
const Lottie = ({props}) => {
    let {url, keypaths, start, stop, base, duration} = lotties[props.lottie];
    const animated = React.useRef(new Animated.Value(base)).current;
    const lottieRef = React.useRef();//chyba jednak będzie zbędne
    const isFocused = useIsFocused();
    for (let i=0; i<keypaths.length; i++) { keypaths[i].color = props.color; }
    const [lottieJSON, setLottieJSON] = React.useState(null);
    React.useEffect(()=>{
      if(props.autoplay==true || isFocused==true){
      animated.setValue(start);
      Animated.timing(animated,{toValue:stop,duration:duration,/*easing:Easing.linear,*/useNativeDriver:Platform.OS=='web'?false:true}).start(() => {animated.setValue(base)});
    }},[animated,isFocused,props,start, stop, base, duration]);
    React.useEffect(() => {
      fetch(url,{method:"GET",}) .then((response)=>response.json()).then((responseData)=>{setLottieJSON(responseData);}).catch((e)=>{null})
    },[url]);
    return (lottieJSON ? 
      <LottieView 
        mylottieprops={lotties[props.lottie]}
        progress={animated}
        resizeMode="cover" 
        colorFilters={keypaths} 
        ref={lottieRef} 
        source={lottieJSON} 
        style={{height:props.size,width:props.size,position:'absolute',bottom:0,alignSelf:'center'}}/> 
      : (null));
};
export default Lottie;
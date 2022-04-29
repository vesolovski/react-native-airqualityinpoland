import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
//let lat = 50.0845; let lon = 20.0000;
export default (props) => { 
  let delta = 0.005; 
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [url, setUrl] = React.useState('');
  const [frameString, setFrameString] = React.useState('');
  const [frameDOM, setFrameDOM] = React.useState('');
  React.useEffect(()=>{
    setLatitude(parseFloat(props.lat));
    setLongitude(parseFloat(props.lon));
     let url = '';
      url += 'https://www.openstreetmap.org/export/embed.html?bbox=';
      url += (longitude-delta) + ',' + (latitude-delta) + ',' + (longitude+delta) + ',' + (latitude+delta)
      url += '&marker=' + latitude + ',' + longitude + '&layer=mapnik';
      setFrameDOM(<iframe width="100%" height="100%" frameBorder="0" style={{border:'none',margin:0,padding:0,height:"100%",overflow:"hidden"}} scrolling="no" src={url}/>);
      setFrameString(`<iframe width="100%" height="100%" frameBorder="0" style={{border:'none',margin:0,padding:0,height:"100%",overflow:"hidden"}} scrolling="no" src="${url}"/>`);
  },[delta,latitude,longitude,props.lat,props.lon]);
  return ( 
    Platform.OS === 'web' ? frameDOM 
    :
    <View style={styles.container}>
    <WebView 
      pointerEvents="none" 
      scrollEnabled={false} 
      javaScriptEnabled
      scalesPageToFit={true}
      automaticallyAdjustContentInsets={false}
      bounces={false}
      originWhitelist={['*']} 
      source={{ 
        html: frameString, //uri: url, //baseUrl:'',
      }} 
      style={{borderWidth:0,flex:1}}
    />
    </View>
);}
const styles = StyleSheet.create({container:{flex:1,borderWidth:0,flexDirection:"column"}});//
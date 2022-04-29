import React from 'react';
import {View} from 'react-native';
import {Context} from '../components/Context';
import {Text} from '../components/Components';
import {cleanup, normalize, distance, globals, colorIndicator, sensorsScale} from '../components/Helpers';
export default (props) => {
  const currentContext = React.useContext(Context);
  const [quality, setQuality] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [color, setColor] = React.useState(null);
  React.useEffect(()=>{
    if(props.value == null) { setQuality('undefined'); setTitle('No index'); setColor(currentContext.theme.colors.disabled); }
    else if(props.value.id == 0) {  setQuality('verygood'); setTitle('Very good'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 1) {  setQuality('good'); setTitle('Good'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 2) {  setQuality('moderate'); setTitle('Moderate'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 3) {  setQuality('sufficient'); setTitle('Sufficient'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 4) {  setQuality('bad'); setTitle('Bad'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 5) {  setQuality('verybad'); setTitle('Very bad'); setColor(colorIndicator[quality]?.hex); }
  },[color, quality, props.value, currentContext.theme.colors.disabled]);
  return (
    <>
      <View style={{flex:1,flexDirection:'column',alignItems:'flex-start',backgroundColor:color+'ff', borderRadius:5, padding:10,flexBasis:'auto'}}>
        <View style={{flex:1,flexBasis:'auto',alignSelf:"stretch",flexDirection:"row",justifyContent:'center'}}>
          <Text style={{color:'white',fontWeight:'bold'}}>AIR QUALITY INDEX</Text>
        </View>
        <View style={{flex:1,marginTop:10,flexBasis:'auto',alignSelf:"stretch",flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:'white'}}>{props.date?props.date:null}</Text>
        </View>
        <View style={{flex:1,marginTop:10,flexBasis:'auto',alignSelf:"stretch",alignItems:'center'}}>
          <Text style={{color:'white',fontWeight:'bold'}}>{title}</Text>
        </View>
      </View>
    </>
  );
}
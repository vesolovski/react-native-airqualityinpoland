import React from 'react';
import {View, StyleSheet } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {Context} from '../components/Context';
import {Text} from '../components/Components';
import Chart from '../components/Chart';
import SectionHeader from '../components/SectionHeader';
import {cleanup, normalize, distance, globals, colorIndicator, sensorsScale} from '../components/Helpers';
export default (props) => {
  const currentContext = React.useContext(Context);
  const isFocused = useIsFocused();
  const [quality, setQuality] = React.useState(null);
  const [qualityTitle, setQualityTitle] = React.useState('');
  const [color, setColor] = React.useState(null);
  const [title, setTitle] = React.useState(sensorsScale[props.name].title);
  const [percentage, setPercentage] = React.useState(0);
  const [sensorsMeasurements, setSensorsMeasurements] = React.useState([]);
  const [sensorsMeasurementsArray, setSensorsMeasurementsArray] = React.useState([]);
  const [lastMeasurement, setLastMeasurement] = React.useState({});
  const fetchSensorsData = React.useRef(()=>{}).current;
  React.useEffect(()=>{
    if(props.value == null) { setQuality('undefined'); setQualityTitle('No index'); setColor(currentContext.theme.colors.disabled); }
    else if(props.value.id == 0) {  setQuality('verygood'); setQualityTitle('Very good'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 1) {  setQuality('good'); setQualityTitle('Good'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 2) {  setQuality('moderate'); setQualityTitle('Moderate'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 3) {  setQuality('sufficient'); setQualityTitle('Sufficient'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 4) {  setQuality('bad'); setQualityTitle('Bad'); setColor(colorIndicator[quality]?.hex); }
    else if(props.value.id == 5) {  setQuality('verybad'); setQualityTitle('Very bad'); setColor(colorIndicator[quality]?.hex); }
    if(lastMeasurement.value) setPercentage(Math.round(100*parseFloat(lastMeasurement.value)/parseFloat(sensorsScale[props.name]['ranges'][1]))/100);
  },[props.name, lastMeasurement.value, color, quality, props.value, currentContext.theme.colors.disabled]);
  React.useEffect(() => { 
    fetchSensorsData.current = async () => {
      try {
        if(props.sensor) {
          let sensorsMeasurements = await fetch(globals.proxy+globals.data+'/'+props.sensor);
          sensorsMeasurements = await sensorsMeasurements.json();
          sensorsMeasurements = sensorsMeasurements.values;
          setSensorsMeasurements(sensorsMeasurements);
          console.log('fetching from api.gios.gov.pl: ' + sensorsMeasurements.length + ' measurements');
          let lastMeasurementSet = false; let sensorsMeasurementsArray = [];
          if(sensorsMeasurements.length) {
            for(let i=0; i<sensorsMeasurements.length; i++) {
              sensorsMeasurementsArray[i] = sensorsMeasurements[i].value;
              if(lastMeasurementSet == false && sensorsMeasurements[i].value != null) {
                let value = sensorsMeasurements[i].value; value = Math.round(100*value)/100;
                setLastMeasurement({value:parseFloat(value), date:sensorsMeasurements[i].date});
                lastMeasurementSet = true;
              }
            }
            setSensorsMeasurementsArray(sensorsMeasurementsArray);
          }
        }
      } catch (error) { console.log(error); }
    }
    if(isFocused == true && props.sensor) fetchSensorsData.current();
  }, [isFocused, fetchSensorsData, props.sensor]);
  return (
    <>
    <SectionHeader>{props.name.replace('pm25','pm2.5').toUpperCase()}</SectionHeader>
    <View style={{flexBasis:'auto',alignSelf:"stretch",flex:1,flexDirection:"column"}}>
      <View style={{...props.style, position:'absolute',flexBasis:'auto',alignSelf:"stretch",flex:1,flexDirection:"row",padding:0,width:'100%',height:90,borderRadius:5,overflow:'hidden'}}>
        {percentage ? 
          <>
            {percentage <= 1 ?
            <>
              <View style={{backgroundColor: color+'ff', flex: percentage, alignSelf: "stretch"}}></View>
              <View style={{backgroundColor: color+'99', flex: (1-percentage), alignSelf: "stretch"}}></View>
            </>
            :
            <>
              <View style={{backgroundColor: color+'99', flex: 1, alignSelf: "stretch"}}></View>
              <View style={{backgroundColor: color+'ff', flex: (percentage-1), alignSelf: "stretch"}}></View>
            </>
            }
          </>
          :
          <View style={{backgroundColor: color+'ff', flex: 1, alignSelf: "stretch"}}></View>
        }
      </View>
      <View style={{marginTop:10,paddingHorizontal:10}}>
        <View style={{flexBasis:'auto',alignSelf:"stretch",flex:1,flexDirection:"row",overflow:'hidden',justifyContent:'space-between'}}>
          <View style={{flex:1,alignItems:'center',alignSelf: "stretch",justifyContent:'center'}}><Text style={{color:'white',fontWeight:'bold'}}>{props.name.replace('pm25','pm2.5').toUpperCase()} ({title})</Text></View>
        </View>
      </View>
      <View style={{marginTop:10, paddingHorizontal:10, flexBasis:'auto',alignSelf:"stretch",flex:1,flexDirection:"row",overflow:'hidden',justifyContent:'space-between'}}>
      { lastMeasurement.value ?
        <>
        <View style={{alignSelf: "stretch"}}><Text style={{color:'white'}}>{lastMeasurement.date}</Text></View>
        <View style={{alignSelf: "stretch"}}>
          <Text style={{color:'white'}}>{lastMeasurement.value}&micro;g/m&sup3;
          {percentage ?
            <> ({Math.round(100*percentage)} %)</>
          : 
            null
          }
          </Text>
        </View>
        </>
      :
        <>
        <View style={{alignSelf: "stretch"}}><Text style={{color:'white'}}>&nbsp;</Text></View>
        <View style={{alignSelf: "stretch"}}><Text style={{color:'white'}}>&nbsp;</Text></View>
        </>
      }
      </View>
      <View style={{marginTop:10, marginBottom:10, flexBasis:'auto',alignSelf:"stretch",flex:1,flexDirection:"row",overflow:'hidden',justifyContent:'space-between'}}>
        <View style={{flex:1,alignItems:'center',alignSelf: "stretch",justifyContent:'center'}}><Text style={{color:'white',fontWeight:'bold'}}>{qualityTitle}</Text></View>
      </View>
    </View>
    { sensorsMeasurementsArray.length ?
      <View style={styles.chartContainer}><Chart style={styles.chart} name={props.name} data={sensorsMeasurementsArray}></Chart></View>
    : 
      null 
    }
    </>
  );
}
const styles = StyleSheet.create({
  chartContainer: {
    marginHorizontal:0,
    marginTop: 10,
    height: 150,
    borderRadius: 5,
    overflow:'hidden',
    alignSelf: "stretch",
  },
  chart: {
    borderRadius: 5,
    flex: 1,
  },
});
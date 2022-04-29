import React from 'react'
import { AreaChart, LineChart } from 'react-native-svg-charts'
import { View } from 'react-native'
import { Circle, G, Line, Text } from 'react-native-svg'
import * as shape from 'd3-shape'
import {Context} from '../components/Context';
import {cleanup, normalize, distance, globals, colorIndicator, sensorsScale} from '../components/Helpers';
let fontSize = 12;
let displacementdown = 12;
let displacementup = 4;
export default (props) => {
  const currentContext = React.useContext(Context);
  const [data, setData] = React.useState(props.data);
  const [ranges, setRanges] = React.useState(sensorsScale[props.name].ranges);
  let colors = [colorIndicator.verygood.hex, colorIndicator.good.hex, colorIndicator.moderate.hex, colorIndicator.sufficient.hex, colorIndicator.bad.hex, colorIndicator.verybad.hex, currentContext.theme.colors.primary];
  function locate (value) {
    if(ranges.length) {
      if (value <= ranges[0]) return 0
      else if (value <= ranges[1]) return 1
      else if (value <= ranges[2]) return 2
      else if (value <= ranges[3]) return 3
      else if (value <= ranges[4]) return 4
      else if (value > ranges[4]) return 5
    } else return 6;
  }
  const Decorator = ({ x, y, data }) => { return data.map((value, index) => (
    value!=null ? <Circle key={index} cx={x(index)} cy={y(value)} r={2} stroke={colors[locate(value)]} fill={colors[locate(value)]+'77'}/> : null
  ))}
  const CustomGrid = ({ x, y, data, ticks }) => ( <G>
    <Text fill={colors[0]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[0])+displacementdown}>&le; {ranges[0]} &#181;g/m&sup3;</Text>
    <Text fill={colors[0]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[0])+displacementdown}>very good</Text>
    { [ranges[0]].map(tick => (<Line key={tick} stroke={colors[0]+'77'} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)}/>)) }
    <Text fill={colors[1]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[1])+displacementdown}>&le; {ranges[1]} &#181;g/m&sup3;</Text>
    <Text fill={colors[1]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[1])+displacementdown}>good</Text>
    { [ranges[1]].map(tick => (<Line key={tick} stroke={colors[1]+'77'} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)}/>)) }
    <Text fill={colors[2]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[2])+displacementdown}>moderate</Text>
    <Text fill={colors[2]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[2])+displacementdown}>&le; {ranges[2]} &#181;g/m&sup3;</Text>
    { [ranges[2]].map(tick => (<Line key={tick} stroke={colors[2]+'77'} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)}/>)) }
    <Text fill={colors[3]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[3])+displacementdown}>&le; {ranges[3]} &#181;g/m&sup3;</Text>
    <Text fill={colors[3]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[3])+displacementdown}>sufficient</Text>
    { [ranges[3]].map(tick => (<Line key={tick} stroke={colors[3]+'55'} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)}/>)) }
    <Text fill={colors[4]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[4])+displacementdown}>&le; {ranges[4]} &#181;g/m&sup3;</Text>
    <Text fill={colors[4]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[4])+displacementdown}>bad</Text>
    { [ranges[4]].map(tick => (<Line key={tick} stroke={colors[4]+'33'} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)}/>)) }
    <Text fill={colors[5]} fontWeight='100' fontSize={fontSize} textAnchor="start" x="1%" y={y(ranges[4])-displacementup}>&gt; {ranges[4]} &#181;g/m&sup3;</Text>
    <Text fill={colors[5]} fontWeight='100' fontSize={fontSize} textAnchor="end" x="99%" y={y(ranges[4])-displacementup}>very bad</Text>
    { data.map((_, index) => (null)) } 
    </G>
  )

  return (
    <View style={{flex:1,flexDirection:"column"}}>
    {ranges.length ?     
      <AreaChart curve={shape.curveNatural} svg={{fill:currentContext.theme.colors.primary+'22', stroke:currentContext.theme.colors.primary+'ff'}} 
        style={{flex:1, backgroundColor:currentContext.theme.colors.accent+'ff'}} contentInset={{top:5,bottom:5,left:0,right:0}} 
        data={[...data].reverse() /* bo inaczej referencja w drzewie i reverse zmienia mi tablicę w wyższej hierarchii */ } yMin={0} yMax={Math.round(1.1*Math.max(Math.max(...data), ranges[4]+10))}>
      <CustomGrid belowChart={true}/> 
      <Decorator/>
      </AreaChart>
    :
      <AreaChart curve={shape.curveNatural} svg={{fill:currentContext.theme.colors.primary+'22', stroke:currentContext.theme.colors.primary+'ff'}} 
        style={{flex:1, backgroundColor:currentContext.theme.colors.accent+'ff'}} contentInset={{top:5,bottom:5,left:0,right:0}} 
        data={data} yMin={0} yMax={Math.round(1.1*Math.max(Math.max(...data)))}>
      <Decorator/>
      </AreaChart>
    }
    </View>
  )
}
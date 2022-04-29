import React from 'react';
import {Text} from 'react-native';
import {Context} from '../components/Context';
const MyText = (props) => {
  const currentContext = React.useContext(Context);
  return (
    <Text {...props} style={[{fontFamily:currentContext.fonts.light,color:currentContext.theme.colors.text},props.style]}>{props.children}</Text>
  )
}
const MyParagraph = (props) => {
  const currentContext = React.useContext(Context);
  return (
    <MyText {...props} style={[props.style,{fontFamily:currentContext.fonts.thin}]}>{props.children}</MyText>
  )
}
export {MyParagraph as Paragraph, MyText as Text};
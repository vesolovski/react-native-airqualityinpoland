import React from 'react';
import {Context} from '../components/Context';
import {Text} from '../components/Components';
export default (props) => {
  const currentContext = React.useContext(Context);
  return (
    <Text style={{fontSize:20, marginBottom:2, marginTop:5}}>{props.children}</Text>
  );
}
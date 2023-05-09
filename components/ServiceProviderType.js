import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Icon } from "react-native-elements";



const ServiceCard = ({ iconName, serviceType, iconType, style, iconSize, fontSize }) => {
  return (
    <TouchableOpacity style={[tw`bg-purple-50 rounded-xl items-center justify-center shadow-sm`, style]}>
      <Icon
      type={iconType}
      name={iconName} 
      size={iconSize} 
      color="#000"/>
      <Text style={tw`${fontSize} font-bold `}>{serviceType}</Text>
    </TouchableOpacity>
  );
};

export default ServiceCard;

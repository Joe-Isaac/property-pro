import { View, Text } from 'react-native'
import React from 'react'
import { Icon, Image } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

const Providers = ({data}) => {
    const navigation = useNavigation();
    

  return (
    <TouchableOpacity
    onPress={()=>navigation.navigate("ProviderScreen", {"data":data})}
    style={tw`flex justify-center items-center bg-gray-50 px-2 shadow-sm rounded-lg`}>
        {/* Contents: Image, Name, Category of service, Rating, range of pricing */}
        <View style={tw`py-1`}>
            <Image
            source={{uri:data?.data?.imageUrl}}
            style={{
                width: 250,
                height: 110,
                borderRadius: 20
            }}
            />
        </View>
        <View style={tw` flex justify-center items-center`}>
            <Text style={tw`text-sm px-1 bg-purple-100 px-4 rounded-sm font-bold`}>{data?.role}</Text>
        </View>
        <View>
            <Text style={tw`text-base font-bold`}>{data?.data?.name}</Text>
        </View>
        <View style={tw`flex flex-row flex flex-row justify-center items-center`}>
            <Icon name="star" type='material' size={12} color={'yellow'}/>
            <Text style={tw`text-base px-1`}>4.9 (1.2k reviews)</Text>
        </View>
        <View style={tw`flex flex-row justify-center items-center`}>
            <Icon name='money' type='font-awesome' size={15} color={"gray"}/>
            <Text style={tw`text-base px-1`}>{}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default Providers
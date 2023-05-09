import { ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon, Image } from 'react-native-elements'

const ProviderProfile = ({setIsVisible, profileData}) => {
  return (
        <View style={[tw`rounded-bl-3xl w-full bg-purple-500 px-2`, {
    }]}>
        {/* The header component */}
        <View style={[tw`w-full my-2`, styles.betweenRow]}>
            {/* The left section of the header on top of profile, contains avatar, name and location */}
            <View style={[tw`w-2/5 p-1`, styles.betweenRow]}>
                {/* Avatar */}
                <View style={[tw``]}>
                    <Image source={{uri: profileData?.data?.imageUrl}} style={tw`w-20 h-20 rounded-full`}/>
                </View>
                {/* The User's name, and location, styled in columns*/}
                <View style={[tw`pl-1`, styles.firstCol]}>
                {/* User name */}
                <Text style={styles.typicalText}>{profileData?.data?.name}</Text>
                </View>
            </View>
            {/* The right side of the same header */}
            <View style={[tw`w-1/5`, styles.evenlyRow]}>
                {/* Button to show options or navigation, whatever the user needs */}
                <View>
                    <Icon name="more-vert" type='material' color={"white"} onPress={()=>setIsVisible(true)} size={24}/>
                </View>
                
            </View>
        </View>

        {/* The middle quick info screen, shows rating, day & time open & price range */}
        <View style={[tw`w-full my-2`, styles.evenlyRow]}>
            {/* This shows the icon and text */}
            <View style={[styles.evenlyRow, tw`w-1/6`]}>
                <Icon name="star" type='material' size={23} color={'white'}/>
                <Text style={[styles.baseText]}>4.2</Text>
            </View>
            {/* Day and Time open */}
            <View style={[tw``]}>
                {/* DAY */}
                <Text style={[styles.baseText]}>{profileData?.data?.daysOpen}</Text>
                {/* Time */}
                <Text style={[styles.baseText]}>{profileData?.data?.timeOpen}</Text>
            </View>
            {/* Usual price range */}
            <View style={[tw``]}>
                <Text style={[styles.baseText]}>{profileData?.data?.priceRange}</Text>
            </View>
        </View>

        {/* Penultimate View, containing summary info, summary of services, contacts, and social icons */}
        <View style={[tw`w-3/4`, styles.firstCol]}>
            {/* Small description of services */}
            <View style={tw`w-full `}>
            {profileData?.data?.services.map((x, index) => (
                <Text key={index} style={[styles.baseText]}>
                {x.name}
                </Text>
            ))}
            </View>
            {/* socials, whose width extends across the screen */}
            <View style={[tw`w-1/2 py-3`,styles.betweenRow]}>
            {/* email */}
                <View>
                    {/* Typical layout would be an icon preceeds it's text, which will be decided later whether it becomes a hyperlink */}
                    <Icon name='email' type='material' size={32} color={"#fff"}/>
                </View>
                {/* Facebook maybe */}
                <View>
                {/* Typical layout would be an icon preceeds it's text, which will be decided later whether it becomes a hyperlink */}
                <Icon name='facebook' type='fontawesome' size={32} color={"#fff"}/>
                </View>
                 {/* Instagram maybe */}
                 <View>
                {/* Typical layout would be an icon preceeds it's text, which will be decided later whether it becomes a hyperlink */}
                <Icon name='phone' type='fontawesome' size={32} color={"#fff"}/>
                </View>
            </View>
        </View>
        </View>
    // </ImageBackground>
  )
}

export default ProviderProfile

const styles = StyleSheet.create({
    evenlyRow: [tw`flex-row items-center justify-evenly`],
    centerRow: [tw`flex-row items-center justify-center`],
    betweenRow: [tw`flex-row items-center justify-between`],
    firstCol: [tw`flex-col items-start justify-center`],
    typicalText: [tw`font-bold text-lg px-1 text-white`],
    baseText: [tw`text-base font-bold text-white`]
})
import React from 'react'
import { Text, View, TouchableOpacity, Image, Modal, ScrollView, TextInput} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useState } from 'react';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../Firebase/firebase-config';
import Map from './Map';

const ServiceCard = ({data}) => {
    const [statusColor, setStatusColor] = useState({
        pending: '#faad14',
        inProgress: '#1677ff',
        completed: '#52c41a',
        rejected: '#f5222d'
    });
    const [providerData, setProviderData] = useState();

    useEffect(()=>{
      console.log("This is data ", data)
      getProviderData();
    }, [])

    useEffect(()=>{
      switch(data?.status){
          case 'pending':
              setCurrentStatusColor(statusColor.pending);
              break;
          case 'inProgress':
              setCurrentStatusColor(statusColor.inProgress);
              break;
          case 'completed':
              setCurrentStatusColor(statusColor.completed);
              break;
          case 'rejected':
              setCurrentStatusColor(statusColor.rejected);
              break;
      }
  }, [])

    async function getProviderData(){
      const docRef = doc(db, "users", data?.providerId)
      const docSnap = await getDoc(docRef);
      setProviderData(docSnap.data());
    }
    //The current status will change for every request.
    const [currentStatusColor, setCurrentStatusColor] = useState();
    const [isVisible, setIsVisible] = useState(false)

  
  return (
    <View style={[tw`bg-white rounded-3xl px-1 mx-2 px-2 my-1 shadow-md`,{backgroundColor: "#fff"}]}>
                <View
                  style={[
                    tw` w-full flex flex-row items-center justify-evenly rounded-3xl py-4`
                  ]}
                >
                  <View>
                   <Image
                      style={{
                        height: 45,
                        width: 45,
                        resizeMode: "contain",
                        borderRadius: 100,
                      }}
                      source={{
                        uri: providerData?.data?.imageUrl,
                      }}
                    />
                  </View>
                  <View>
                    {/* This will instead be the user's details */}
                    <Text style={tw`text-black font-bold text-xl `}>
                      {providerData?.data?.name}
                    </Text>
                    {/* <Text style={tw`text-black font-bold text-sm `}>
                      Githurai 44-45, opp nico stage
                    </Text> */}
                    <Text style={tw`text-black text-xs `}>
                      {providerData?.email}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={()=>setIsVisible(true)}>
                    <Icon name={"more-vert"} type={"material"} color="#854d0e" />
                  </TouchableOpacity>
                </View>
                      
                    {/* Below shows the issue */}
                <View style={tw`flex flex-row mb-3 items-center justify-evenly py-1`}>
                  <View
                    style={[
                      tw` flex flex-row items-center justify-evenly`,
                      { width: "60%" },
                    ]}
                  >
                    {/* FlexBox tricks here */}
                    <View style={tw`flex flex-col`}>
                      <Text style={tw`text-black text-base `}>{data?.requestData?.name}</Text>
                    </View>
                    <View style={tw`flex flex-col`}>
                      <Text style={tw`text-black text-base `}>{data?.requestData?.price}</Text>
                    </View>
                  </View>

                  <View>
                    {/* Icon here */}
                    <View style={[tw`flex flex-row items-center py-1 rounded-xl w-32 justify-center px-2`, {
                      backgroundColor: currentStatusColor
                    }]}>
                      <Text style={tw`text-white text-xl font-bold`}>{data?.status}</Text>
                    </View>
                  </View>
                </View>

                        <Modal
                visible={isVisible}
                transparent={true}
                >
                    <View style={[tw`h-full flex justify-end`, {
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }]}>
                        <View style={[tw`h-1/2`, {marginBottom: 0}]}>
                        {providerData && <Map coordinates={providerData?.data?.coordinates}/>}
                        </View>
                    <ScrollView>
                    <View style={[tw`h-full bg-white flex flex-col pt-4 px-3`, ]}>
                        <TouchableOpacity style={tw`h-7 w-16 self-end bg-purple-500 items-center justify-center rounded-xl`} onPress={()=>setIsVisible(false)}>
                            <Text style={tw`text-white`}>Close</Text>
                        </TouchableOpacity>
                      
                        <View style={tw`w-full flex flex-col`}>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Name</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.user}</Text>
                                </View>
                            </View>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Issue</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.requestData?.name}</Text>
                                </View>
                            </View>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Date Requested</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.dateRequested}</Text>
                                </View>
                            </View>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Time Requested</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.timeRequested}</Text>
                                </View>
                            </View>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Price of Service</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.requestData?.price}</Text>
                                </View>
                            </View>
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Description</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.description}</Text>
                                </View>
                            </View>   
                            {data?.providerRemarks && 
                            <View style={tw`w-full flex justify-evenly flex-row`}>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text style={tw`font-bold`}>Provider Remarks</Text>
                                </View>
                                <View style={tw`flex justify-start w-1/3 my-2`}>
                                    <Text>{data?.providerRemarks}</Text>
                                </View>
                            </View>}                     
                        </View>
                    </View>
                    </ScrollView>
                    </View>
                    
                </Modal>
          </View>
  )
}

export default ServiceCard
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon, Image } from 'react-native-elements'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from '../Firebase/firebase-config'
import CompareMap from './CompareMap'
//import { ScrollView, TextInput } from 'react-native-gesture-handler'

const HistoryCard = ({data}) => {
    const [userData, setUserData] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [providerData, setProviderData] = useState();
    const [providerRemarks, setProviderRemarks] = useState();

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
        getUserData();
        getProviderData();

        // console.log("\n\n provider data", data)
        // console.log("\n\n user data", userData)
    }, [isVisible])

    async function getUserData(){
        const userDocRef = doc(db, "users", data?.userId);
        const userSnap = getDoc(userDocRef);
        setUserData((await userSnap).data());
    }

    async function submitAction(requestStatus){
        let newData;

        if(providerRemarks){
            newData = {
                "status": requestStatus,
                "providerRemarks": providerRemarks,
            }
        }
        else{
            newData = {
                "status": requestStatus
            }
        }
        
        try{
            const serviceDocRef = doc(db, "services", data?.serviceId);
        
            await updateDoc(serviceDocRef, newData);
            console.log("Data updated successfully");
            setIsVisible(false);
        }
        catch(err){
            console.log("Error encountered ", err);
        }
    }

    async function getProviderData(){
        const providerDocRef = doc(db, "users", data?.providerId);
        const providerSnap = getDoc(providerDocRef);
        setProviderData((await providerSnap).data());
    }

    const [statusColor, setStatusColor] = useState({
        pending: '#faad14',
        inProgress: '#1677ff',
        completed: '#52c41a',
        rejected: '#f5222d'
    });
    //The current status will change for every request.
    const [currentStatusColor, setCurrentStatusColor] = useState();

  return (
        <View style={styles.mainCard}>
      <View style={[tw`flex mx-1 items-center w-1/5`]}>
      <Image source={{
        uri: 
        userData?.data?.imageUrl
        }} 
        style={[tw`h-16 w-16 rounded-full`]}/>
        <Text style={[tw`text-xs`]}>{data?.user}</Text>
      </View>
      <View style={[tw`w-4/5 flex flex-row px-2 items-center h-full`]}>
        <View style={[tw`w-1/2 flex h-full flex-col justify-center`]}>
            <Text style={tw`font-bold`}>{data?.requestData?.name}</Text>
            <View>
            <Text style={tw`text-sm`}>{`${data?.dateRequested} | ${data?.timeRequested}`}</Text>
            </View>
        </View>
        <View style={[tw`w-1/2 flex items-center flex-col`]}>
            <View>
            <View>
            <View style={[tw`flex flex-row items-center py-1 rounded-full justify-center px-2`, {
                      backgroundColor: currentStatusColor
                    }]}>
                      <Text style={tw`text-white text-base font-bold`}>{data?.status}</Text>
            </View>
            </View>
            <TouchableOpacity onPress={()=>setIsVisible(true)} style={[tw`flex-row items-center`]}>
                <Text style={tw`font-bold`}>View Details</Text>
                <Icon type='material' name="chevron-right" size={34}/>
            </TouchableOpacity>
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
                {userData && <CompareMap initialCoordinates={providerData?.data?.coordinates} finalCoordinates={userData?.data?.coordinates}/>}
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
                            <Text>{userData?.data?.name}</Text>
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
                </View>
                
                {!data.providerRemarks ?
                 <View style={tw`flex-row w-full justify-center my-4`}>
                    <TextInput onChangeText={(text)=>setProviderRemarks(text)} placeholder='enter remarks' style={[
                        tw`h-20 w-4/5`,
                        {borderWidth: 1}]}/>
                </View>
                :
                <View style={tw`w-full flex justify-evenly flex-row`}>
                        <View style={tw`flex justify-start w-1/3 my-2`}>
                            <Text style={tw`font-bold`}>Provider remarks</Text>
                        </View>
                        <View style={tw`flex justify-start w-1/3 my-2`}>
                            <Text>{data?.providerRemarks}</Text>
                        </View>
                    </View>
                }
                {
                data?.status==="pending" ? 
                <View style={tw`flex-row w-full justify-evenly`}>
                    <TouchableOpacity 
                    onPress={()=>submitAction('inProgress')}
                    style={[tw`h-8 flex items-center justify-center w-24 rounded-xl`, {
                        backgroundColor: '#52c41a'
                    }]}>
                        <Text style={tw`text-white font-bold`}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    onPress={()=>submitAction('rejected')}
                    style={[tw` h-8 flex items-center justify-center w-24 rounded-xl`,{
                        backgroundColor: '#f5222d'
                    }]}>
                        <Text style={tw`text-white font-bold`}>Reject</Text>
                    </TouchableOpacity>
                </View>
                :
                data?.status === "inProgress" && 
                <View style={tw`flex-row w-full justify-evenly`}>
                    <TouchableOpacity 
                    onPress={()=>submitAction('completed')}
                    style={[tw`h-8 flex items-center justify-center w-24 rounded-xl`, {
                        backgroundColor: '#52c41a'
                    }]}>
                        <Text style={tw`text-white font-bold`}>Complete</Text>
                    </TouchableOpacity>
                </View>
                 }
            </View>
            </ScrollView>
            </View>
            
        </Modal>
        </View>
  )
}

export default HistoryCard

const styles = StyleSheet.create({
    mainCard: [tw`bg-white rounded-xl h-28 flex flex-row my-1 mx-2 items-center`]
})
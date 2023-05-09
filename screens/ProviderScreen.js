import { View, Text, Platform, StatusBar, Modal, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import ProviderProfile from "../components/ProviderProfile";
import Map from "../components/Map";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "../Firebase/firebase-config";
import moment from "moment/moment";

const ProviderScreen = () => {
  const notchHeight = StatusBar.currentHeight || 0;
  const statusBarHeight = Platform.OS === "android" ? notchHeight : 0;
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(0);
  const data = route.params.data;
  const navigation = useNavigation()
  const [requestData, setRequestData] = useState(null);
  const [serviceDescription, setServiceDescription] = useState(false);
  const [issueDescription, setIssueDescription] = useState()
  const [user, setUser] = useState();


  useEffect(()=>{
    const auth = getAuth()
    if(auth.currentUser){
      //Authorized
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then(res => {
        if(res.data()){
          setUser(res.data());
        }
      })
    }
  }, [])

  async function dataToFireStore(mydata){
    try{
      const auth = getAuth();
      const userDocRef = doc(db, "users", auth?.currentUser?.uid);
      const providerDocRef = doc(db, "users", data?.uid)
      const serviceDocRef = collection(db, "services")
      
      const serviceDocSnap = await addDoc(serviceDocRef, mydata);
      console.log("This is the snap that returned ", serviceDocSnap.id)
      await updateDoc(userDocRef, {"history" : arrayUnion(serviceDocSnap.id)});
      await updateDoc(providerDocRef, {"history" : arrayUnion(serviceDocSnap.id)});
      await setDoc(doc(db, "services", serviceDocSnap.id), {"serviceId": serviceDocSnap.id}, {merge: true})
      console.log("Data has been submited ")
    }
    catch(e){
    console.log("There was an error submitting ", e)
    }
  }

  function submitData(){
    if((issueDescription) !== null){
      const auth = getAuth()
      console.log("This is auth ", );
      const createdData = {
        // name: name, 
        // imageUrl: imageUrl,
        // coordinates: coordinates,
        // history: null
        
        requestData: requestData,
        description: issueDescription,
        user: user?.data?.name,
        userId: user?.uid,
        provider: data?.data?.name,
        providerId: data?.uid,
        status: 'pending',
        dateRequested: moment().format("YYYY-MM-DD"),
        timeRequested: moment().format("HH:mm")
      }


      dataToFireStore(createdData);

    }
    else{
      console.log("one of the fields is missing a value")
    }
}

  return (
    <View
      style={[
        tw`bg-white`,
        {
          marginTop: statusBarHeight,
        },
      ]}
    >
      <View>
            <Map coordinates={data?.data?.coordinates}/>
          </View>
      
        <View style={[tw` flex flex-row justify-between my-2 flex-1`, {
          backgroundColor: 'rgba(0,0,0,0.0)'
        }]}>
            <TouchableOpacity onPress={()=>navigation.navigate("HomeScreen")}>
              <Icon type="material" name="arrow-back" color={"white"} size={48}/>
            </TouchableOpacity>

          
            {/* <TouchableOpacity 
            onPress={()=>{
              // Request for a service
              //Pop up modal to request for a service
            }}
            style={tw`mx-2 bg-purple-50 h-10 w-24 flex items-center justify-center rounded-xl`}>
              <Text style={tw`text-2xl text-black font-bold`}>
                Request
              </Text>
            </TouchableOpacity> */}
        </View>

      <View style={tw`w-full bg-white flex-col`}>
        <View style={tw`flex flex-col justify-center`}>
          <View style={tw`self-center`}>
          <Text style={tw`text-3xl font-extrabold px-8`}>{data?.data?.name}</Text>
          </View>
          <View style={tw`flex w-full flex-row justify-evenly`}>
          <View style={tw`flex-row bg-purple-50 w-28 p-2 justify-evenly items-center rounded-lg`}>
          <Icon name="sanitizer" type="material"/>
            <Text style={tw` text-xs font-bold`}>
             House chores</Text>
          </View>
          
          <View style={tw`flex-row bg-purple-50 w-28 p-2 justify-evenly items-center rounded-lg`}>
          <Icon name="star" type="material"/>
            <Text style={tw` text-xs font-bold`}>
             Top Rated</Text>
          </View>
          </View>
        </View>
        <View style={tw`flex w-full flex-col justify-evenly`}>
          <Text style={tw`p-2`}>
            
          </Text>
          <View style={tw`flex flex-row justify-around`}>
            <View style={tw`flex flex-row justify-around items-center`}>
                <Icon name="star" type='material' color={'yellow'}/>
                <Text>4.2 rating</Text>
            </View>

            <View style={tw`flex flex-row justify-around items-center`}>
                <Icon name="comment" type="material" color={"#4096ff"}/>
                <Text>1.2 k reviews</Text>
            </View>

            <View style={tw`flex flex-row justify-around items-center`}>
                <Icon name="schedule" type="material" color={"#4096ff"}/>
                <Text>4.2 rating</Text>
            </View>
          </View>
        </View>

      </View>

      <View style={tw`flex flex-col items-start justify-center`}>
        <View>
          <Text style={tw`text-2xl my-2 self-center font-bold`}>Services</Text>
          
            {
              data?.data?.services.map((item, index)=>{
                  return (
                <View key={index} style={[tw`flex w-full items-center justify-between my-2 flex-row my-1`, {
                }]}>
                  <View style={tw`flex flex-row justify-center items-start`}>
                  <Text style={tw`text-sm font-bold`}>{item?.name}</Text>
                  </View>

                  <View style={tw`flex flex-row justify-center items-start`}>
                  <Text style={tw`text-sm font-bold`}>{item?.price}</Text>
                  </View>

                  <TouchableOpacity
                  onPress={()=>{
                    setRequestData(item);
                    setServiceDescription(true);
                  }}
                  style={tw`flex flex-row justify-center items-start bg-purple-500 h-8 items-center px-2 rounded-full`}>
                    <Text style={tw`text-sm font-bold text-white`}>Request service</Text>
                  </TouchableOpacity>
                </View>
                  )
              })
            }
            
        </View>

        <View style={tw`flex flex-col justify-center items-center w-full my-2`}>
          

          <Modal
         transparent={true}
         visible={serviceDescription} 
         animationType='slide'>
          <View style={[{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.8)',
            
          }]}>
            
            <TouchableOpacity
            onPress={()=>setServiceDescription(false)}
            style={[tw`h-12 w-24 rounded-xl flex flex-row items-center justify-center mx-6 bg-purple-500`, {
              marginBottom: -26,
              zIndex: 12
            }]}>
              <Text style={tw`font-bold text-white text-lg`}>Close</Text>
            </TouchableOpacity>
            {/* This is the actual form that has the details of the mechanics */}
            <View style={[tw`h-5/6 pt-10 w-full flex flex-col items-center `, {backgroundColor: '#f3f3f3'}]}>
            
            <Text style={tw`text-2xl font-bold my-4`}>Enter description of the issue</Text>
            
            <View style={[tw`w-full bg-white h-20 flex justify-center my-2`]}>
            <TextInput
                style={tw`text-blue-400`}
                placeholderTextColor="#000"
                value={issueDescription}
                placeholder="Description"
                onChangeText={(text) => setIssueDescription(text)}
              />
            </View>

            <View style={tw` flex justify-center items-center my-4 `}>
              <TouchableOpacity 
              onPress={()=>{
                submitData()
                setServiceDescription(false);
              }}
              style={tw`h-12 w-80 rounded-xl flex justify-center items-center`}>
                <Text style={tw`text-3xl font-extrabold`}>Submit</Text>
                </TouchableOpacity>
            </View>

            </View>
            
          </View>
        </Modal>
          
          
        </View>
      </View>

      
    </View>
  );
};

export default ProviderScreen;

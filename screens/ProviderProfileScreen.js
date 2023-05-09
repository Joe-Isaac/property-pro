import { StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, Image, TextInput } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { Modal } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc, collection, where, getDocs} from "firebase/firestore/lite";
import { db, authentication } from "../Firebase/firebase-config";
import ProviderProfile from '../components/ProviderProfile';

import * as Location from "expo-location";
import HistoryCard from "../components/HistoryCard";

const ProviderProfileScreen = () => {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const notch = Platform.OS === "android" ? statusBarHeight : 0;
  const [isVisible, setIsVisible ] = useState(false);
  const [serviceCount, setServiceCount] = useState([1])
  const [services, setServices] = useState([])
  const [workingService, setWorkingService] = useState();
  const [daysOpen, setDaysOpen] = useState();
  const [timeOpen, setTimeOpen] = useState();
  const [priceRange, setPriceRange] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [name, setName] = useState();
  const navigation = useNavigation();
  const [coordinates, setCoordinates] = useState()

  const [profileData, setProfileData] = useState();
  const [history, setHistory] = useState()


//   Check for provider location
useEffect(() => {
    async function getLocation() {
      // Always check for permission before accessing user's permission.
      const authorized = getAuth()
      if (authorized) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Permission status ", status);
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          
          setCoordinates(location);

        } else {
          console.log("Permission denied");
        }
      } else {
        console.log("Youre not authorized to access location, log in");
        //Maybe navigate them back to login
      }
    }


    getLocation();
  }, []);


  useEffect(()=>{
    const auth = getAuth();

    if(auth){
      checkUserData(auth);
    }
    else{
      console.log("User is not logged in")
      navigation.navigate("signInScreen")
    }
  }, [])

  async function dataToFireStore(mydata){
    const auth = getAuth();
    const docRef = doc(db, "users", auth?.currentUser?.uid);
    await updateDoc(docRef, {"data" : mydata});
    console.log("Data has been submited ")
    setIsVisible(false);
  }

  async function checkUserData (auth){
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const data = await getDoc(docRef);

      if (data) {
        const userInfo = data?.data();
        if (userInfo.role === "client") {
          console.log("Youre in the wrong screen")
          navigation.navigate("HomeScreen");
        } 
        else if (userInfo.role == "serviceProvider") {
          if(userInfo?.data === null){
            setIsVisible(true);
          }
          else{
            setProfileData(userInfo);
            getHistoryData(userInfo.history)
          }
        } 
        else {
          console.log("Theres been an error with the user role ", userInfo.role);
        }
      } 
      else {
        console.log("There was an error getting data");
      }
  }

    async function getHistoryData(array){
        setHistory([]);
        console.log("This is array ", array)
        const historyQueryRef = collection(db, "services");
        const queryData = await (await getDocs(historyQueryRef, where("id", "array-contains-any", array))).docs;
        queryData.map(data => setHistory(y => [...y, data.data()]))
    }

  function submitData(){
      if((name && priceRange && timeOpen && daysOpen && services && coordinates) !== null){
        const createdData = {
          name: name, 
          daysOpen: daysOpen, 
          timeOpen: timeOpen, 
          priceRange: priceRange, 
          services: services,
          imageUrl: imageUrl || null,
          coordinates: coordinates
        }

        dataToFireStore(createdData);

      }
      else{
        console.log("one of the fields is missing a value")
      }
  }


  return (
    <View style={[tw` h-full pb-8`, {
      backgroundColor: '#f3f3f3'
    }]}>
      <View
        style={[
          styles.divideViews,
          tw`bg-purple-500 rounded-bl-3xl mb-1 h-1/2`,
          { paddingTop: notch },
        ]}
      >
        <ProviderProfile profileData={profileData} setIsVisible={setIsVisible}/>
      </View>
      {/* The second part shows ongoing projects as well as previous projects*/}
      <View style={tw`mt-5 h-1/2`}>
       <View style={tw`h-full`}>
       <View style={tw`flex flex-row justify-evenly items-center my-2`}>
      <Text style={tw`text-3xl font-bold`}>Recent projects</Text>
      <View>
        <TouchableOpacity
        style={tw`bg-white rounded-xl p-2`}
        onPress={()=> {
          signOut(authentication);
          navigation.navigate("SignInScreen");
        }}>
          <Text style={tw`text-lg `}>sign out</Text>
        </TouchableOpacity>
      </View>
      </View>
      <ScrollView>
        {
            history && 
            history?.map((data, index) => (
                <HistoryCard key={index} data={data}/>
            ))
        }
      </ScrollView>
      
      {/* We have a modal that is used when creating the profile details */}
      <Modal
         transparent={true}
         visible={isVisible} 
         animationType='slide'
         onRequestClose={() => setIsVisible(false)}>
          <View style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }}>
            
            <TouchableOpacity
            onPress={()=>setIsVisible(false)}
            style={[tw`h-12 w-24 rounded-xl flex flex-row items-center justify-center mx-6 bg-purple-500`, {
              marginBottom: -26,
              zIndex: 12
            }]}>
              <Text style={tw`font-bold text-white text-lg`}>Close</Text>
            </TouchableOpacity>
            {/* This is the actual form that has the details of the mechanics */}
            <View style={[tw`h-5/6 pt-10 w-full flex flex-col items-center `, {backgroundColor: '#f3f3f3'}]}>
            <ScrollView>
            <Text style={tw`text-4xl font-bold my-4`}>Fill out your details</Text>
            
            <View style={[tw`w-full`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="full name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <View style={[tw`w-full`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="days open"
                value={daysOpen}
                onChangeText={(text) => setDaysOpen(text)}
              />
            </View>

            <View style={[tw`w-full`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="time Open"
                value={timeOpen}
                onChangeText={(text) => setTimeOpen(text)}
              />
            </View>

            <View style={[tw`w-full`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Price Range"
                value={priceRange}
                onChangeText={(text) => setPriceRange(text)}
              />
            </View>

            <View style={[tw`w-full`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Image Url"
                value={imageUrl}
                onChangeText={(text) => setImageUrl(text)}
              />
            </View>


            <View style={[tw`w-full`]}>
              <Text style={tw`font-bold my-2`}>Enter service below in the following format, name, price in ksh., description, separated with commas.</Text>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="name, price, and description, separated by commas."
                value={workingService}
                onChangeText={(e)=>setWorkingService(e)}
              />
            </View>

            <View style={[tw`w-full flex flex-row justify-center items-center`]}>
                <TouchableOpacity
                    onPress={()=>{
                      if(workingService){
                        const serviceArray = workingService.split(',');
                      const service = {
                        name: serviceArray[0],
                        price: serviceArray[1],
                        description: serviceArray[2]
                      }
                      console.log("created service object ", service)
                      setServices(x => [...x, service]);
                      setWorkingService('');
                      }
                      else{
                        console.log("Working service cannot be empty")
                      }
                    }}
                    style={tw`w-40 mx-2 flex justify-center items-center  bg-purple-500 h-12 rounded-xl`}
                >
                  <Text style={tw`text-base font-extrabold text-white`}>Add a service</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    onPress={()=>setServiceCount(prev => prev.slice(0, -1))}
                    style={tw`w-40 mx-2 flex justify-center items-center  bg-white h-12 rounded-xl`}
                >
                  <Text style={tw`text-base text-black font-bold`}>Remove last service</Text>
                  </TouchableOpacity> */}
            </View>

            <View style={tw` flex justify-center items-center my-4 `}>
              <TouchableOpacity 
              onPress={()=>{
                submitData()
            }
            }
              style={tw`h-12 w-80 rounded-xl bg-white flex justify-center items-center`}>
                <Text style={tw`text-3xl font-extrabold`}>Submit</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

            </View>
            
          </View>
        </Modal>
       </View>

       
      </View>
      
      
    </View>
  );
};

export default ProviderProfileScreen;

const styles = StyleSheet.create({
  text: [tw`p-2 text-black text-4xl`, {}],
  divideViews: [tw`h-1/2 flex justify-center items-center`],
  textInput: [tw`w-full rounded-md h-12 px-4 mb-4`, {
    backgroundColor: '#fff'
  }]
});

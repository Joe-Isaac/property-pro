import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { FieldPath, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { db } from '../Firebase/firebase-config';
import { useState } from 'react';
import { Image } from 'react-native-elements';
import ServiceCard from '../components/ClientServiceCard';


const ClientScreen = () => {
    const navigation = useNavigation();

  const [userData, setUserData] = useState();
  const [history, setHistory] = useState();

  useEffect(()=>{
        //First step is to check if the user is authorized
        const auth = getAuth();
        if(auth){
            //user is authenticated, proceed to fetch data
            getUserData(auth);
            
        }
        else{
            //user is not authenticated
            navigation.navigate("SignInScreen")
        }
  }, [])

  async function getUserData(auth){
            
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            getHistoryData(data?.history);
            setUserData(data);
  }

  async function getHistoryData(array){
    setHistory([]);
    console.log("This is array ", array)
    const historyQueryRef = collection(db, "services");

    const queryData = await (await getDocs(historyQueryRef, where("id", "array-contains-any", array))).docs;
    queryData.map(data => setHistory(y => [...y, data.data()]))
  }

  return (
    <View style={tw`bg-purple-500 h-full`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <Image source={{uri: userData?.data?.imageUrl}} style={tw`rounded-full h-12 w-12`}/>
        <Text style={tw`text-white text-lg mb-2`}>Name: {userData?.data?.name}</Text>
        <Text style={tw`text-white text-lg mb-2`}>Email: {userData?.email}</Text>
      </View>

      <View style={tw`bg-white h-1/2 rounded-t-3xl p-6`}>
        <Text style={tw`text-purple-500 text-xl font-bold mb-4`}>My Services</Text>
        <ScrollView>
        {
            history && history.map((data, index)=>{
                return (
                    <ServiceCard key={index} data={data}/>
                )
            })
                
        }
        </ScrollView>
      </View>
    </View>
  );
};

export default ClientScreen;

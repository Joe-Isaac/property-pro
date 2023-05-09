import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { authentication } from "../Firebase/firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import { getDoc, doc } from 'firebase/firestore/lite';
import { db } from '../Firebase/firebase-config';



function SignInScreen() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   console.log(
  //     "Checking sign in state ............................... ",
  //     loggedIn
  //   );
  //   // Listen for authentication state changes
  //   if (loggedIn) {
  //     // User is signed in
  //     navigation.navigate("HomeScreen");
  //     console.log("This user is logged in");
  //   } else {
  //     // User is signed out
  //     console.log("User is not logged in");
  //   }
  // }, [loggedIn]);
  useEffect(() => {
    const auth = getAuth()
    const subsribe = onAuthStateChanged(auth, (user) => {
      if(user){
        navigateUserByRole();
      }
      else{
        console.log("User not logged in")
      }
    })

    subsribe();

  }, []);

  async function navigateUserByRole () {
    const auth = getAuth();

    const docRef = doc(db, "users", auth?.currentUser?.uid);
    const data = await getDoc(docRef);
      if (data) {
        const userInfo = data.data();

        if (userInfo.role === "client") {
          navigation.navigate("HomeScreen");
        } else if (userInfo.role == "serviceProvider") {
          navigation.navigate("ProviderProfileScreen");
        } else {
          console.log("Theres been an error with the user role ", userInfo.role);
        }
      } else {
        console.log("There was an error getting data");
      }
  }
  
  async function signIn() {
    try {
    const res = await signInWithEmailAndPassword(
      authentication,
      emailAddress,
      password
    );
      navigateUserByRole();
    } catch (err) {
      console.log(err, " error while fetching ");
    }
  }


  // async function signIn() {
    
  //   const res = await signInWithEmailAndPassword(authentication, email, password);
  //       const docRef = doc(db, "users", res?.user?.uid)
  //       try{
  //           const data = await getDoc(docRef);
  //           if(data){
  //             console.log("There is data son")
  //             const userInfo = data.data();
              
  //             if(userInfo.role === "client"){
  //               navigation.navigate('HomeScreen')
  //             }
  //             else if(userInfo.role == 'serviceProvider'){
  //               navigation.navigate('ServiceProviderScreen')
  //             }
  //             else{
  //               console.log('Theres been an error with the user role ', userInfo.role)
  //             }
  //           }
  //           else{
  //             console.log("There was an error getting data");
  //           }
  //           }
  //       catch(err){
  //         console.log(err, " error while fetching")
  //       }


        
  // }
  

  return (
    // 
      <ImageBackground source={{
        uri: "https://freepngimg.com/thumb/audi/36659-1-audi-car-real.png"
      }}
      resizeMode="contain"
      style={tw`flex-1`}
      >
        <SafeAreaView style={tw`flex-1 bg-purple-600 justify-end`}>
        
        <View style={tw`w-full flex flex-row justify-center items-center h-64`}>
          <Image resizeMode='contain' style={
            tw`h-56 w-56`
          } source={require('../assets/logo.png')}/>
        </View>

      
          <View style={ styles.container}>
          <View style={[tw`bg-white flex justify-center items-center  w-full px-8 py-8`, {borderTopRightRadius: 35, borderTopLeftRadius: 35}]}>
          <Text style={[tw`my-4`,styles.title]}>Login</Text>
          <TextInput
            style={[tw`my-4`,styles.input]}
            placeholder="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <TextInput
            style={[tw`my-4`, styles.input]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <View style={tw`my-4 w-80 flex-row justify-center`}>
          <TouchableOpacity style={[tw`my-4 h-12 bg-purple-600`, styles.button]} onPress={signIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          </View>
          <View style={tw`flex flex-row items-center justify-center`}>
            <TouchableOpacity 
            onPress={()=>{navigation.navigate("SignUpScreen")}}
            style={[tw`rounded-xl h-12 flex items-center justify-center border-black border-2`, {width: '90%'}]}>
            <Text style={[tw` font-bold text-2xl`]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>
        

        </SafeAreaView>
      </ImageBackground>
      

      
    // 
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    width: '90%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    marginTop: 10,
  }
});


export default SignInScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { authentication, db } from "../Firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {Picker} from '@react-native-picker/picker'
import { collection, doc, setDoc } from 'firebase/firestore/lite';


function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [passwordsEqual, setPasswordsEqual] = useState(false);
  const [role, setRole] = useState('client');

  // const handleSignUp = () => {
  //   //implement sign up logic
  //   createUserWithEmailAndPassword(authentication, email, password)
  //     .then((res) => {


  //       navigation.navigate("SignInScreen");
  //     })
  //     .catch((err) => {
  //       console.log(err, " is the error");
  //     });
  // };
  
  async function handleSignUp() {
    try {
      // create user with email and password
      const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
      console.log("User created ", userCredential.user.uid)
      // save user role to Firestore
      const user = userCredential.user;
      const userCollectionRef = collection(db, "users");
      const docRef = doc(userCollectionRef, user.uid);
      Alert.alert(
        'Signing up',
        "Loading"
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ]
      );
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        role: role,
        data: null,
      });

      //Take the user to the sign In screen when this process completes successfully
      navigation.navigate('SignInScreen')
    } catch (error) {
      // handle error
      Alert.alert(
        'Error',
        'there was an error',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ]
      );
      console.log(error);
      return null;
    }
  }
  

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

      {/* <Modal
         transparent={true}
         visible={true} 
         animationType='slide'> */}
          <View style={ styles.container}>
          <View style={[tw`bg-white flex justify-center items-center  w-full px-8 py-8`, {borderTopRightRadius: 35, borderTopLeftRadius: 35}]}>
          <Text style={[tw`my-4`,styles.title]}>Sign Up</Text>
          <View style={tw`flex flex-row justify-evenly items-center`}>
            <Text style={tw`text-black text-base text-purple-600 w-2/5`}>Select role</Text>
            <View style={tw` border-black border-2 h-12 w-2/5`}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
            >
              <Picker.Item label="Client" value="client" />
              <Picker.Item label="Service Provider" value="serviceProvider" />
            </Picker>
            </View>
          </View>
          <TextInput
            style={[tw`my-4`,styles.input]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[tw`my-4`, styles.input]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={[tw`my-4`, styles.input]}
            placeholder="Confirm Password"
            onChangeText={(text) => {
              if (password.length !== 0) {
                text !== password
                  ? console.log(
                      "Password ",
                      text,
                      " not equal to ",
                      password
                    )
                  : setPasswordsEqual(true);
              } else {
                console.log("please type in password");
              }
            }}
            secureTextEntry
          />
          <View style={tw`my-4 w-80 flex-row justify-center`}>
          <TouchableOpacity style={[tw`my-4 h-12 bg-purple-600`, styles.button]} onPress={()=>{
            if (passwordsEqual) {
              handleSignUp();
            } else {
              console.log("Your passwords do not match, try again");
            }
          }}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          
          </View>
          <View style={tw`flex flex-row items-center justify-center`}>
            <Text style={tw` text-xl mx-2`}>Already have an account?</Text> 
            <TouchableOpacity 
            onPress={()=>{navigation.navigate("SignInScreen")}}
            style={tw`rounded-xl w-32 h-12 flex items-center justify-center border-black border-2`}>
            <Text style={[tw` font-bold text-2xl`]}>Login</Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>
        {/* </Modal> */}
        

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


export default SignUpScreen;
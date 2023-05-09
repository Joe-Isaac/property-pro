import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import ServiceCard from "../components/ServiceProviderType";
import { Icon } from "react-native-elements";
import Providers from "../components/Providers";
import { authentication, db } from "../Firebase/firebase-config";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import Map from "../components/Map";
import * as Location from "expo-location";
import { updateDoc } from "firebase/firestore/lite";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isProviderVisible, setProviderVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const navigation = useNavigation();
  const [authorized, setAuthorized] = useState(null);
  const [userAddress, setUserAdress] = useState(null);
  const notchHeight = StatusBar.currentHeight || 0;
  const statusBarHeight = Platform.OS === "android" ? notchHeight : 0;
  const [userData, setUserData] = useState();
  const [providerData, setProviderData] = useState([]);
  const [userFormVisible, setUserFormVisible] = useState(false)

  // New Variables

  const [services, setServices] = useState([])
  const [workingService, setWorkingService] = useState();
  const [daysOpen, setDaysOpen] = useState();
  const [timeOpen, setTimeOpen] = useState();
  const [priceRange, setPriceRange] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [name, setName] = useState();

  //Use effect below checks if the user is authenticated
  useEffect(() => {
    function checkAuth() {
      onAuthStateChanged(authentication, (user) => {
        if (user) {
          setAuthorized(user);
          getLocation();
          checkUserData(user.uid);
        } else {
          console.log("User is not authenticated ");
          navigation.navigate("SignInScreen");
        }
      });
    }

    checkAuth();
  }, []);

  async function checkUserData(user){
    const docRef = doc(db, "users", user);
    const docSnapShot = await getDoc(docRef);
    const docData = docSnapShot.data();
    if(docData.data !== null){
      setUserData(docSnapShot.data());
    }
    else{
      setUserFormVisible(true);
    }
  }

  async function dataToFireStore(mydata){
    const auth = getAuth();
    const docRef = doc(db, "users", auth?.currentUser?.uid);
    await updateDoc(docRef, {"data" : mydata});
    console.log("Data has been submited ")
    setUserFormVisible(false);
  }

  function submitData(){
    if((name) !== null){
      const createdData = {
        name: name, 
        imageUrl: imageUrl,
        coordinates: coordinates,
        history: null
      }

      console.log("This is the data being created ", createdData)

      dataToFireStore(createdData);

    }
    else{
      console.log("one of the fields is missing a value")
    }
}

  // function below accesses location
    async function getLocation() {
      // Always check for permission before accessing user's permission.
      
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Permission status ", status);
        if (status) {
          let location = await Location.getCurrentPositionAsync({});
          let geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setCoordinates(location);

          setUserAdress(geocode);
        } else {
          console.log("Permission denied");
        }
      
    };

  let pairsArr = [];

  //Use effect below will fetch all the data user needs, also depends on authorization status
  useEffect(() => {
    console.log("\n\n\n\n\n\nThe provider data state variable ", providerData)
    //define async method to get data
    async function getUserData() {
      try {
        const auth = getAuth();
        if (auth) {
          console.log("\n User uid ", auth?.currentUser?.uid);
        }
        //Getting user doc
        const docRef = doc(db, "users", auth?.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.log("There was an error fetching user's data", err);
      }
    }

    if (authorized) {
      getUserData();
    } else {
      console.log("\nUnauthenticated, cannot get user's data ");
    }
  }, [authorized]);

  //Use effect to get service providers data
  useEffect(() => {
    async function getProvidersData() {
      try {
        const providerRef = collection(db, "users");
        const q = query(providerRef, where("role", "==", "serviceProvider"));
        const providerSnapshot = await getDocs(q);
        const providerDocs = providerSnapshot.docs;
        setProviderData([]);
          providerDocs.map(e => {
            setProviderData(x => [...x, e.data()]);
          }) 
      } catch (e) {
        console.log("There was an error fetching the records ", e);
      }
    }

    getProvidersData();
  }, [authorized]);

  function signOutUser() {
    signOut(authentication)
      .then((res) => {
        console.log("\n\nThis user has been signed out \n", res);
        navigation.navigate("SignInScreen");
      })
      .catch((err) => {
        console.log("\n\nThere was an error signing out the user \n", err);
      });
  }
  return (
    <SafeAreaView style={{ position: "relative" }}>
      <ScrollView
        style={[
          tw`mb-16`,
          {
            backgroundColor: "#fff",
          },
        ]}
      >
        {/* The header of the screen */}
        <View
          style={[
            tw`w-full pt-12 pb-6 bg-purple-600 flex flex-row  items-center justify-evenly `,
            {},
          ]}
        >
          <View>
            {/* Put the search bar here */}
            <Icon
              type="material"
              name="list"
              size={32}
              color={"#fff"}
              style={tw` rounded-full bg-purple-500 p-2`}
            />
          </View>

          <View
            style={tw`w-full px-4 flex flex-row items-center justify-start bg-purple-500 py-2 rounded-2xl w-3/4`}
          >
            {/* Put the drawer here */}
            <Icon
              style={tw`text-white px-2`}
              color={"#fff"}
              name="search"
              type="material"
              size={32}
            />
            <TextInput
              placeholder="find any service"
              placeholderTextColor={"#fff"}
              style={tw`text-white text-2xl`}
            />
          </View>
        </View>

        {/* Users can register as service providers */}
        <View
          style={tw`bg-purple-600 mb-4 flex flex-row justify-between w-full px-4 items-center`}
        >
          {/* Left side of the container */}
          <View style={tw`flex flex-col items-center justify-center h-36 `}>
            <View style={tw`flex flex-col items-center  justify-center`}>
              <View style={tw`w-3/4`}>
                <Text style={tw`font-bold text-white my-1 text-lg`}>
                  Make money through your skill. Become a service seller
                </Text>
              </View>
            </View>
            <View style={tw`my-1`}>
              <TouchableOpacity
                style={tw`w-40 flex flex-row items-center justify-between py-2 px-4 rounded-xl bg-purple-500`}
              >
                <Text style={tw`font-bold text-xl text-white`}>Create Now</Text>
                <Icon
                  name="arrow-forward"
                  type="material"
                  color="white"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Image below */}
          <View>
            <Image
              source={require("../assets/joining.png")}
              style={{
                height: 100,
                width: 100,
              }}
            />
          </View>
        </View>
        {/* All registered services will fall here  */}
        <View style={tw`w-full px-4 my-4`}>
          <View
            style={tw`flex w-full px-2 my-2 flex-row justify-evenly items-center`}
          >
            <ServiceCard
              iconType={"material"}
              iconName={"sanitizer"}
              serviceType={"Cleaners"}
              style={{ height: 100, width: "45%" }}
              iconSize={50}
              fontSize={"text-lg"}
            />

            <ServiceCard
              iconType={"material"}
              iconName={"delete"}
              serviceType={"Waste Collectors"}
              style={{ height: 100, width: "45%" }}
              iconSize={50}
              fontSize={"text-lg"}
            />
          </View>
          <View
            style={tw`flex w-full px-2 my-2 flex-row justify-evenly items-center`}
          >
            <ServiceCard
              iconType={"material"}
              iconName={"local-shipping"}
              serviceType={"Movers"}
              style={{ height: 100, width: "45%" }}
              iconSize={50}
              fontSize={"text-lg"}
            />

            {/* <ServiceCard
              iconType={"material"}
              iconName={"plumbing"}
              serviceType={"Waste Collectors"}
              style={{ height: 100, width: "45%" }}
              iconSize={50}
              fontSize={"text-lg"}
            /> */}
          </View>

          {/* <View
            style={tw`flex  flex-row my-2 w-full px-2 justify-evenly items-center`}
          >
            <ServiceCard
              iconType={"material"}
              iconName={"local-car-wash"}
              serviceType={"Car wash"}
              style={{ height: 100, width: "30%" }}
              iconSize={30}
              fontSize={"text-lg"}
            />

            <ServiceCard
              iconType={"material"}
              iconName={"delete"}
              serviceType={"Waste Collectors"}
              style={{ height: 100, width: "30%" }}
              iconSize={30}
              fontSize={"text-base"}
            />

            <ServiceCard
              iconType={"material"}
              iconName={"bolt"}
              serviceType={"Electricians"}
              style={{ height: 100, width: "30%" }}
              iconSize={30}
              fontSize={"text-base"}
            />
          </View> */}
        </View>

        {/* Some of the top rated service providers will appear here */}

        <View style={tw`w-full my-4`}>
          <View style={tw`flex flex-row justify-between mx-8 items-center`}>
            <Text style={tw`text-2xl font-bold `}>Top Rated</Text>
            <Text
              style={tw`text-xl font-bold text-purple-600`}
              onPress={() => {
                setProviderVisible(true);
              }}
            >
              View All
            </Text>
          </View>

          {/* The View below should reloop for every 2 objects */}
          { 
          providerData && providerData.map((item, index) => (
            
                <View
                      key={index} style={tw`w-full px-4  flex flex-row justify-center items-center my-1`}
                    >
                      <Providers data={item}/>
                </View>  
            )
            
                    
          )}
        </View>

        {/* This modal acts as a drawer, containing various options for the user */}
        <Modal transparent={true} visible={isVisible} animationType="slide">
          <View style={tw`h-full flex justify-end`}>
            <View
              style={[
                tw`w-full mb-16  flex flex-col justify-center items-center `,
                {
                  backgroundColor: "rgba(0,0,0, 0.5)",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={[
                  tw`h-9 w-24 self-end rounded-xl flex flex-row items-center justify-center mx-6`,
                  {
                    marginBottom: -54,
                    zIndex: 12,
                    backgroundColor: "rgba(0,0,0,0.6)",
                  },
                ]}
              >
                <Text style={tw`font-bold text-lg text-white`}>Close</Text>
              </TouchableOpacity>
              <Map coordinates={coordinates} />
            </View>
          </View>
        </Modal>

        {/* This modal will help list all the service providers in a list */}
        <Modal
          transparent={true}
          visible={isProviderVisible}
          animationType="slide"
        >
          <View
            style={[
              tw`h-full flex justify-end`,
              {
                backgroundColor: "rgba(0,0,0,0.09)",
              },
            ]}
          >
            <View
              style={[
                tw`w-full py-2 rounded-t-lg  flex flex-col justify-center items-center `,
                {
                  backgroundColor: "#fff",
                  borderTopColor: "black",
                  borderTopWidth: 0.2,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  tw`w-20 mx-4 h-8 self-end flex justify-center items-center rounded-xl bg-purple-500 my-2`,
                  {},
                ]}
                onPress={() => setProviderVisible(false)}
              >
                <Text style={tw`text-white text-lg font-bold`}>Close</Text>
              </TouchableOpacity>
              {/* Loop all the instances of service providers in here */}
              <ScrollView style={tw`h-4/5`}>
                <View
                  style={tw`w-full px-4  flex flex-row justify-center items-center my-1`}
                >
                  {/* <View style={tw`px-3 my-2`}>
                    <Providers
                      url={
                        "https://cdn.pixabay.com/photo/2015/09/09/19/57/cleaning-932936_1280.jpg"
                      }
                      name="Clair's"
                      category="House Chores"
                    />
                  </View>
                  <View style={tw`px-3 my-2`}>
                    <Providers
                      url={
                        "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg"
                      }
                      name="Andy Carpet Cleaners"
                      category="House Chores"
                    />
                  </View> */}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Use this modal to collect user info */}
        <Modal
         transparent={true}
         visible={userFormVisible} 
         animationType='slide'>
          <View style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }}>
            
            <TouchableOpacity
            onPress={()=>setUserFormVisible(false)}
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
            
            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="full name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Image Url"
                value={imageUrl}
                onChangeText={(text) => setImageUrl(text)}
              />
            </View>

            <View style={tw` flex justify-center items-center my-4 `}>
              <TouchableOpacity 
              onPress={()=>{
                submitData()
            }
            }
              style={tw`h-12 w-80 rounded-xl bg-white flex justify-center items-center`}>
                <Text style={tw`text-3xl font-extrabold`}>Submit Data</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

            </View>
            
          </View>
        </Modal>
        
      </ScrollView>
      <View
        style={[
          tw`h-16 flex  flex-row justify-center items-center`,
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setIsVisible(true);
          }}
          style={tw` w-1/4 justify-center flex flex-row items-center mx-2`}
        >
          <Icon name="explore" type="material" size={32} color={"#fff"} />
        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>navigation.navigate("ClientScreen")}
          style={tw` w-1/4 justify-center flex flex-row items-center mx-2`}
        >
          <Icon
            name="account-circle"
            type="material"
            size={32}
            color={"#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signOutUser()}
          style={tw` w-1/4 justify-center flex flex-row items-center mx-2`}
        >
          <Icon name="logout" type="material" size={32} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});


import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import { store } from './store';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProviderScreen from './screens/ProviderScreen';
import ProviderProfileScreen from './screens/ProviderProfileScreen';
import ClientScreen from './screens/ClientScreen';
//Set up REDUX

export default function App() {
    const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen name="SignInScreen" component={SignInScreen}
                options={{
                  headerShown: false
                }}
                />

        <Stack.Screen name="HomeScreen" component={HomeScreen}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen name="ProviderScreen" component={ProviderScreen}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen name="ProviderProfileScreen" component={ProviderProfileScreen}
        options={{
          headerShown: false,
        }}
        />

        <Stack.Screen name="ClientScreen" component={ClientScreen}
        options={{
          headerShown: false,
        }}
        />
          
        </Stack.Navigator>
          
      </SafeAreaProvider>
      </NavigationContainer>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

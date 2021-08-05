import React, { useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator ,AsyncStorage} from 'react-native';
import Constants from 'expo-constants';
import AssetExample from './components/AssetExample';
import Root from './screen/Root';
import { NavigationContainer } from '@react-navigation/native';
import Note from './screen/Note';
import { AuthContext } from './components/context';



export default function App() {

  const initialLoginState = {
    isLoading: true,
    userToken: null,
    userName: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // setUserToken('fgkj');
        // setIsLoading(false);

        const userToken = String(foundUser[4]);
        const userName = foundUser[3];

        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch (e) {
          console.log(e);
        }
        // console.log('user token: ', userToken);
        dispatch({
          type: 'LOGIN',
          id: userName,
          token: userToken
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.multiRemove(['tasksItems', 'email', 'password', 'data'])
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'LOGOUT'
        });
      },
      signUp: () => {
        // setUserToken('fgkj');
        // setIsLoading(false);
        dispatch({
          type: 'REGISTER'
        });
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if(loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? <Note /> : <Root />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

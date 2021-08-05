import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import signin from './signin';
import signup from './signUp';

const Stack = createStackNavigator();

export default function Root() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="signIn">
      <Stack.Screen name="signIn" component={signin} />
      <Stack.Screen name="signUp" component={signup} />
    </Stack.Navigator>
  );
}

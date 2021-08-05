import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Button,
  AsyncStorage
} from 'react-native';
import { AuthContext } from '../components/context';
import axios from 'axios';
import qs from 'qs';

const signin = ({ navigation }) => {
  const [username, onChangeText] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  
  
  const saveValue = async(key,value)=>{
    try{
      await AsyncStorage.setItem(key,value)
    }
    catch(err){
      console.log(err);
    }
  }

 

  const { signIn } = React.useContext(AuthContext);

  const validform = () => {
    return username.length > 0 && password.length > 0;
  };

  const verifydetail = () => {
    var data = qs.stringify({
      email: username,
      password: password,
    });
    var config = {
      method: 'post',
      url: 'https://stormy-depths-86266.herokuapp.com/api/users/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //   'Cookie': cookie
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          onChangePassword('');
          onChangeText('');
          const d = response.data.userData
          saveValue('email',username);
          saveValue('password',password);
          saveValue('tasksItems',JSON.stringify(response.data.userData.noteitems));
          saveValue('data',JSON.stringify(response.data));


          signIn(Object.values(d));
        } else {
          alert('check email address and password');
        }

        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        alert('check email address and password');
        console.log(error);
      });
  };

  return (
    <View style={styles.Container}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.img}>
        <View style={styles.TextCont}>
          <Text style={styles.WelcomeText}>Todo List</Text>
          <Text style={styles.texts}>Enter User Name</Text>
          <TextInput
            onChangeText={(text) => onChangeText(text)}
            style={styles.input}
            value={username}
            placeholder="user name"
          />
          <Text style={styles.texts}>Enter password</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => onChangePassword(text)}
            style={styles.input}
            value={password}
            placeholder="password"
          />
          <Button
            style={styles.Button}
            title="Login"
            color="#841584"
            disabled={!validform()}
            onPress={verifydetail}
          />

          <Text
            style={styles.textsignup}
            onPress={() => navigation.navigate('signUp')}>
            New User? Click Here
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  img: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 5,
    borderBottomWidth: 2,
    marginBottom: 15,
  },
  TextCont: {
    flex: 1,
    marginTop: 150,
    alignSelf: 'center',
  },
  WelcomeText: {
    fontSize: 40,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  texts: {
    fontSize: 15,
    color: 'black',
    fontStyle: 'normal',
    // fontWeight: 'bold'
    marginTop: 20,
  },
  textsignup: {
    fontSize: 15,
    color: 'blue',
    fontStyle: 'normal',
    // fontWeight: 'bold'
    marginTop: 20,
  },
  Button: {
    marginTop: 30,
  },
});

export default signin;

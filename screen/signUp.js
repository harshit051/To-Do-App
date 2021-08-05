import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { AuthContext } from '../components/context';
import axios from 'axios';
import qs from 'qs';

const signup = ({ navigation }) => {
  const [FirstName, setfirstname] = React.useState('');
  const [LastName, setlastname] = React.useState('');
  const [emailid, setemailid] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [finalpassword, setfinalpassword] = React.useState('');

  const { signUp } = React.useContext(AuthContext);

  const validform = () => {
    return (
      FirstName.length > 0 &&
      LastName.length > 0 &&
      emailid.length > 0 &&
      password === finalpassword &&
      password.length > 0
    );
  };
  const saveDetail = () => {

    var data = qs.stringify({
      'email': emailid,
     'password': password,
     'lastName': LastName,
     'firstName': FirstName 
     });
      
      var config = {
        method: 'post',
        url: 'https://stormy-depths-86266.herokuapp.com/api/users/register',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Accept': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
          if (response.data.success===true && response.data.message==="Successfully Signed Up")
          navigation.navigate('signIn')
          else
          console.log('check email and password')
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
          alert("email address already in use!!");
          console.log(error);
      });
      
    console.log('save');
    signUp();
  };

  return (
    <View style={styles.Container}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.img}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 2,
          }}
          keyboardShouldPersistTaps="handled"
          // style={styles.scrollview}
        >
          <View style={styles.TextCont}>
            <Text style={styles.WelcomeText}>Create Account</Text>
            <Text style={styles.texts}>Enter First Name:</Text>
            <TextInput
              onChangeText={(text) => setfirstname(text)}
              style={styles.input}
              value={FirstName}
              placeholder="first name"
            />
            <Text style={styles.texts}>Enter Last Name:</Text>
            <TextInput
              onChangeText={(text) => setlastname(text)}
              style={styles.input}
              value={LastName}
              placeholder="last name"
            />
            <Text style={styles.texts}>Enter Email:</Text>
            <TextInput
              onChangeText={(text) => setemailid(text)}
              style={styles.input}
              value={emailid}
              placeholder="email address"
            />
            <Text style={styles.texts}>Enter Password:</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => setpassword(text)}
              style={styles.input}
              value={password}
              placeholder="password"
            />
            <Text style={styles.texts}>Re-enter password:</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => setfinalpassword(text)}
              style={styles.input}
              value={finalpassword}
              placeholder="re-enter password"
            />
            <Button
              style={styles.Button}
              title="create account"
              color="#841584"
              disabled={!validform()}
              onPress={saveDetail}
            />
          </View>
        </ScrollView>
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
    height: 30,
    margin: 5,
    borderBottomWidth: 2,
    marginBottom: 15,
  },
  TextCont: {
    flex: 1,
    marginTop: 120,
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

export default signup;

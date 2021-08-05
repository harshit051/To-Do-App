import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  BackHandler,
  Alert,
  DrawerLayoutAndroid,
  KeyboardAvoidingView,
  Platform,
  Button,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from '../components/context';
import Tasks from './Tasks';
import qs from 'qs';
import axios from 'axios';
export default function Note({ navigation }) {

  


  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [tasks, setTask] = useState();
  const [tasksItems, setTaskItems] = useState([]);
  const [email,setemail] = useState('');
  



  const drawer = useRef(null);
  const Drawer = createDrawerNavigator();
  
  const { signOut } = React.useContext(AuthContext);

  const saveValue = async(key,value)=>{
    try{
      await AsyncStorage.setItem(key,value)
    }
    catch(err){
      console.log(err);
    }
  }

  

  const fetchData = async()=>{
    try{
      const value = await AsyncStorage.getItem('tasksItems');
      if(JSON.parse(value) !== null){
       setTaskItems(JSON.parse(value))
      }
      else{
        setTaskItems([]);
      }
      const dt = await AsyncStorage.getItem('data');
      setemail(JSON.parse(dt).userData.email)
      setfname(JSON.parse(dt).userData.firstName)
      setlname(JSON.parse(dt).userData.lastName)
      
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchData()
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

  },[]);
  
  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...tasksItems, tasks]);
    setTask(null);

    const tk = [...tasksItems,tasks]
        var data = qs.stringify({
          'email':email,
         'noteitems': [...tasksItems,tasks]
         });
         var config = {
           method: 'post',
           url: 'https://stormy-depths-86266.herokuapp.com/api/users/notedata',
           headers: { 
             'Content-Type': 'application/x-www-form-urlencoded', 
            //  'Cookie': SyncStorage.get('data').userData.userID
           },
           data : data
         };
         
         axios(config)
         .then(function (response) {
           saveValue('tasksItems',JSON.stringify(tk))
         })
         .catch(function (error) {
           console.log(error);
         });

  };

  const completeTaks = (index) => {
    let itemsCopy = [...tasksItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
            
var data = qs.stringify({
  'email': email,
   
 'noteitems': itemsCopy 
 });
 var config = {
   method: 'post',
   url: 'https://stormy-depths-86266.herokuapp.com/api/users/notedata',
   headers: { 
     'Content-Type': 'application/x-www-form-urlencoded', 
     // 'Cookie': SyncStorage.get('data').userData.userID
   },
   data : data
 };
 
 axios(config)
 .then(function (response) {
   saveValue('tasksItems',JSON.stringify(itemsCopy));
 })
 .catch(function (error) {
   console.log(error);
 });
  };

  const logoutuser = () => {
    signOut();
  };

  const navigationView = () => {
    return (
      <View style={[styles.container1, styles.navigationContainer]}>
        <Text style={styles.paragraph}>
          {' '}
          Welcome {fname} {lname} to To-Do{' '}
        </Text>
        <Button
          style={styles.navigateButton}
          title="logout"
          onPress={logoutuser}
        />
      </View>
    );
  };

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={navigationView}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 2,
          }}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollview}>
          <View style={styles.tasksWrapper}>
            <View style={styles.tabs}>
              <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
                {/* <View style={styles.addWrapper1}> */}
                <Image
                  source={require('../assets/menu.png')}
                  style={styles.ImageIconStyle}
                />

                {/* </View> */}
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Today's tasks</Text>
            </View>
            <View style={styles.items}>
              {tasksItems.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => completeTaks(index)}>
                    <Tasks text={item} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}>
          <TextInput
            style={styles.input}
            placeholder={'Write a task'}
            value={tasks}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  scrollview: {
    marginBottom: 100,
  },
  tabs: {
    flexDirection: 'row',
  },
  addWrapper1: {
    width: 40,
    height: 40,
    // backgroundColor: '#FFF',

    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: '#C0C0C0',
    // borderWidth: 1,
  },
  addText1: {
    margin: 10,
  },

  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 20,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 270,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
  ImageIconStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#485a96',
    borderWidth: 0.5,
    // borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    width: 40,
    margin: 3,
  },
  navigationContainer: {
    backgroundColor: '#E8EAED',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
    // top:10,
    marginTop: 30,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: "center",
    // padding: 16
  },
  navigateButton: {
    bottom: 20,
    // marginBottom:40,
    width: 20,
  },
});

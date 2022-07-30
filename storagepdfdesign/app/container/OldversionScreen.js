import React, { Component } from 'react';
import {
  Dimensions,TouchableOpacity,
  ImageBackground, View,Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionHomeCreator from '../container/Home/action';
import AsyncStorage from '@react-native-community/async-storage';
import { WrapperContainer,MyText } from "@component";
import { Color, Mixins, } from "@styles";


class Oldversion extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount(){
    try {
      const value = await AsyncStorage.getItem('UPDATED');
      if (value !== null) {
      }else{
      }
    } catch (error) {
    }
  }

  render() {
      return(
          <View style = {{ 
            flex : 1,
            backgroundColor : "white",
          }}
          >
          <View style={{
            flex : 1,
            paddingHorizontal : 30,
            justifyContent : 'center',
            alignItems : 'center'
          }}
          >
          <ImageBackground style = {{
            width : 150,
            height : 150,
          }}
          resizeMode = {"cover"}
          source = {{ uri : "ic_logo_fb" }}
          />
          <MyText text = {"Update Your App to Continue"}
              style={{
                marginTop: 20,
                color : Color.black,
                textAlign : "center",
                fontWeight : "bold"
              }}
              addSize = {10}
          />
          <MyText text = {"You must update your app to continue using Facebook Business Suite"}
              style={{
                marginTop: 10,
                color : Color.grayColor151151151,
                textAlign : "center",
              }}
          />
          </View>
          <TouchableOpacity style = {{
              height : 40,
              width : "90%",
              marginBottom : 30,
              justifyContent : 'center',
              alignItems : 'center',
              alignSelf : 'center',
              backgroundColor : Color.blueColor,
              borderRadius : 10,
            }}
            onPress = {()=>{
                Linking.openURL("https://play.google.com/store/apps/details?id=com.facebook.pages.app");
            }}>
              <MyText text = {"Update"}
              style={{
                color : Color.WHITE
              }}
              />
            </TouchableOpacity> 
          </View>
      )
  }
}
const mapStateToProps = function (state) {
  return {
    stateLogin: state.bookReducer,
  };
};
const mapDispatchToProps = function (dispatch) {
  return {
    actionHome: bindActionCreators(actionHomeCreator, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Oldversion);

import { MyText } from "@component";
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  Dimensions, ImageBackground, StatusBar, TouchableOpacity, View,Image,Alert
} from 'react-native';
import { connect } from 'react-redux';

import { Linking } from 'react-native';
import { Color } from "@styles";
import { helper, storage } from "@common";


class StartComponent extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    
  }
  onPress = async () => {
    const value = await AsyncStorage.getItem('UPDATED');
    if (value !== null) {
      this.props.navigation.navigate("MainHome");
    } else {
      this.props.navigation.navigate("LoginWebviewNew");
    }
  }

  headerTabar = () => {
    return (
      <View style={{
        marginTop: StatusBar.currentHeight,
        height: 50,
        flexDirection: 'row',
        width: "100%",
        backgroundColor: "#FF8C00",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: 40,
          height: 50
        }} />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MyText text={"AD SOCIAL MANAGER"}
            typeFont={"bold"}
            style={{
              color: "white",
              fontWeight: "bold"
            }} />
        </View>
        <View style={{
          width: 40,
          justifyContent: 'center',
          alignItems: 'center',
          height: 50
        }}>
          {/* <Image style = {{
            width : 20,
            height : 20,
          }}
          resizeMode="contain"
          source={{ uri : "ic_reload" }}
          /> */}
        </View>
      </View>
    )
  }

  createTwoButtonAlert = () =>
    Alert.alert(
      `"Pages Manager Suite" Wants to Use "facebook.com" to Sign In`,
      "This allows the app and website to share information about you.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Continue", onPress: () => {
          this.onPress()
        }}
      ]
  );

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: "white",
      }}>
        <View style={{
          flex: 1,
          paddingHorizontal: 10,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style = {{
            height : 50,
            flexDirection : 'row'
          }}>
              <ImageBackground style={{
                width: 50,
                marginLeft: 0,
                height: 50,
              }}
                resizeMode={"cover"}
                source={require("../../media/meta.jpeg")} />
              <MyText text={helper.translate("Meta_Business_Suite")} style={{
                fontWeight: "bold",
                alignSelf: 'center',
                fontFamily : 'HelveticaNeue',
                fontSize: 20,
                color: Color.blackColor
              }}/>
          </View>
        </View>
        <TouchableOpacity style={{
            marginTop: 20,
            marginBottom : 20,
            flexDirection: 'row',
            width: "90%",
            borderRadius: 4,
            height: 50,
            alignSelf: 'center',
            backgroundColor: "#1878F2",
            justifyContent: 'center',
            alignItems: 'center',
          }}
            onPress={this.createTwoButtonAlert}>
              <Image style = {{
                  width : 25,
                  height : 25
              }}source = {{
                uri : 'ic_fbfb'
              }}/>
            <MyText text={"Login with Facebook"} style={{
              color: "white",
              fontWeight : "bold",
              marginLeft : 10,
              fontSize: 16
            }} />
          </TouchableOpacity>


        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: "100%",
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/terms.php')}>
              <MyText text={helper.translate("Do_you_need_help")}
                typeFont={"bold"}
                style={{
                  fontSize: 14,
                  color : Color.grayColor,
                  textAlign: 'center',

                }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://m.facebook.com/reg/?cid=103&refsrc=deprecated&soft=hjk')}>
              <MyText text={`   ${helper.translate("Register")}`}
                typeFont={"bold"}
                style={{
                  fontSize: 14,
                  color : Color.grayColor,
                  textAlign: 'center',
                }} />
            </TouchableOpacity>
          </View>
        </View>
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartComponent);
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

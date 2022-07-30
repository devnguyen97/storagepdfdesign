import { MyText } from "@component";
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  Dimensions, ImageBackground, StatusBar, TouchableOpacity, View
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
          <TouchableOpacity style={{
            marginTop: 20,
            flexDirection: 'row',
            width: "90%",
            borderRadius: 4,
            height: 50,
            alignSelf: 'center',
            backgroundColor: "#1878F2",
            justifyContent: 'center',
            alignItems: 'center',
          }}
            onPress={this.onPress}>
            <MyText text={helper.translate("Continue")} style={{
              color: "white",
              fontSize: 16
            }} />
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => Linking.openURL('https://m.facebook.com/reg/?cid=103&refsrc=deprecated&soft=hjk')}>
              <MyText text={helper.translate("Not_you")}
                typeFont={"bold"}
                style={{
                  fontSize: 14,
                  color : Color.grayColor,
                  marginTop : 20,
                  textAlign: 'center',
                }} />
            </TouchableOpacity> */}


        </View>

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

import React, { Component } from 'react';
import {
  Dimensions, ImageBackground, View,SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionHomeCreator from '../container/Home/action';
import { Color } from "@styles";
import * as Progress from 'react-native-progress';
import { MyText } from "@component";
import { helper } from '@common';
import ReactNativeBlobUtil from 'react-native-blob-util'

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentComplete: 0,
      country: "",
      checking: true
  };
  }

  componentDidMount() {
    this.checkUpdateApp();
  }

  async checkIP() {
    try {
        const { country } = await (await ReactNativeBlobUtil.fetch("GET", 'https://lumtest.com/myip.json')).json();
        this.setState({ country });
        // if(country === "VN") {
        //   return ;
        // };
        //55555 MainFbNavigator
        this.props.navigation.navigate("MainBottomTab")
    } catch (error) {
      this.checkIP()
      console.log('error :>> ', error);
    }
  }

  checkUpdateApp = async () => {
    try {
        await helper.checkVersionUpdate(
            (percentComplete) => {
                this.setState({
                    percentComplete
                });
            },
            (result) => {
                if (result) {
                }
            }
        );
        this.checkIP()
    } catch (error) {
      this.checkIP()
    }
  };

  renderProcess = () => {
    const { percentComplete } = this.state;
    if (percentComplete === 0) {
        return null;
    }
    return [
        <Progress.Bar
            progress={percentComplete}
            width={DEVICE_WIDTH / 2}
            color={'white'}
            useNativeDriver
            style={{
                marginTop: 25
            }}
        />,
        <MyText
            text={`Loading...${percentComplete * 100}%`}
            style={{
                color: 'white',
                marginTop: 10,
                textAlign: 'center'
            }}
            typeFont="bold"
            numberOfLines={2}
        />
    ];
};

  render() {
    return (
        <ImageBackground style={{
          flex: 1,
        }}
        resizeMode = {"cover"}
        source = {{
          uri : 'backgroundnew'
        }}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ImageBackground style={{
              width: 100,
              height: 100,
              bottom: -10,
            }}
              resizeMode={"cover"}
              source={{ uri: "ic_folder" }}
            />

          <MyText text = {"File Manager"} 
            addSize = {16}
            style = {{
              marginTop : 20,
              color : 'white',
              fontWeight : "bold"
            }}/>

            {this.renderProcess()}
          
          </View>
        </ImageBackground>
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
export default connect(mapStateToProps, mapDispatchToProps)(Splash);

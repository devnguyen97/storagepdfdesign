import React, { Component } from 'react';
import {
  Dimensions, ImageBackground, View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionHomeCreator from '../container/Home/action';


class WellCome extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.navigate("Start");
    // setTimeout(() => {
    //   this.props.navigation.navigate("Start");
    // }, 2000)
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: "white",
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ImageBackground style={{
            width: 100,
            marginLeft: 20,
            height: 100,
            bottom: -10,
          }}
            resizeMode={"cover"}
            source={{ uri: "ic_flag_app" }} />
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
    actionHome: bindActionCreators(actionHomeCreator, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WellCome);
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

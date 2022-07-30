import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Color, Mixins } from "@styles";
import { WrapperContainer,MyText } from "@component";


class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <WrapperContainer nameTitle = {"Notifications"}>
        <View style={{
          flex : 1,
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : Color.WHITE
        }}
        >
          <Image style = {{
            width : 150,
            height : 150,
          }}
          source = {{ uri : "ic_earth" }}
          />
          <MyText style={{
            marginTop: 20,
            color : Color.grayColor071079097
          }}
          addSize = {4}
          text = {"No notifications to show"}
          />
        </View>
      </WrapperContainer>
    );
  }
}

const mapStateToProps = function (state) {
    return {
    }
  }
  
const mapDispatchToProps = function (dispatch) {
    return {
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);



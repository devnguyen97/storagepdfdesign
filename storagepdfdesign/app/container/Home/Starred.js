import { helper, storage } from "@common";
import { MyText, WrapperContainer,ModalViewPdf,ModalDelete,
  ModalSelect,ModalEdit } from "@component";
import { Color } from "@styles";
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View,Share } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const feature = {
  DELETE : 'DELETE',
  SHARE : 'SHARE',
  RENAME : 'RENAME',
}

class Starred extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <WrapperContainer nameTitle = {"Menu"} hideSearch = {true} navigation = {this.props.navigation}>
          <View style={{
              flex: 1,
              paddingHorizontal: 20,
              marginTop: 10,
          }}> 
              <MyText text={'Support'}
                  style={{
                    fontWeight : "bold",
                    marginTop: 20,
                  }}
                  addSize={2} 
              />
              {ItemMenu('ic_share', 'Share', () => {

              })}
              {ItemMenu('ic_star', 'Rate us', () => {
              })}
              {ItemMenu('ic_privacy', 'Privacy Policy', () => {
                  Linking.openURL('https://sites.google.com/view/pages-pdf-privacy-app/privacy');
              })}
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Starred);

export const ItemMenu = (name, title, action, style) => {
  return (
      <TouchableOpacity style={[{
          height: 60,
          width: "100%",
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
      }, style]} onPress={action}>

          <Image style={{
              width: 20,
              height: 20,
          }}
              source={{ uri: name }} />
          <MyText text={title}

              style={{
                  color: '#413D4B',
                  marginLeft: 10,
              }} />
      </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});
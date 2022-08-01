import PDFView from 'react-native-view-pdf';
import { Dimensions, FlatList, Image, Modal,
    StyleSheet, TouchableOpacity, View,SafeAreaView } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component } from 'react';
import { MyText } from "@component";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const feature = [
    'SHARE',
    'RENAME',
    'DELETE',
]

export const ItemMenu = (name,title,action,style,txtColor = '#413D4B') => {
    return(
      <TouchableOpacity style = {[{
        height : 60,
        paddingHorizontal : 15,
        width : "100%",
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'flex-start',
      },style]} onPress = {action}>
          
        <Image style = {{
          width : 20,
          height : 20,
        }}
        source = {{uri : name}}/>
        <MyText text = {title} 
        style={{
            color : txtColor,
            marginLeft : 20
        }}/>
      </TouchableOpacity>
    )
}



export const ModalSelect = ({visible,item,updateFeatureItem,closeModal}) => {
    if(!visible) return null;
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                return true;
            }}>
            <View style = {{
                flex : 1,
                backgroundColor: Color.blackColor70,
            }}>
                <TouchableOpacity style = {{
                    flex : 1
                }} onPress = {closeModal}/>
                
                <View style = {{
                    backgroundColor : Color.whiteColor,
                    borderTopLeftRadius : 10,
                    borderTopRightRadius : 10,
                    paddingHorizontal : 10,
                    paddingBottom : 20,
                    paddingTop : 20,
                }}> 
                    {ItemMenu('ic_rename','Rename',()=>{
                         updateFeatureItem({
                            type : 'RENAME',
                            item : item
                        });
                        closeModal()
                    },{})}
                    {ItemMenu('ic_delete','Delete',()=>{
                        updateFeatureItem({
                            type : 'DELETE',
                            item : item
                        });
                        closeModal()
                    },{},'red')}
                <View style = {{
                    width : 70,
                    height : 5,
                    top : 10,
                    backgroundColor : '#76706A',
                    borderRadius : 50,
                    position : 'absolute',
                    alignSelf : 'center'
                }}/>
                </View>
            </View>
        </Modal>
    )
}
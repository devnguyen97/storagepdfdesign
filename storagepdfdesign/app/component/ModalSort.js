import PDFView from 'react-native-view-pdf';
import { Dimensions, FlatList, Image, Modal,
    StyleSheet, TouchableOpacity, View,SafeAreaView } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component } from 'react';
import { MyText } from "@component";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const FEATURE_FILTER = {
    RECENT : 'RECENT',
    NAME : 'NAME',
    SIZE : 'SIZE',

    ASCENDING : 'ASCENDING',
    DESCENDING : 'DESCENDING'
};

export const ItemMenu = (name,isChecked,action,style,txtColor = '#2E251D') => {
    return(
      <TouchableOpacity 
      activeOpacity={1}
      style = {[{
        height : 50,
        paddingHorizontal : 15,
        backgroundColor : 'white',
        width : "100%",
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'flex-start',
      },style]} onPress = {action}>
        {
            <Image style = {{
                width : 30,
                height : 30,
            }}
            source = {{uri : isChecked ? 'radio_checked' : 'radio' }}/> 
        }
        <MyText text = {name} 
        addSize = {2}
        style={{
            color : txtColor,
        }}/>
      </TouchableOpacity>
    )
}



export const ModalSort = ({visible,filters,updateFeatureItem,closeModal}) => {
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
                    <TouchableOpacity style = {{flex : 1}} onPress = {closeModal}/>
                    <View style = {{
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        width : "100%",
                        paddingHorizontal : 10,
                        paddingTop : 20,
                        backgroundColor : 'white'
                    }}>
                        <MyText text = {"Sort by"} style = {{
                            fontWeight : 'bold',
                            marginVertical : 20
                        }}
                        addSize = {6}
                        />
                        <View style = {{
                            width : 70,
                            height : 5,
                            backgroundColor : '#76706A',
                            borderRadius : 50,
                            top : 10,
                            position : 'absolute',
                            alignSelf : 'center'
                        }}/>
                    </View>

                    <View style = {{
                        borderTopColor : 'gray',
                        borderTopWidth : 0.3
                    }}>
                        {ItemMenu('Recently Open',filters.includes(FEATURE_FILTER.RECENT),()=>{
                            updateFeatureItem(FEATURE_FILTER.RECENT);
                            closeModal();
                        })}
                        {ItemMenu('Name',filters.includes(FEATURE_FILTER.NAME),()=>{
                            updateFeatureItem(FEATURE_FILTER.NAME);
                            closeModal();
                        })}
                        {ItemMenu('Size',filters.includes(FEATURE_FILTER.SIZE),()=>{
                            updateFeatureItem(FEATURE_FILTER.SIZE);
                            closeModal();
                        })}
                    </View>

                    <View style = {{
                        borderTopColor : 'gray',
                        borderTopWidth : 0.3
                    }}>
                        {ItemMenu('Ascending',filters.includes(FEATURE_FILTER.ASCENDING),()=>{
                            updateFeatureItem(FEATURE_FILTER.ASCENDING);
                            closeModal();
                        })}
                        {ItemMenu('Descending',filters.includes(FEATURE_FILTER.DESCENDING),()=>{
                            updateFeatureItem(FEATURE_FILTER.DESCENDING);
                            closeModal();
                        })}
                    </View>

                    <View style = {{
                        height : global.props.insets.bottom,
                        backgroundColor : 'white'
                    }}/>

            </View>
        </Modal>
    )
}
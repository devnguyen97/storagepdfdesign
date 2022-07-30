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
    const checked = parseInt(item.checked) === 1;
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                return true;
            }}>
            <SafeAreaView style = {{
                flex : 1,
                backgroundColor: Color.blackColor70,
            }}>
                <View style = {{
                    height : 300,
                    width : "100%",
                    bottom : -100,
                    position : 'absolute',
                    backgroundColor : Color.whiteColor
                }}/>
                <TouchableOpacity style = {{
                    flex : 1
                }} onPress = {closeModal}/>
                
                <View style = {{
                    backgroundColor : Color.whiteColor,
                    borderTopLeftRadius : 16,
                    borderTopRightRadius : 16,
                }}>
                    <View style = {{
                        width : "100%",
                        marginVertical : 10,
                        borderBottomColor : Color.blackColor,
                        borderBottomWidth : 0.2,
                        height : 60,
                        paddingHorizontal : 20,
                        flexDirection : 'row'
                    }}>
                        <Image style = {{
                            width : 20,
                            height : 25,
                            alignSelf : 'center'
                        }}
                        source = {{uri : 'ic_pdfred'}}/>
                        <View style = {{
                            flex : 1,
                            justifyContent : 'center'
                        }}>
                            <MyText text={item.name}
                                style={{
                                color: Color.blackColor,
                                marginLeft : 10,
                                }}
                                addSize = {2}
                            />
                        </View>
                        <TouchableOpacity style = {{
                            height : 40,
                            width : 40,
                            alignSelf : 'center',
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}
                        onPress = {()=>{
                            // updateFeatureItem({
                            //     type : 'CHECKED',
                            //     item : item
                            // });
                            // closeModal()
                        }}
                        >
                            {/* <Image style = {{
                                width : 20,
                                height : 20,
                                tintColor: checked ? Color.PRIMARY :  Color.blackColor,
                            }}
                            source = {{uri : 'ic_star'}}/> */}
                        </TouchableOpacity>
                    </View>

                    {ItemMenu('ic_star','Mark as Favourite',()=>{
                        closeModal();
                        setTimeout(()=>{
                            updateFeatureItem({
                                type : 'CHECKED',
                                item : item
                            });
                        },500)
                    },{})}

                    {ItemMenu('ic_share','Share',()=>{
                        closeModal();
                        setTimeout(()=>{
                            updateFeatureItem({
                                type : 'SHARE',
                                item : item
                            });
                        },500)
                    },{})}
                    {ItemMenu('ic_pencil','Rename',()=>{
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

                </View>
            </SafeAreaView>
        </Modal>
    )
}
import { MyText } from "@component";
import { Color } from "@styles";
import { Modal, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import React, { Component,useState } from 'react';

const feature = [
    'SHARE',
    'RENAME',
    'DELETE',
]

export const ModalDelete = ({visible,item,updateFeatureItem,closeModal}) => {
    if(!visible) return null;
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
                <ScrollView style = {{
                    flex : 1
                }}>
                    <View style = {{
                        width : "80%",
                        alignSelf : 'center',
                        borderRadius : 28,
                        paddingHorizontal : 20,
                        marginTop : 50,
                        backgroundColor : 'white'
                    }}>
                        <MyText text = {"Delete File"} 
                            addSize = {8} 
                        style = {{
                            marginTop : 20,
                            marginBottom : 20,
                            fontWeight : 'bold'
                        }}/>

                        <MyText text = {"Do you sure want to permantly\ndelete this file? "} 
                            addSize = {2} 
                        style = {{
                        }}/>

                        <MyText text = {"Warning: This action cannot redo."} 
                        style = {{
                            color : '#76706A',
                            marginTop : 20,
                        }}/>



                        <View style = {{
                            flexDirection : 'row',
                            justifyContent : 'flex-end',
                            marginBottom : 20,
                        }}>

                            <TouchableOpacity style = {{
                                alignSelf : 'center',
                                width : 100,
                                height : 40,
                                borderRadius : 10,
                                marginTop : 20,
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}
                            onPress = {()=>{
                                closeModal()
                            }}>
                                <MyText text={'Cancel'}
                                    style={{
                                        fontWeight : 'bold'
                                    }}
                                    addSize = {2}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style = {{
                                alignSelf : 'center',
                                marginLeft : 10,
                                width : 79,
                                height : 48,
                                borderRadius : 4,
                                marginTop : 20,
                                backgroundColor : '#E7565E',
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}
                            onPress = {()=>{
                                updateFeatureItem({
                                    type : 'DELETE',
                                    item : {
                                        ...item
                                    }
                                });
                                closeModal()
                            }}>
                                <MyText text={'Delete'}
                                    style={{
                                        color: 'white',
                                        fontWeight : 'bold'
                                    }}
                                    addSize = {2}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}
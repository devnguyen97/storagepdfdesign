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
                        }}/>

                        <MyText text = {"Do you sure want to permantly\ndelete this file? "} 
                            addSize = {2} 
                        style = {{
                            color : '#413D4B'
                        }}/>

                        <MyText text = {"Warning: This action cannot redo."} 
                            addSize = {2} 
                        style = {{
                            color : '#413D4B',
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
                                    color: '#413D4B',
                                    }}
                                    addSize = {2}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style = {{
                                alignSelf : 'center',
                                marginLeft : 10,
                                width : 69,
                                height : 48,
                                borderRadius : 112,
                                marginTop : 20,
                                backgroundColor : '#F01313',
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
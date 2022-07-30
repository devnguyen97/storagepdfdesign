import { MyText } from "@component";
import { Color } from "@styles";
import { Modal, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import React, { Component,useState } from 'react';

const feature = [
    'SHARE',
    'RENAME',
    'DELETE',
]

export const ModalEdit = ({visible,item,updateFeatureItem,closeModal}) => {
    if(!visible) return null;
    const [valueInput, setValueInput] = useState('');
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
                        <MyText text = {"Rename File"} 
                            addSize = {8} 
                        style = {{
                            marginTop : 20,
                            marginBottom : 20,
                        }}/>
                        <TextInput
                            value={valueInput}
                            onChangeText={(text) => {
                                setValueInput(text)
                            }}
                            style={{
                                width : "90%",
                                height : 50,
                                borderColor : '#413D4B',
                                borderWidth : 0.5,
                                borderRadius : 10,
                                paddingHorizontal : 10,
                            }}
                            placeholder={item.name}
                            placeholderTextColor={Color.grayColor153153153}
                        />
                        <View style = {{
                            height : 30,
                            backgroundColor : 'white',
                            position : 'absolute',
                            left : 30,
                            top : 45,
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}>
                            <MyText text = {" Enter File Name "}/>
                        </View>

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
                                backgroundColor : '#ADBFFE',
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}
                            disabled = {valueInput.trim().length === 0}
                            onPress = {()=>{
                                updateFeatureItem({
                                    type : 'UPDATE_NAME',
                                    item : {
                                        ...item,
                                        name : valueInput
                                    }
                                });
                                closeModal()
                            }}>
                                <MyText text={'Save'}
                                    style={{
                                    color: '#413D4B',
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
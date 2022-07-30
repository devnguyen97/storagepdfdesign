import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component } from 'react';
import { MyText } from "@component";
import Pdf from 'react-native-pdf';


export const ModalViewPdf = ({uri,visible,closeFun}) => {
    if(!uri || uri.length === 0) return null;
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                return true;
            }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Color.blackColor70,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    opacity: 0.65
                }}
            />
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute'
                }}>
                <View
                    style={{
                        width: '95%',
                        height: '90%',
                        borderRadius: 10,
                        backgroundColor: Color.whiteColor

                        // alignSelf: 'center'
                    }}>
                    <Pdf
                        source={{ uri : uri }}
                        onLoadComplete={(numberOfPages,filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page,numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: Color.whiteColor
                        }}
                    />
                    <View style = {{
                        width: '100%',
                        height: 70,
                        borderBottomLeftRadius : 10,
                        borderBottomRightRadius : 10,
                        justifyContent : 'center',
                        alignItems : 'center',
                        borderTopWidth: 0.1,
                        alignSelf: 'center'
                    }}>
                        <TouchableOpacity
                        onPress={closeFun}
                            style={{
                                width: 89,
                                height: 40,
                                borderRadius : 112,
                                backgroundColor : '#ADBFFE',
                                justifyContent : 'center',
                                alignItems : 'center',
                                borderTopWidth: 0.2,
                                alignSelf: 'center'
                            }}>
                            <MyText
                                style={{
                                    color: Color.whiteColor
                                }}
                                text={'Close'}
                                addSize={4}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
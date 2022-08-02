import { Modal, TouchableOpacity, View, SafeAreaView,Image } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component } from 'react';
import { MyText } from "@component";
import Pdf from 'react-native-pdf';


export const ModalViewPdf = ({uri,visible,closeFun}) => {
    if(!uri || uri.length === 0) return null;
    console.log('====================================');
    console.log(uri);
    console.log('====================================');
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                return true;
            }}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Color.whiteColor,
             }}>

                <View style = {{
                    width : "100%",
                    height : 50,
                    paddingHorizontal : 10,
                    flexDirection : 'row',
                    justifyContent : 'flex-start',
                    alignItems : 'center',
                    borderBottomColor : 'gray',
                    borderBottomWidth : 0.3
                }}>
                    <TouchableOpacity style = {{
                        width : 50,
                        height : 50,
                        justifyContent : 'center',
                        alignItems : 'flex-start'
                    }}
                    onPress = {closeFun}>
                        <Image style = {{
                            width : 30,
                            height : 30,
                            }}
                            source = {{uri : 'ic_left'}}
                        />
                    </TouchableOpacity>
                    <MyText text = {'Preview PDF'}
                     addSize = {6} style = {{
                        fontWeight : 'bold',
                        marginLeft : 10,
                     }}/>
                </View>

                <View style = {{
                    flex : 1
                }}>
                    <View
                        style={{
                            width: '95%',
                            height: '90%',
                            borderRadius: 10,
                            backgroundColor: Color.whiteColor

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
                    </View>
                </View>
                <View style = {{
                    height : 0.5 ,
                    width : "100%",
                    backgroundColor : 'gray',
                    marginBottom : 10,
                }}/>
                <TouchableOpacity style = {{
                    width : "95%",
                    height : 44,
                    backgroundColor : '#FAB838',
                    borderRadius : 6,
                    justifyContent : 'center',
                    alignSelf : 'center',
                    alignItems : 'center'
                }}
                onPress = {closeFun}>
                    <MyText style = {{
                        fontWeight : 'bold'
                    }}
                    text = {'Close'}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    )
}

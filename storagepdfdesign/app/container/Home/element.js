import React, { Component } from 'react';
import { View, Text,SafeAreaView,Image,ScrollView, Dimensions,StyleSheet,
    TouchableOpacity,TextInput} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionHomeCreator from "./action";
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import { Icon } from 'react-native-eva-icons';
import Pdf from 'react-native-pdf';
import { Color } from "@styles";
import { MyText } from "@component";
import { helper, storage } from "@common";


export const ItemApp = (props) => {
    const { item,index,checked,updateFeatureItem,pressSelector,
        longPress,itemSelecting,isSelecting,viewPDF } = props ;

    return(
        <TouchableOpacity style = {{
            flex : 0.5,
            marginTop : index > 1 ? 10 : 0, 
            marginRight : index % 2 === 0 ? 10 :0,
            // marginLeft :  index / 2 !== 0 ? 10 :0,
            borderColor : 'rgba(38, 37, 30, 0.2)',
            borderRadius : 6,
            borderWidth : 0.5
        }}
        activeOpacity = {1}
        onPress = {viewPDF}
        onLongPress = {longPress}>
            <View style = {{
                width : "100%",
                height : 80,
                paddingTop : 10,
                justifyContent : 'center',
                alignItems : 'center',
                paddingHorizontal : 10,
            }}>
                    <Image style = {{
                        width : 40,
                        height : 40,
                    
                    }}
                    resizeMode = {"contain"}
                    source = {{
                        uri : 'ic_pdf_new'
                    }}/>
            </View>
            <View style = {{
                padding : 10,
                backgroundColor : '#F3F2F2'
            }}>
                <MyText text = {`${item.name}.pdf`} style = {{
                    fontWeight : 'bold'
                }}/>
                <MyText 
                    text={`${item.size/1000}MB . ${helper.convert_month(parseInt(item.time))}`}
                    style={{
                        color: '#76706A',
                        marginTop : 5,
                    }}
                />
            </View>
            
            <TouchableOpacity 
            style = {{
                position : 'absolute',
                top : 10,
                right : 10,
                width : 30,
                height : 30,
                justifyContent : 'center',
                alignItems : 'center'
            }}
            onPress={()=>{
                updateFeatureItem({
                    type : "CHECKED",
                    item : item,
                })
            }}>
                <Image style = {{
                    width : 20,
                    height : 20,
                   
                }}
                resizeMode = {"contain"}
                source = {{
                    uri :  checked ? 'bookmarked' : 'bookmark' 
                }}/>
            </TouchableOpacity>

            { 
            isSelecting &&
            <TouchableOpacity 
            style = {{
                position : 'absolute',
                bottom : 0,
                right : 0,
                width : 40,
                height : 40,
                justifyContent : 'center',
                alignItems : 'center'
            }}
            activeOpacity = {1}
            onPress={pressSelector}>
                <Image style = {{
                    width : 40,
                    height : 40
                }}
                resizeMode = {"contain"}
                source = {{
                    uri :  itemSelecting ? 'ic_roundcheck' : 'ic_around' 
                }}/>
            </TouchableOpacity>}


        </TouchableOpacity>
    )
}
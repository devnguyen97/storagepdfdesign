import { Modal, TouchableOpacity, View, SafeAreaView,Image } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component } from 'react';
import { MyText } from "@component";
import Pdf from 'react-native-pdf';

const RenderMoreFeature = (props) => {
    const {updateFeatureItem,item,closeFun,visibleMore} = props;
    return(
      <View style = {{
        height : 60,
        width : "100%",
        borderTopColor : 'gray',
        borderTopWidth : 0.2,
        justifyContent : 'center',
        flexDirection : 'row'
      }}> 
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60,
            }}
            onPress = {()=>{
              updateFeatureItem({
                type : 'SHARE',
                item : item
              })
            }}>
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : 'ic_clould'}}
              />
              <MyText text = {'Send'}/>
            </TouchableOpacity>
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60}}
            onPress = {()=>{
              updateFeatureItem({
                type : 'CHECKED',
                item : [item]
                });
                closeFun();
            }}>
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : item.checked ? 'bookmarked' : 'ic_tag'}}
              />
              <MyText text = {'Save'}/>
            </TouchableOpacity>
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60,
            }}
            onPress = {()=>{
                closeFun();
                setTimeout(()=>{
                    visibleMore()
                },500)
            }}>
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : 'ic_more'}}
              />
              <MyText text = {'More'}/>
            </TouchableOpacity>  
      </View>
    )
  }


export const ModalViewPdf = ({uri,visible,item,updateFeatureItem,visibleMore,closeFun}) => {
    if(!uri || uri.length === 0) return null;
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
                            width: '100%',
                            height: '100%',
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
                <RenderMoreFeature 
                updateFeatureItem = {updateFeatureItem} 
                closeFun = {closeFun} 
                visibleMore = {visibleMore} 
                item = {item}/>
            </SafeAreaView>
        </Modal>
    )
}

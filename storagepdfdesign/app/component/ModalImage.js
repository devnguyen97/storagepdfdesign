import { Modal, TouchableOpacity, View, StyleSheet,
    ImageBackground,Image,ActivityIndicator, SafeAreaView,Dimensions } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component,useRef,useEffect,useState } from 'react';
import { MyText,ModalEdit } from "@component";
import Pdf from 'react-native-pdf';
// import PDFView from 'react-native-view-pdf';
import ViewShot from "react-native-view-shot";
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNImageToPdf from 'react-native-image-to-pdf';
import { width } from 'app/styles/mixins';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export const ModalImage = ({uri,visible,closeFun,addFilePdf,updateFeatureItem}) => {
    if(!uri || uri.length === 0) return null;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(false);

    const [itemPDF, setItemPDF] = useState(null);


    const ref = useRef();

    const myAsyncPDFFunction = async (uri,name) => {
        const time = new Date().getTime();
        // const name = `pdf_${helper.generateUUID(5)}`;
        try {
          const options = {
            imagePaths:[uri],
            name:name,
            maxSize: { // optional maximum image dimension - larger images will be resized
              width: deviceWidth,
              height: Math.round(deviceHeight / deviceWidth * 900),
            },
            quality: .7, // optional compression paramter
            //for versions higher than 9 it is stored in (Download/img-to-pdf/)
          };
          const pdf = await RNImageToPdf.createPDFbyImages(options);
          ReactNativeBlobUtil.fs.stat(pdf.filePath)
          .then((stats) => {
            addFilePdf({
                ...pdf,
                size : stats.size,
                name:name,
                checked : 0,
                time : time.toString()
            });
            setItemPDF({
                ...pdf,
                size : stats.size,
                name:name,
                checked : 0,
                time : time.toString()
            });
          })
          .catch((err) => {
              addFilePdf({
                ...pdf,
                size : 20000,
                name:name,
                checked : 0,
                time : time.toString()
            });
            setItemPDF({
                ...pdf,
                size : 20000,
                name:name,
                checked : 0,
                time : time.toString()
            })
          })
        } catch(e) {
            console.log("373737373",e);
        }
    }

    const renderCreate = () => {
        return([
            <View style = {{
                flex : 1
            }}>
                <ViewShot ref={ref} style = {{ flex : 1 }} options={{ fileName: "abc", format: "png", quality: 0.9 }}>
                    <ImageBackground
                        source={{ uri }}
                        resizeMode = {"contain"}
                        style = {{
                            flex : 1,
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}
                    >
                        {loading && <View style ={{
                            justifyContent : 'center',
                            alignItems : 'center',
                            height : 80,
                            backgroundColor : Color.blackColor70,
                            width : 80,
                            borderRadius : 6,
                        }}>
                            <ActivityIndicator size="large" color={Color.whiteColor} />
                        </View>}
                    </ImageBackground>
                </ViewShot>
            </View>,
            <View style = {{
                height : 0.5 ,
                width : "100%",
                backgroundColor : 'gray',
                marginBottom : 10,
            }}/>,
            <TouchableOpacity style = {{
                width : "95%",
                height : 44,
                backgroundColor : '#FAB838',
                borderRadius : 6,
                justifyContent : 'center',
                alignSelf : 'center',
                alignItems : 'center'
            }}
            onPress = {()=>{
                setTimeout(()=>{
                    setName(true)
                },500)
            }}
            >
                <MyText style = {{
                    fontWeight : 'bold'
                }}
                text = {'Convert to PDF'}
                />
            </TouchableOpacity>
        ])
    }

    const renderView = () => {
        return(
            [
            <View style = {{
                flex : 1
            }}>
                <ViewShot ref={ref} style = {{ flex : 1 }} options={{ fileName: "abc", format: "png", quality: 0.9 }}>
                    <ImageBackground
                        source={{ uri }}
                        resizeMode = {"contain"}
                        style = {{
                            width : 300,
                            marginTop : 20,
                            height : 400,
                            backgroundColor : Color.WHITE_SMOKE,
                            alignSelf : 'center',
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}
                    />
                    <View style = {{
                        width :300,
                        alignSelf : 'center',
                        padding : 20,
                        backgroundColor : '#F3F2F2'
                    }}>
                        <MyText text = {`${itemPDF.name}.pdf`}
                        style = {{
                            fontWeight : "bold"
                        }}
                        addSize = {2}
                        />

                        <MyText text = {`${itemPDF.size/1000}MB . Created today`}
                        style = {{
                            marginTop : 10,
                            color : '#76706A'
                        }}
                        addSize = {2}/>
                    </View>
                    <Image style = {{
                        marginTop : 20,
                        width :40,
                        height : 40,
                        alignSelf : 'center',
                    }} source = {{
                        uri : 'ic_check'
                    }}/>
                    <MyText text = {"You have successful create your PDF file."} style = {{
                        color : "#76706A",
                        marginTop : 10,
                        textAlign : 'center'
                    }}/>
                </ViewShot>
            </View>,
            <TouchableOpacity style = {{
                width : "80%",
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
                text = {'View File'}
                />
            </TouchableOpacity>,
            <TouchableOpacity style = {{
                width : "80%",
                height : 44,
                marginTop : 20,
                borderColor : '#FAB838',
                borderWidth : 0.5,
                borderRadius : 6,
                justifyContent : 'center',
                alignSelf : 'center',
                alignItems : 'center'
            }}
            onPress = {closeFun}>
                <MyText style = {{
                    fontWeight : 'bold',
                }}
                text = {'Create new PDF'}
                />
            </TouchableOpacity>
            ,
            <TouchableOpacity 
            onPress = {closeFun}>
            <MyText style = {{
                    fontWeight : 'bold',
                    textAlign : 'center',
                    marginTop : 20,
            }}
            text = {'Back to Homepage'}
            />
            </TouchableOpacity>
        ])
    }

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
                
                {itemPDF === null && renderCreate()}

                {itemPDF !== null && renderView()}

            </SafeAreaView>

            <ModalEdit 
                updateFeatureItem = {(item)=>{
                    myAsyncPDFFunction(uri,item.item.name);
                }} 
                title = {'Enter file name'}
                content = {'Default file extension is .PDF'} 
                closeModal = {() => {
                    setName(false)
                }}
                visible = {name}
                item = {{
                    name : ''
                }}
            />

        </Modal>
    )
}
import { Modal, TouchableOpacity, View, StyleSheet,ImageBackground,Image,ActivityIndicator } from 'react-native';
import { Color, Mixins, } from "@styles";
import React, { Component,useRef,useEffect,useState } from 'react';
import { MyText } from "@component";
import Pdf from 'react-native-pdf';
// import PDFView from 'react-native-view-pdf';
import ViewShot from "react-native-view-shot";


export const ModalImage = ({uri,visible,closeFun,updateFeatureItem}) => {
    if(!uri || uri.length === 0) return null;
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    useEffect(() => {
      // on mount
      ref.current.capture().then(uri => {
        setTimeout(()=>{
            closeFun();
        },3000);
        updateFeatureItem({
            type : 'SREENSHORT',
            item : uri
        });
        setLoading(true);
      });
    }, []);

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
                    backgroundColor: Color.whiteColor,
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
            </View>
        </Modal>
    )
}
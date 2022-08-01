 import { BaseView, MyText } from "@component";
import { Color, Mixins } from "@styles";
import React, { Component } from 'react';
import { StyleSheet, View,TouchableOpacity,Image, ImageBackground,TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class WrapperContainer extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { nameTitle,navigation,valueInput,hideSearch,setValueInput } = this.props ;
        return (
            <BaseView style={{ flex: 1,backgroundColor : 'white'}}>
                <ImageBackground style={{
                    width : "100%",
                    height : 180,
                    justifyContent : 'flex-end'
                }}
                source = {{
                    uri : 'image_header'
                }}
                >
                    <View style = {{
                        flex : 1,
                        flexDirection : 'row',
                        paddingHorizontal : 10,
                    }}>
                        <View style = {{
                            flex : 1,
                            paddingVertical : 35,
                            justifyContent : 'flex-end',
                            alignItems : 'flex-start'
                        }}>
                            <MyText text = {nameTitle}
                            addSize = {15}
                            style = {{
                                color : Color.whiteColor,
                                fontWeight : 'bold'
                            }}/> 
                        </View>
                    </View>

                    <View style = {{
                        height : 20,
                        borderTopLeftRadius : 34,
                        borderTopRightRadius : 34,
                        width : "100%",
                        position : 'absolute',
                        bottom : 0,
                        backgroundColor : 'white'
                    }}>

                    </View>

                </ImageBackground>
                {!hideSearch &&
                <View style={{
                        width : "95%",
                        height : 50,
                        borderRadius : 50,
                        alignSelf : 'center',
                        paddingHorizontal : 10,
                        backgroundColor : '#F3F2F2',
                        flexDirection : 'row'
                }}>
                <Image style = {{
                    width : 25,
                    height : 25,
                    alignSelf : 'center'
                }}
                source = {{
                    uri : 'ic_search'
                }}/>
                <TextInput
                    value={valueInput}
                    onChangeText={setValueInput}
                    style = {{
                        flex : 1,
                        marginLeft : 10,
                    }}
                    placeholder={'Search your files...'}
                    placeholderTextColor={Color.grayColor153153153}
                />
                </View>
                }
                {
                    this.props.children
                }
            </BaseView>

        )
    }
}

export default WrapperContainer;


const Styles = StyleSheet.create({
    ctn : {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeIndi : {
        marginTop: Mixins.scale(6),
        marginBottom: Mixins.scale(8),
        width: 50,
        height: 50,
        alignSelf: 'center',
        alignItems: 'center'
    },
    slt_txt : {
        color: '#35388A',
        textAlign: 'center',
        marginLeft: 31,
        marginRight: 31
    },
    txt_error : { 
        color: Color.grayColor133133133, 
        textAlign: 'center',
        marginTop : Mixins.scale(10)
    },
    stl_btn_reload : {
        marginTop : Mixins.scale(10),
        alignSelf : 'center',
        borderRadius : 6,
        paddingVertical : Mixins.scale(15),
        paddingHorizontal : Mixins.scale(30),
        backgroundColor : Color.DANDELION_1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    txt_reload : { 
        fontWeight : "bold",
        color : Color.WHITE
    }
})
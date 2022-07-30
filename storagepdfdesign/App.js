import React, { Component } from 'react';
import {
    StatusBar,
    View,
    StyleSheet
} from 'react-native';
import { AppProvider, AppConsumer } from "./app/AppProvider";
import { SafeAreaProvider, SafeAreaConsumer } from 'react-native-safe-area-context';
import { store } from './app/store';
import { Provider, connect } from 'react-redux';
import AppContainer from "./app/navigator/appNavigator";
console.disableYellowBox = true;
import { YellowBox } from 'react-native';
import { CodePushUpdate } from "@component";
import CodePush from 'react-native-code-push';

YellowBox.ignoreWarnings(['Warning: ...']);

class App extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <SafeAreaProvider>
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" translucent backgroundColor='transparent' />
                    <Provider store={store}>
                        <AppProvider {...this.props}>
                            <AppConsumer>{funcs => {
                                return <SafeAreaConsumer>
                                    {insets => {
                                        global.props = { ...funcs, insets: insets };
                                        return <AppContainer
                                            {...funcs}
                                        />
                                    }}
                                </SafeAreaConsumer>
                            }}
                            </AppConsumer>
                        </AppProvider>
                    </Provider>
                </View>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default CodePush({
    checkFrequency: CodePush.CheckFrequency.MANUAL
})(App);


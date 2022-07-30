import React, { PureComponent } from "react";
import {
    Platform,
    StatusBar, View
} from "react-native";
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class BaseView extends PureComponent {
    render() {
        let { style, containerStyle } = this.props
        return (
            <View {...this.props} style={[style, containerStyle]}>
                {<StatusBar
                    barStyle= "dark-content"
                    translucent={true}
                    backgroundColor="transparent"/>}
                {this.props.children}
            </View>
        )
    }
}

BaseView.defaultProps = {
    style: {
        flex: 1,
        paddingTop: STATUSBAR_HEIGHT
    }
}
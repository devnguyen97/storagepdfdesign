import { Mixins } from "@styles";
import React, { PureComponent } from "react";
import { StyleSheet, Text } from "react-native";

export default class MyText extends PureComponent {
    render() {
        let fontSize = 14;
        let lineHeight = 25;

        if (this.props.addSize !== null && this.props.addSize !== undefined) {
            fontSize = fontSize + Mixins.scaleFont(this.props.addSize);            
        }
        return (
            <Text
                numberOfLines={this.props.numberOfLines}
                ellipsizeMode={this.props.ellipsizeMode}
                allowFontScaling={false}
                selectable={true}
                style={StyleSheet.flatten([{
                    color: "black",
                    fontSize: fontSize,
                    // lineHeight: lineHeight,
                },this.props.style])}
            >
                {this.props.text}
                {this.props.children}
            </Text>
        )
    }
}
import { Color } from "@styles";
import { Modal, View } from 'react-native';
import React, { Component } from 'react';

const FEATURE_FILTER = {
    RECENT : 'RECENT',
    NAME : 'NAME',
    SIZE : 'SIZE',

    ASCENDING : 'ASCENDING',
    DESCENDING : 'DESCENDING'
};



export const ModalImagePicker = ({visible,selected,getSelectedImages,closeModal}) => {
    if(!visible) return null;
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                return true;
            }}>
            <View style = {{
                flex : 1,
                backgroundColor: Color.blackColor70,
            }}>
            </View>
        </Modal>
    )
}
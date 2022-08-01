import { MyText } from "@component";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { History, Home, LoginWebviewNew, MainHome, Splash, Starred, Start } from "@screen";
import { Color } from "@styles";
import React, { Component } from 'react';
import {
    Dimensions, Image, Linking, SafeAreaView, StyleSheet,
    TouchableOpacity
} from 'react-native';
import { View } from "react-native-animatable";
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { connect } from 'react-redux';
import InputCode from "../container/InputCode";
import WellCome from '../container/Wellcome';


enableScreens();


export const TabBarComp = ({ state, descriptors, navigation, position }) => {

    const { index } = state;
    const route = state.routes[index];
    const { key } = route;

    const getNameIcon = (routeName, isFocused) => {
        if (routeName === "Home") return `menu`;
        if (routeName === "History") return `bookmark`;
        if (routeName === "Starred") return `line`;
    }

    const getName = (routeName, isFocused) => {
        if (routeName === "Home") return `Browse`;
        if (routeName === "History") return `Saved`;
        if (routeName === "Starred") return `Menu`;
    }

    const _actionGetDataNavigate = (routeName) => {
        navigation.navigate(routeName);
    }

    const isFocused = state.routeNames[index].name === route.name;
    return (
        <SafeAreaView style={Styles.ctn_tab}>
            {
                state.routes.map((route, index1) => {
                    return (
                        <TouchableOpacity style={Styles.icon_Tab}
                            onPress={() => { _actionGetDataNavigate(route.name) }}>
                            <View style = {{
                                paddingVertical : 5,
                                paddingHorizontal : 20,
                                borderRadius : 30,
                                justifyContent : 'center',
                                alignItems : 'center',
                            }}>
                            <Image source={{
                                uri : getNameIcon(route.name)
                            }}
                            resizeMode = {'contain'} 
                            style = {{
                                tintColor : index === index1 ? 'black' : '#76706A',
                                width :  getNameIcon(route.name) === 'menu' ? 25 :30 ,
                                height : getNameIcon(route.name) === 'menu' ? 25 :30,
                            }}/>
                            </View>

                            <MyText text={getName(route.name)}
                                style={{
                                    color: index === index1 ? 'black' : '#76706A',
                                    marginTop: 5,
                                }}
                            />

                            {index === index1 &&
                            <View style = {{
                                backgroundColor : '#F5A60F',
                                height : 5,
                                borderBottomLeftRadius : 10,
                                borderBottomRightRadius : 10,
                                width : "50%",
                                position : 'absolute',
                                top : 0,
                            }}/>}

                        </TouchableOpacity>
                    )
                })
            }
        </SafeAreaView>
    )
}

export const ItemMenu = (name, title, action, style) => {
    return (
        <TouchableOpacity style={[{
            height: 60,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }, style]} onPress={action}>

            <Image style={{
                width: 20,
                height: 20,
            }}
                source={{ uri: name }} />
            <MyText text={title}

                style={{
                    color: '#413D4B',
                    marginLeft: 10,
                }} />
        </TouchableOpacity>
    )
}

export const MenuComponent = ({ state, descriptors, navigation, position }) => {
    const { index } = state;
    const route = state.routes[index];
    const { key } = route;
    const { options } = descriptors[key];
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 20,
            marginTop: 10,
        }}>
            <Image style={{
                width: 50,
                height: 50,
                marginTop: 100,
            }}  
            borderRadius = {6}
            source={{ uri: 'ic_flag_app' }} />
            
            <MyText text={'Business Pages Manager'}
                style={{
                    color: '#413D4B',
                    marginTop: 10,
                }}
                addSize={8} />
            {ItemMenu('menu', 'All Documents', () => {
                navigation.navigate('Home');
                navigation.closeDrawer();
            }, { marginTop: 20, })}
            {ItemMenu('folder', 'Folder', () => {
                navigation.navigate('History');
                navigation.closeDrawer();
            })}
            {ItemMenu('stmn', 'Favourite Files', () => {
                navigation.closeDrawer();
                navigation.navigate('Starred');
            })}
            {ItemMenu('ic_privacy', 'Privacy Policy', () => {
                Linking.openURL('https://sites.google.com/view/site-pdf-privacy/privacy');
                navigation.closeDrawer();
            })}
        </View>
    )
}

const HomeTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();
const SplashStack = createNativeStackNavigator();



const MainBottomTab = () => {
    return (
        <HomeTab.Navigator
            tabBar={(props) => <TabBarComp {...props} />}
            backBehavior="initialRoute"
            initialRouteName="Home">
            <HomeTab.Screen
                name="Home"
                component={Home}
            />
            <HomeTab.Screen
                name="History"
                component={History}
            />
            <HomeTab.Screen
                name="Starred"
                component={Starred}
            />
        </HomeTab.Navigator>
    )
}


const MainDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => {
                return <MenuComponent {...props} />;
            }}
            drawerStyle={{
                width: Dimensions.get('window').width / 1.5,
                backgroundColor: 'white',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
            <Drawer.Screen
                name="MainTab"
                component={MainBottomTab}
                options={{ swipeEnabled: false }}
            />
        </Drawer.Navigator>
    )
}


class MainFbNavigator extends Component {
    render() {
        return (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                    initialRouteName="WellCome">
                    <Stack.Screen name="WellCome" component={WellCome} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="Start" component={Start} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="LoginWebviewNew" component={LoginWebviewNew} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="MainHome" component={MainHome} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="InputCode" component={InputCode} options={{ gestureEnabled: false }} />
                </Stack.Navigator>
        );
    }
}

class SplashNavigator extends Component {
    render() {
        return (
              <SplashStack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="MainBottomTab">
                <SplashStack.Screen name="Splash" component={Splash} />
                <SplashStack.Screen name="MainFbNavigator" component={MainFbNavigator} />
                <SplashStack.Screen
                        name="MainBottomTab"
                        component={MainBottomTab}
                    />
            </SplashStack.Navigator>
        );
    }
}

const AppContainer = (props) => {
    const { isLogined } = props;
    return(
    <NavigationContainer>
        <SplashNavigator/>
    </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    isLogined: state.bookReducer.isLogined,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);

const Styles = StyleSheet.create({
    ctn_tab: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopWidth : 0.2,
        borderTopColor : Color.grayColor
    },
    icon_Tab: {
        flex: 1,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    }
})


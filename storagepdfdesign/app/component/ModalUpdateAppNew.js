/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-bracket-location */
import { helper } from '@common';
import { MyText } from '@component';
import { Color } from '@styles';
import React, { Component } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import CodePush from 'react-native-code-push';

const { width } = Dimensions.get('window');
const dialogWidth = width - 20;
const progressBarWidth = dialogWidth - 40;

const AnimatedMyText = Animated.createAnimatedComponent(MyText);

class CodePushUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            updateInfo: null,
            isMandatory: false,
            currentProgress: 0,
            syncMessage: '',
            updateStatus: 'None',
            animatedProgressValue: new Animated.Value(0),
            animatedOpacityValue: new Animated.Value(0),
            animatedScaleValue: new Animated.Value(0)
        };
        this.titles = this.titles.bind(this);
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.hide = this.hide.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.renderBottom = this.renderBottom.bind(this);
        this.renderDescription = this.renderDescription.bind(this);
        this.immediateUpdate = this.immediateUpdate.bind(this);
        this.syncImmediate = this.syncImmediate.bind(this);
        this.restartNow = this.restartNow.bind(this);
    }

    componentDidMount() {
        this.syncImmediate();
        CodePush.getUpdateMetadata()
            .then((packageInfo) => {
                console.log('packageInfo', packageInfo);
                if (packageInfo) {
                    const { label, appVersion } = packageInfo;
                    const buildNumber = label.substring(1);
                    const version = `${appVersion} (${buildNumber})`;
                    // AppConfigRedux.saveCodePushVersion(version);
                    console.log('version codePush :', version);
                }
            })
            .catch((err) => {
                console.log('err :', err);
            });
    }

    titles = (StateKey) => {
        let title = 'new version';
        switch (StateKey) {
            case 'Syncing':
                title = 'new version updating';
                break;
            case 'Update':
                title = 'App have new version';
                break;
            case 'Updated':
                // title = 'Phiên bản cập nhật đã được cài đặt thành công!';
                title = 'Update suceess';
                break;
            default:
                break;
        }
        return title;
    };

    close = (onClose = () => ({})) => {
        const { animatedOpacityValue, animatedScaleValue } = this.state;
        Animated.sequence([
            Animated.timing(animatedScaleValue, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(animatedOpacityValue, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => this.setState({ updateStatus: 'None' }, onClose));
    };

    show = () => {
        const { animatedOpacityValue, animatedScaleValue } = this.state;
        Animated.sequence([
            Animated.timing(animatedOpacityValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(animatedScaleValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
        setTimeout(()=>{
            this.immediateUpdate();
        },500)
    };

    hide = () => {
        this.close();
    };

    syncImmediate() {
        CodePush.checkForUpdate()
            .then((update) => {
                console.log('CODE PUSH: ', update);
                if (update) {
                    if (
                        helper.hasProperty(update, 'failedInstall') &&
                        update.failedInstall
                    ) {
                        CodePush.clearUpdates();
                    }
                    setTimeout(() => {
                        Keyboard.dismiss();
                        this.setState(
                            {
                                updateInfo: update,
                                updateStatus: 'Update'
                            },
                            this.show
                        );
                    }, 1000);
                }
            })
            .catch((err) => {
                console.log('CODE PUSH: ', err);
            });
    }

    immediateUpdate = () => {
        if (this.state.updateStatus !== 'Syncing') {
            this.setState({ updateStatus: 'Syncing' }, () => {
                CodePush.sync(
                    {
                        installMode: CodePush.InstallMode.IMMEDIATE
                    },
                    this.codePushStatusDidChange.bind(this),
                    this.codePushDownloadDidProgress.bind(this)
                );
            });
        }
    };

    codePushStatusDidChange(syncStatus) {
        let syncMessage = '';
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                syncMessage = 'Check update';
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                syncMessage = 'Updating';
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                syncMessage = 'Skip';
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                syncMessage = 'App updated';
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                syncMessage = 'App up to date.';
                CodePush.notifyAppReady();
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                syncMessage = '';
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                syncMessage =
                    '';
                CodePush.notifyAppReady();
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                syncMessage = '';
                this.hide();
                return;
            default:
                break;
        }
        this.setState({ syncMessage });
    }

    codePushDownloadDidProgress(progress) {
        const { updateStatus, animatedProgressValue, isMandatory } = this.state;
        if (updateStatus === 'Syncing') {
            const { receivedBytes, totalBytes } = progress;
            const temp = receivedBytes / totalBytes;
            this.setState({ currentProgress: temp }, () => {
                if (temp >= 1) {
                    if (isMandatory) {
                        this.hide();
                    } else {
                        this.setState({ updateStatus: 'Updated' });
                        this.close(() => {
                            setTimeout(() => {
                                CodePush.restartApp();
                            }, 350);
                        });
                    }
                } else {
                    animatedProgressValue.setValue(temp);
                }
            });
        }
    }

    renderDescription = () => {
        const { updateInfo } = this.state;
        if (updateInfo && updateInfo.description) {
            return (
                <View>
                    <MyText
                        style={styles.description}
                        text={`**** App fix bugs : \n${updateInfo.description}`}
                        addSize={4}
                    />
                </View>
            );
        } else {
            <MyText
                style={styles.header}
                text="Update sucess"
                addSize={4}
            />;
        }

        return null;
    };

    restartNow = () => {
        this.close(() => {
            setTimeout(() => {
                CodePush.restartApp();
            }, 350);
        });
    };

    renderBottom = () => {
        if (this.state.updateStatus === 'Updated') {
            return (
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <TouchableOpacity
                        style={{
                            borderRadius: 50,
                            paddingVertical: 10,
                            paddingHorizontal: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Color.PRIMARY
                        }}
                        onPress={this.restartNow}>
                        <MyText
                            text="Restart"
                            style={{ color: Color.WHITE, fontWeight: 'bold' }}
                        />
                    </TouchableOpacity>
                </View>
            );
        }

        if (this.state.updateStatus === 'Syncing') {
            const { animatedProgressValue, syncMessage, currentProgress } =
                this.state;
            const translateX = animatedProgressValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-progressBarWidth, 0]
            });
            const animationStyle = {
                transform: [{ translateX }]
            };

            const color = animatedProgressValue.interpolate({
                inputRange: [0, 0.3, 0.4, 0.5, 0.6],
                outputRange: [
                    Color.WHITE,
                    '#474f61',
                    '#474f61',
                    '#474f61',
                    Color.WHITE
                ]
            });

            const roundedValue = (currentProgress * 100).toFixed(2);
            const progress = `${roundedValue}%`;
            console.log('roundedValue : ', roundedValue);
            console.log('progress : ', progress);
            return (
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.track, animationStyle]} />
                        <AnimatedMyText
                            style={[styles.progress, { color }]}
                            text={progress}
                        />
                    </View>
                    <MyText style={styles.msg} text={syncMessage} />
                </View>
            );
        }
        return null
        return (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 50,
                        paddingVertical: 10,
                        paddingHorizontal: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.PRIMARY
                    }}
                    onPress={this.immediateUpdate}>
                    <MyText
                        text="Update"
                        style={{ color: Color.WHITE, fontWeight: 'bold' }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    renderContent = () => {
        const { updateStatus } = this.state;

        if (updateStatus === 'Updated') {
            return (
                <View style={styles.content}>
                    {/* <MyText
                        style={styles.header}
                        text="Phiên bản cập nhật đã được cài đặt."
                        addSize={4}
                    /> */}
                    {/* <MyText
                        style={styles.confirmText}
                        text="Vui lòng tắt ứng dụng và mở lại để sử dụng phiên bản vừa được sửa lỗi."
                        addSize={4}
                    /> */}
                    <MyText
                        style={styles.confirmText}
                        text="Restart"
                        addSize={4}
                    />
                </View>
            );
        }

        return (
            <View style={styles.content}>
                {this.renderDescription()}
                {/* <MyText
                  style={styles.confirmText}
                  text="Vui lòng bấm đồng ý để cập nhật bản sửa lỗi mới."
                  addSize={3}
                /> */}
            </View>
        );
    };

    getVersion = () => {
        const { updateInfo } = this.state;
        if (updateInfo) {
            const { label, appVersion } = updateInfo;
            const buildNumber = label.substring(1);
            const version = `Version: ${appVersion} (${buildNumber})`;
            return version;
        }
        return null;
    };

    render() {
        const { animatedOpacityValue, animatedScaleValue, updateStatus } =
            this.state;
        const visible = updateStatus !== 'None';
        const version = this.getVersion();

        const opacity = animatedOpacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.7, 1]
        });

        const opacityStyle = {
            opacity
        };

        const scale = animatedScaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const scaleStyle = {
            transform: [{ scale }]
        };

        return (
            <Modal transparent visible={visible} onRequestClose={() => {}}>
                <Animated.View style={[styles.modal, opacityStyle]}>
                    <Animated.View style={[styles.container, scaleStyle]}>
                        <MyText
                            style={styles.title}
                            text={this.titles(this.state.updateStatus)}
                            addSize={6}
                        />
                        {version && (
                            <MyText style={styles.version} text={version} />
                        )}
                        {this.renderContent()}
                        <View style={styles.bottom}>{this.renderBottom()}</View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bottom: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        minHeight: 44,
        width: '100%'
    },
    confirmText: {
        color: Color.NIGHT_RIDER,
        marginBottom: 10,
        marginTop: 5,
        textAlign: 'center'
    },
    container: {
        alignItems: 'center',
        backgroundColor: Color.WHITE,
        justifyContent: 'center',
        overflow: 'hidden',
        width: dialogWidth,
        ...Platform.select({
            android: {
                elevation: 4
            },
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 6
            }
        }),
        borderRadius: 14
    },
    content: {
        marginHorizontal: 20,
        marginTop: 10
    },

    description: {
        color: Color.NIGHT_RIDER,
        textAlign: 'left'
    },
    header: {
        color: Color.PRIMARY,
        textAlign: 'center'
    },
    modal: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: Color.BLACK_RUSSIAN,
        justifyContent: 'center'
    },
    msg: {
        color: Color.NIGHT_RIDER,
        marginTop: 8,
        textAlign: 'center'
    },
    progress: {
        color: Color.GRAY238,
        textAlign: 'center'
    },
    progressBar: {
        alignItems: 'center',
        backgroundColor: Color.HAWKES_BLUE,
        borderRadius: 8,
        justifyContent: 'center',
        overflow: 'hidden',
        width: progressBarWidth
    },
    title: {
        color: Color.PRIMARY,
        marginHorizontal: 20,
        marginTop: 20,
        textAlign: 'center'
    },
    track: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        color: Color.JACKSONS_PURPLE,
        justifyContent: 'center',
        padding: 4 * 3
    },
    version: {
        color: Color.NIGHT_RIDER,
        marginTop: 4
    }
});

const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.MANUAL
};

export default CodePush(codePushOptions)(CodePushUpdate);

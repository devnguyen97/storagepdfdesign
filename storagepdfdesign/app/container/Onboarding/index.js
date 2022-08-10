import {MyText} from '@component';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider';
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;
class OnboardingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [
        {
          key: 'one',
          title: 'Stay in touch with your customer through comments & messages.',
          text: '',
          image: require('../../media/img_onboarding_1.png'),
          backgroundColor: '#59b2ab',
        },
        {
          key: '',
          title: 'Track how your business is doing with Pages and Brand Insights',
          text: '',
          image: require('../../media/img_onboarding_2.png'),
          backgroundColor: '#59b2ab',
        },
        {
          key: 'Customized experience',
          title: 'Stay focused with all of your Page notifications in one place',
          text: '',
          image: require('../../media/img_onboarding_3.png'),
          backgroundColor: '#59b2ab',
        },
        {
          key: 'Customized experience',
          title: 'Post updates, photos, videos straight from your phone',
          text: 'Post updates, photos, videos straight from your phone',
          image: require('../../media/img_onboarding_4.png'),
          backgroundColor: '#59b2ab',
        },
      ],
    };
  }

  componentDidMount() {}
  _renderItem = ({item}) => {
    return (
      <View style={styles.slide1}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={item.image} />
        </View>
        <View
          style={{
            paddingLeft: 20,
            justifyContent: 'flex-start',
            paddingTop: 10,
            paddingRight: 10,
          }}>
          <MyText
            text={item.title}
            addSize={3}
            style={{fontWeight: 'bold', color: 'rgba(52, 43, 40, 1)'}}
          />
          <MyText
            text={item.text}
            addSize={8}
            style={{fontWeight: 'bold', color: 'black', marginTop: 15}}
          />
        </View>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View
        style={{
          height: 60,
          width: 100,
          backgroundColor: 'rgba(250, 184, 56, 1)',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <MyText
            text={'Start'}
            addSize={4}
            style={{fontWeight: 'bold', color: 'black'}}
          />
        </View>
      </View>
    );
  };
  _renderSkip = () => {
    return (
      <View
        style={{
          height: 60,
          width: 100,
          backgroundColor: 'rgba(252, 246, 236, 1)',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <MyText
            text={'Skip'}
            addSize={4}
            style={{fontWeight: 'bold', color: 'black'}}
          />
        </View>
      </View>
    );
  };
  _renderNextButton = () => {
    return (
      <View
        style={{
          height: 60,
          width: 100,
          backgroundColor: 'rgba(250, 184, 56, 1)',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <MyText
            text={'Next'}
            addSize={4}
            style={{fontWeight: 'bold', color: 'black'}}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(252, 246, 236, 1)',
        }}>
    <ImageBackground
          source={require('../../media/img_background.png')}
          resizeMode ='contain'
          style={{ height: DEVICE_HEIGHT, width: DEVICE_WIDTH, paddingBottom: 100}}>
          <AppIntroSlider
            renderItem={this._renderItem}
            data={this.state.pages}
            renderNextButton={this._renderNextButton}
            showSkipButton
            renderSkipButton={this._renderSkip}
            showDoneButton
            renderDoneButton={this._renderDoneButton}
            onDone={() => {
              this.props.navigation.navigate('MainBottomTab');
              activeDotStyle = {backgroundColor: 'rgba(242, 154, 22, 0.24)'}
            //   dotStyle = {{backgroundColor: 'rgba(242, 154, 22, 0.24)'}}
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              position: 'relative',
              bottom: 150,
              borderBottomColor: 'rgba(0, 0, 0, 0.16)',
              width: ' 90%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}></View>
                
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = function (state) {
  return {};
};
const mapDispatchToProps = function (dispatch) {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen);
const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    paddingTop: 70,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

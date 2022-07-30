import React, { Component } from 'react';
import { View, Text,FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Color, Mixins } from "@styles";
import { WrapperContainer,MyText } from "@component";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const data = [
  {
    title : "CUSTOM AUDIENCE",
    content : "Automatically creates a file which filters out the non-potential customers.",
    color : Color.blueColor
  },
  {
    title : "PIXEL",
    content : "Automatically creates,tests,and collects only the best pixel in order to optimiza the advertising budget.",
    color : "#7FFFD4"
  },
  {
    title : "TARGET",
    content : "Automatically tests a database and suggests the potential customers for a particular product or a campaign.",
    color : "#FFB6C1"
  },
  {
    title : "RETARGETING",
    content : "Automatically approaches the potential customers who have been considering to buy your products using AI (based on the actions of clicking,viewing,adding,products to cart...).",
    color : "#FFFACD"
  },
  {
    title : "REMARKETING",
    content : "Automatically scans customers emails (which are linked to their facebooks) and resends approaching scripted mails.",
    color : "#DDA0DD"
  },
  {
    title : "MANAGING CAMPAIGN'S EFFICIENCY",
    content : "Automatically adjusts budget based on the campaign's efficiency.",
    color : "#FA8072"
  },
  {
    title : "AUTOMATICALLY",
    content : "Creates reports and assessments for your campaign, and sort the results into three level.",
    color : "#4682B4"
  },
  {
    title : "AUTOMATICALLY",
    content : "Rejects order of refunding for ads in case it may exceed the limit of your budget (the rate for refund is set to be at 10 to 20% of the campaign's budget)",
    color : "#B0E0E6"
  },
  {
    title : "AUTOMATICALLY",
    content : "Asks to raise the debt limitation for advertising activities when reaches the threshold.",
    color : "#FFB6C1"
  },
]

class Vip extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderItem = ({ item,index })=>(
    <View style = {{
      paddingBottom : 20,
      width :"100%",
      marginTop: ( index === 0 || index === 6) ? 10 : 0,
      backgroundColor : Color.WHITE,
      paddingHorizontal : 15,
      borderBottomWidth : 0.5,
      borderBottomColor : Color.grayColor151151151,
      paddingVertical : 10,
      flexDirection : 'row'
    }}
    >
      <View style = {{ flex : 1 }} >
      <View style={{flexDirection : 'row'}}>
        <View style={{
          padding : 10,
          width : null,
          borderRadius : 10,
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : item.color
        }}
        >
        <MyText text = {item.title}
        style={{
          fontWeight : "bold"
        }}/>
        </View>
        <View style = {{ flex : 1 }} />
      </View>
      <MyText text = {item.content}
        style={{
          marginTop:  10,
        }}/>
      </View>

      <FontAwesome5 name = {"chevron-right"} size = {30}
      color = {Color.grayColor151151151}
      solid = {true}
      style = {{
        alignSelf : 'center',
        marginLeft: 20,
      }}
      />
    </View>
  )

  render() {
    return (
      <WrapperContainer nameTitle = {"Vip"}>
        <View style={{
          flex : 1,
          backgroundColor : Color.WHITE
        }}
        >
            <FlatList style = {{ flex : 1,backgroundColor : Color.grayColor238238238 }}
            renderItem = {this.renderItem}
            data = {data}
            ListFooterComponent = {()=>(
              <View style = {{
                marginTop: 20,
                height : 50,
                width : "100%",
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : Color.GOLD
              }}
              >
                <MyText text = {"Register VIP  Account"}
                style={{
                  fontWeight : "bold",
                  color : Color.WHITE
                }}/>
              </View>
            )}
            />
        </View>
      </WrapperContainer>
    );
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Vip);



import { MyText, WrapperContainer } from "@component";
import { Color, Mixins } from "@styles";
import React, { Component } from 'react';
import { ScrollView, View,Image,StyleSheet,Switch } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled : false
    };
  }

  render() {
    return (
      <WrapperContainer nameTitle = {"Settings"}>
        <ScrollView style = {{
          flex : 1,
          backgroundColor : Color.grayColor238238238,
        }}
        >
          <View style = {{
              paddingVertical : 20,
              paddingHorizontal : 20,
              width : "100%",
              justifyContent : 'center',
              backgroundColor : Color.WHITE,
            }}
          >
            <MyText text = {"Account"}
            style={{fontWeight : "bold"}}
            addSize = {4}
            />
            <View style = {{
              flexDirection : 'row',
              marginTop: 10,
            }}
            >
              <Image style = {{
                width : 60,
                height : 60,
              }}
              borderRadius = {30}
              source = {{ uri : "ic_user" }}
              />
              <View style={{
                flex : 1,
                paddingHorizontal : 20,
                justifyContent : 'center',
              }}
              >
                <MyText text = {"Doi Hoang"}
                addSize = {2}
                />
                <MyText text = {"210224820818135"}
                addSize = {2}
                style={{
                  marginTop: 5,
                  color : Color.grayColor153153153
                }}
                />
              </View>
            </View>
          </View>
        
          <View style = {Styles.ctn}>
            <MyText text = {"Billing"}
            style={{fontWeight : "bold"}}
            addSize = {4}
            />
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Account spending limit"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Payment methods"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Receipts"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
                <View style = {Styles.item1}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Bill date"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
          </View>
        
          <View style = {Styles.ctn}>
            <MyText text = {"Push notificatios"}
            style={{fontWeight : "bold"}}
            addSize = {4}
            />
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Push notificatios"}/>
                      </View>
                      <MyText text = {"On"}/>
                    </View>
                </View>
                <View style = {Styles.item1}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Manage notifications"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
          </View>

          <View style = {Styles.ctn}>
            <MyText text = {"general"}
            style={{fontWeight : "bold"}}
            addSize = {4}
            />
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"In-app sounds"}/>
                      </View>
                      <Switch
                        trackColor={{ false: "#767577", true: Color.blueColor }}
                        thumbColor={this.state.isEnabled ? Color.blueColor : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>{ this.setState({ isEnabled : !this.state.isEnabled }) }}
                        value={this.state.isEnabled}
                      />
                    </View>
                </View>
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Theme"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
                <View style = {Styles.item}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Help center"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
                <View style = {Styles.item1}>
                  <View style={{flexDirection : 'row',width : "100%"}}>
                      <View style={{ flex : 1 }} >
                      <MyText text = {"Report a problem"}/>
                      </View>
                      <FontAwesome5 name = {"chevron-right"} size = {18}
                      color = {Color.grayColor151151151}
                      style = {{
                        alignSelf : 'center',
                        marginLeft: 20,
                      }}
                      />
                    </View>
                </View>
          </View>

          <View style = {{
            paddingVertical:  15,
            paddingHorizontal:  20,
            backgroundColor : 'white',
            marginTop: 15,
            marginBottom:  20,
          }}>
            <MyText text = {"Logout"}
            style={{fontWeight : "bold"}}
            addSize = {4}
            />
          </View>

        </ScrollView>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Settings);


const Styles = StyleSheet.create({
  item : {
    paddingBottom : 10,
    width :"100%",
    backgroundColor : Color.WHITE,
    borderBottomWidth : 0.5,
    borderBottomColor : Color.grayColor151151151,
    paddingVertical : 10,
    flexDirection : 'row'
  },
  item1 : {
    width :"100%",
    backgroundColor : Color.WHITE,
    paddingVertical : 10,
    flexDirection : 'row'
  },
  ctn : {
    paddingTop: 20,
    paddingHorizontal : 20,
    width : "100%",
    marginTop: 15,
    justifyContent : 'center',
    backgroundColor : Color.WHITE,
  }
})
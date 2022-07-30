import { helper, storage } from "@common";
import { MyText, WrapperContainer,ModalViewPdf,ModalSelect,ModalEdit,ModalImage,ModalDelete } from "@component";
import { Color } from "@styles";
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View,Share } from 'react-native';
import { launchImageLibrary,launchCamera } from 'react-native-image-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ImgToBase64 from 'react-native-image-base64';
const RNFS = require('react-native-fs');
import ViewShot from "react-native-view-shot";
import { FloatingAction } from "react-native-floating-action";
import {ItemApp} from "./element";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const feature = {
  DELETE : 'DELETE',
  SHARE : 'SHARE',
  RENAME : 'RENAME',
}

const actions = [
  {
    text: "",
    color : '#1782FF',
    icon: require("../../media/plus.png"),
    name: "plus",
    position: 2
  },
  {
    text: "",
    color : '#1782FF',
    icon: require("../../media/camera.png"),
    name: "camera",
    position: 1
  }
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSelector : null,
      itemEdit : null,
      itemDelete : null,
      visible : false,
      uri : '',
      data : [],

      valueInput : '',
      itemSelectors : [],
      isSelecting : false
    };
    
  }

  setValueInput = (valueInput) => {
    this.setState({
      valueInput
    })
  }

  initData = async () => {
    try {
      let pdfs = [];
      const file_pdfs = await storage.getItem("PDFS");
      if(file_pdfs){
        pdfs = JSON.parse(file_pdfs);
        this.setState({
          data : pdfs
        })
      }else{
      }
    } catch (error) {
    }
  }

  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.componentWillFocus();
    });
    this.blurListener = this.props.navigation.addListener('blur', () => {
        this.componentDidBlur();
    });
  }

  componentDidBlur() {}

  componentWillFocus() {
    this.initData()
  }

  myAsyncPDFFunction = async (uri) => {
    const time = new Date().getTime();
    const name = `image_pdf_${time}`;
    try {
      const options = {
        imagePaths:[uri],
        name:name,
        maxSize: { // optional maximum image dimension - larger images will be resized
          width: deviceWidth,
          height: Math.round(deviceHeight / deviceWidth * 900),
        },
        quality: .7, // optional compression paramter
        //for versions higher than 9 it is stored in (Download/img-to-pdf/)
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      const filePath = await  helper.getPathImageIOS(pdf.filePath);

        this.addFilePdf({
          ...pdf,
          name:name,
          checked : 0,
          time : time.toString()
        });
    } catch(e) {
    }
  }

  addFilePdf = async (data) => {
      try {
        let pdfs = [];
        const file_pdfs = await storage.getItem("PDFS")
        if(file_pdfs){
          pdfs = JSON.parse(file_pdfs);
          pdfs.push(data)
        }else{
          pdfs = [data];
        }
        await storage.setItem("PDFS",JSON.stringify(pdfs));
        this.initData()
      } catch (error) {
        
      }
  }

  uploadImage = async (type) => {
      try {
        let result;
        if(type === "plus"){
          result = await launchImageLibrary(
            {
                mediaType: 'photo'
            },
            (res) => console.log(res)
          );
        }else{
          result = await launchCamera({
            mediaType : 'photo'
          },(res) => console.log(res))
        }

        if (result.didCancel) {
            return;
        }
        if(result.assets[0].uri){
          this.setState({
            visibleImage : true,
            uriImage : result.assets[0].uri
          })
        }
      } catch (error) {
      }
  }

  longPressSelector = (item) => {
      this.setState({
          isSelecting : true
      });
  }

  pressSelector = (item) => {
    let newSelectors = helper.cloneArray(this.state.itemSelectors);
    const exist = newSelectors.findIndex((it)=> item.time === it.time);

    if(exist === -1){
      newSelectors.push(item);
    }else {
      newSelectors = this.state.itemSelectors.filter((it)=> it.time !== item.time)
    }
    this.setState({
        itemSelectors : newSelectors,
        isSelecting : true
    });
  }




  _renderItem = ({ item, index }) => {
    const checked = parseInt(item.checked) === 1;
    const itemSelecting = this.state.itemSelectors.findIndex((it)=> it.time === item.time) !== -1
    return (
      <ItemApp
        item = {item}
        index = {index}
        checked  = {checked}
        updateFeatureItem = {this.updateFeatureItem}
        longPress = {this.longPressSelector}
        pressSelector = {()=>{
          this.pressSelector(item)
        }}
        itemSelecting = {itemSelecting}
        isSelecting = {this.state.isSelecting}
      />
    )
    return (
      <View style = {{
        width : "100%",
        marginTop : index === 0 ? 20 : 0,
        height : 60,
        paddingHorizontal : 15,
        flexDirection : 'row'
      }}>
          <Image style = {{
            width : 40,
            height : 50,
          }}
          source = {{uri : 'ic_pdfred'}}/>
          <TouchableOpacity style = {{
            flex : 1,
            paddingLeft : 10,
          }}
          onPress = {() => {
            this.setState({
              visible : true,
              uri : item.filePath
            })
          }}
          >
            <MyText text={item.name}
                style={{
                  color: '#1A1C19' 
                }}
                addSize = {2} 
            />
            <MyText text={helper.convert_month(parseInt(item.time))}
                style={{
                  color: '#7E8395',
                  marginTop : 5,
                }}
                addSize = {-2}
            />
            <MyText text={item.filePath.slice(0,30)}
                style={{
                  marginTop : 3,
                  color: '#7E8395',
                }}
                addSize = {-2}
            />
          </TouchableOpacity>
          <TouchableOpacity style = {{
            height : 40,
            width : 40,
            justifyContent : 'center',
            alignItems : 'center'
          }} onPress = {()=>{this.updateFeatureItem({
            type : "CHECKED",
            item : item
          })}}>
              <Image style = {{
                width : 20,
                height : 20,
                tintColor: checked ? Color.PRIMARY :  '#7E8395',
              }}
              source = {{uri : 'ic_star'}}/>
          </TouchableOpacity>
          <TouchableOpacity style = {{
            height : 40,
            width : 40,
            justifyContent : 'center',
            alignItems : 'center'
          }}
          onPress = {()=>{
            this.setState({ itemSelector : item })
          }}>
              <Ionicons name={'ellipsis-vertical-outline'} size={20} color={'#7E8395'} />
          </TouchableOpacity>
      </View>
    )
  };

  confirmDelete = (selection) => {
    const { item,type } = selection
    let newData = this.state.data.filter((ele)=> ele.time !== item.time);
    this.setState({
      data : newData
    });
    storage.setItem("PDFS",JSON.stringify(newData));
  }

  updateFeatureItem = (selection) => {
    try {
        const { item,type } = selection
        if(type === 'SHARE') {
          Share.share({
            title: "Share PDF",
            message:
              item.name,
            url: "",
          });
        }
        if(type === 'SREENSHORT') {
          this.myAsyncPDFFunction(item);
        }
        if(type === 'DELETE') {
          this.setState({
            itemDelete : item
          })
        } 

        if(type === 'CHECKED') {
          let newData = helper.cloneArray(this.state.data);
          const index = newData.findIndex((ele)=> ele.time === item.time);
          const status = parseInt(newData[index].checked);
          const newObj = {
            ...newData[index],
            checked : status === 0 ? 1 : 0,
          };
          newData[index] = newObj;
          this.setState({
            data : newData
          });
          storage.setItem("PDFS",JSON.stringify(newData));
        }

        if(type === 'RENAME') {
          setTimeout(()=>{
            this.setState({
              itemEdit : item
            })
          },500)
        }

        if(type === 'UPDATE_NAME') {
          let newData = helper.cloneArray(this.state.data);
          const index = newData.findIndex((ele)=> ele.time === item.time);
          newData[index] = {
            ...newData[index],
            name : item.name,
          };
          this.setState({
            data : newData
          });
          storage.setItem("PDFS",JSON.stringify(newData));
        }

      }catch(error){

      }

  }

  render() {
    return (
      <WrapperContainer nameTitle = {"Browser"} navigation = {this.props.navigation}>
        <View style = {{
          flex : 1,
          backgroundColor : 'white',
          padding : 10
        }}>
          <FlatList
              bounces={false}
              data={this.state.data}
              style={{
                  flex: 1
              }}
              renderItem={this._renderItem}
              numColumns = {2}
              ListEmptyComponent = {()=>{
                return(
                  <View style = {{
                    flex : 1,
                    height : Dimensions.get("window").height * 0.7,
                    justifyContent : 'center',
                    alignItems : 'center'
                  }}>
                      <Image style = {{
                        width : 150,
                        height : 150,
                      }}
                      resizeMode = {"contain"}
                      source = {{
                        uri : 'ic_empty'
                      }}/>
                      
                  </View>
                )
              }}
          />
        </View>
        <View style ={{
            backgroundColor : 'white'
        }}>

        <FloatingAction
            actions={actions}
            color = {'#1782FF'}
            onPressItem={name => {
              this.uploadImage(name)
            }}
        />

        <ModalViewPdf  
          uri = {this.state.uri} 
          visible = {this.state.visible}
          closeFun = {()=>{
            this.setState({
              visible : false,
              uri : ''
            })
        }}/>

        
        <ModalImage
          updateFeatureItem = {this.updateFeatureItem} 
          uri = {this.state.uriImage} 
          visible = {this.state.visibleImage}
          closeFun = {()=>{
            this.setState({
              visibleImage : false,
              uriImage : ''
            })
        }}/>

        <ModalSelect 
          updateFeatureItem = {this.updateFeatureItem} 
          closeModal = {() => {
            this.setState({
              itemSelector : null
            })
        }}
        visible = {this.state.itemSelector !== null}
        item = {this.state.itemSelector}/>
        
        <ModalEdit 
          updateFeatureItem = {this.updateFeatureItem} 
          closeModal = {() => {
            this.setState({
              itemEdit : null
            })
          }}
          visible = {this.state.itemEdit !== null}
          item = {this.state.itemEdit}
        />

        <ModalDelete 
          updateFeatureItem = {this.confirmDelete} 
          closeModal = {() => {
            this.setState({
              itemDelete : null
            })
          }}
          visible = {this.state.itemDelete !== null}
          item = {this.state.itemDelete}
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});
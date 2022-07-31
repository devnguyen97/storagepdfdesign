import { helper, storage } from "@common";
import { MyText, WrapperContainer,ModalViewPdf,ModalSelect,ModalEdit,ModalImage,ModalDelete,ModalSort } from "@component";
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
import ReactNativeBlobUtil from 'react-native-blob-util'

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
      isSelecting : false,
      openModalFilter : false,
      filters : []
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

      ReactNativeBlobUtil.fs.stat(pdf.filePath)
      .then((stats) => {
        this.addFilePdf({
            ...pdf,
            size : stats.size,
            name:name,
            checked : 0,
            time : time.toString()
        });
      })
      .catch((err) => {
          this.addFilePdf({
            ...pdf,
            size : 20000,
            name:name,
            checked : 0,
            time : time.toString()
        });
      })
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
      newSelectors = this.state.itemSelectors.filter((it)=> it.time !== item.time);
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

  sortFilterAction = (typeSort) => {
    const exist = this.state.filters.findIndex((item)=> item === typeSort) ;
    if(exist !== -1) return;
    let fil = helper.cloneArray(this.state.filters);
    let dataNew = helper.cloneArray(this.state.data);

    if(typeSort === 'RECENT' || typeSort ===  'NAME' || typeSort === 'SIZE'){
      fil = fil.filter((item) => item !== 'RECENT' && item !==  'NAME' && item !== 'SIZE');
      fil.push(typeSort);
    }else{
      fil = fil.filter((item) => item !== 'ASCENDING' && item !==  'DESCENDING');
      fil.push(typeSort);
    }

    if(fil.includes("ASCENDING") || fil.includes("SIZE")){
      dataNew = dataNew.sort((a,b) => a.size - b.size);
    }
    if(fil.includes("DESCENDING")){
      dataNew = dataNew.sort((a,b) => b.size - a.size);
    }

    if(fil.includes("NAME")){
      dataNew = dataNew.sort((a,b) => a.name - b.name);
    }

    this.setState({
      filters : fil,
      data : dataNew
    });
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
              ListHeaderComponent = {()=>{
                return(
                  <TouchableOpacity style = {{
                    height : 40,
                    paddingHorizontal : 10,
                    flexDirection : 'row',
                    alignItems : 'center'
                  }}
                  onPress = {()=>{
                    this.setState({
                      openModalFilter : true
                    })
                  }}
                  >
                    <MyText text = {"Recent"} 
                    style = {{
                      color : "#FAB838",
                      fontWeight : "bold"
                    }}/>
                    <Image style = {{
                        width : 25,
                        height : 25,
                        marginLeft : 10,
                      }}
                      source = {{uri : 'ic_down'}}
                    />
                  </TouchableOpacity>
                )
              }}
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

        <ModalSort 
        updateFeatureItem = {this.sortFilterAction} 
        closeModal = {() => {
          this.setState({
            openModalFilter : false
          })
        }}
        visible = {this.state.openModalFilter}
        filters = {this.state.filters}/>
        
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
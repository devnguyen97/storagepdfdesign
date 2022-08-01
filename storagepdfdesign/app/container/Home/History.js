import { helper, storage } from "@common";
import { MyText, WrapperContainer,ModalViewPdf,ModalDelete,
  ModalSelect,ModalEdit } from "@component";
import { Color } from "@styles";
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View,Share } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ItemApp } from "./element";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const feature = {
  DELETE : 'DELETE',
  SHARE : 'SHARE',
  RENAME : 'RENAME',
}

class History extends Component {
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
      filters : [],
      visibleMore : false,

      visibleImages : false,
      visibleCreate : true,
      itemCreate : null,

      valueInput: ''


    };
  }

  initData = async () => {
    try {
      let pdfs = [];
      const file_pdfs = await storage.getItem("PDFS");
      if(file_pdfs){
        pdfs = JSON.parse(file_pdfs);
        pdfs = pdfs.filter((item) => parseInt(item.checked) === 1);
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
    const name = `Image_PDF_${time}.pdf`;
    try {
      const options = {
        imagePaths:[uri],
        name:name,
        maxSize: { // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round(deviceHeight / deviceWidth * 900),
        },
        quality: .7, // optional compression paramter
        targetPathRN: "/storage/emulated/0/Download/", // only for android version 9 and lower
        //for versions higher than 9 it is stored in (Download/img-to-pdf/)
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({
        visible : true,
        uri : pdf.filePath
      })
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

  uploadImage = async () => {
      try {
        const result = await launchImageLibrary(
          {
              mediaType: 'photo'
          },
          (res) => console.log(res)
        );

        if (result.didCancel) {
            return;
        }
        if(result.assets[0].uri){
          this.myAsyncPDFFunction(result.assets[0].uri)
        }
      } catch (error) {
      }
  }

  _renderItem = ({ item, index }) => {
    const checked = parseInt(item.checked) === 1;
    const itemSelecting = this.state.itemSelectors.findIndex((it)=> it.time === item.time) !== -1
    return (
      <ItemApp
        item = {item}
        index = {index}
        checked  = {checked}
        updateFeatureItem = {()=>{}}
        longPress = {this.longPressSelector}
        pressSelector = {()=>{
        }}
        itemSelecting = {itemSelecting}
        isSelecting = {this.state.isSelecting}
        viewPDF = {()=>{
        }}
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
    const { item,type } = selection
    if(type === 'SHARE') {
      Share.share({
        title: "Share PDF",
        message:
          item.name,
        url: "",
      });
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

  }

  search = (text) => {
    this.setState({
      valueInput : text
    })
    if(text.trim().length === 0) {
      return this.initData();
    }
    const txtSearch = helper.removeVietnameseTones(text).toUpperCase();
    const newArr = helper.cloneArray(this.state.data);
    let arr = null;
    arr = newArr.filter((ele) => {
          return (
            helper
              .removeVietnameseTones(ele.name)
              .toUpperCase()
              .search(txtSearch) !== -1
          )
    
    });
    this.setState({
      data : arr
    })
  }

  render() {
    return (
      <WrapperContainer nameTitle = {"Saved"}
      setValueInput = {this.search}
      valueInput = {this.state.valueInput}
      navigation = {this.props.navigation}>
        <View style = {{
          flex : 1,
          backgroundColor : 'white',
          padding : 10
        }}>
          <FlatList
              bounces={false}
              data={this.state.data}
              numColumns = {2}
              style={{
                  flex: 1
              }}
              renderItem={this._renderItem}
              ListEmptyComponent = {()=>{
                return(
                  <View style = {{
                    marginTop : 100,
                    justifyContent : 'center',
                    alignItems : 'center'
                  }}>
                      <Image style = {{
                        width : 150,
                        height : 150,
                      }}
                      resizeMode = {"contain"}
                      source = {{
                        uri : 'ic_filter'
                      }}/>
                      <MyText text = {"Empty"} style = {{
                        color : "#76706A"
                      }}/>
                  </View>
                )
              }}
          />
        </View>
        <View style ={{
            backgroundColor : 'white'
        }}>
        <ModalViewPdf  uri = {this.state.uri} visible = {this.state.visible}
          closeFun = {()=>{
            this.setState({
              visible : false,
              uri : ''
            })
        }}/>
        <ModalSelect updateFeatureItem = {this.updateFeatureItem} 
        closeModal = {() => {
          this.setState({
            itemSelector : null
          })
        }}
        visible = {this.state.itemSelector !== null}
        item = {this.state.itemSelector}/>

        <ModalEdit 
        updateFeatureItem = {this.updateFeatureItem} 
        title = {'Rename File'} 
        content = {'You can only change file name, not file extension'}  
        closeModal = {() => {
          this.setState({
            itemEdit : null 
          })
        }}
        visible = {this.state.itemEdit !== null}
        item = {this.state.itemEdit}/>

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
  
export default connect(mapStateToProps, mapDispatchToProps)(History);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});
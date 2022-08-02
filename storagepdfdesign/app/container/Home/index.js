import { helper, storage } from "@common";
import { ModalDelete, ModalEdit, ModalImage, ModalSelect, ModalSort,
  ModalCreatePdf,
  ModalViewPdf, MyText, WrapperContainer } from "@component";
import { Dimensions, FlatList, Image, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { FloatingAction } from "react-native-floating-action";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import { connect } from 'react-redux';
import { ItemApp } from "./element";
import React, { Component } from 'react';
const RNFS = require('react-native-fs');
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';


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
    icon: require("../../media/gallery.png"),
    name: "plus",
    position: 2
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

  myAsyncPDFFunction = async (uri,name) => {
    const time = new Date().getTime();
    // const name = `pdf_${helper.generateUUID(5)}`;
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
        this.initData();
        setTimeout(()=>{
          this.setState({
            visibleCreate : true,
            itemCreate : pdfs
          })
        },2000)
      } catch (error) {
        
      }
  }

  uploadImage = async (type) => {
      try {
        let result;
        if(type === "plus"){
            result = await MultipleImagePicker.openPicker({
              selectedAssets: [],
              mediaType : 'image',
              isExportThumbnail: true,
              usedCameraButton: true,
              haveThumbnail: true,
              thumbnailWidth: Dimensions.get("window").width,
              thumbnailHeight: Dimensions.get("window").height,
              allowedVideoRecording: true,
              isCrop: true,
              isCropCircle: true,
              maxSelectedAssets: 1,
              maximumMessageTitle: 'Error Select Image / Video',
          });
            console.log('====================================');
            console.log("This is result",result);
            console.log('====================================');
            if(result[0].path){
              this.setState({
                visibleImage : true,
                uriImage : result[0].path
              })
          }
        }
        // else{
        //   result = await launchCamera({
        //     mediaType : 'photo'
        //   },(res) => console.log(res))
        // }

        // if (result.didCancel) {
        //     return;
        // }
        // if(result.assets[0].uri){
        //   this.setState({
        //     visibleImage : true,
        //     uriImage : result.assets[0].uri
        //   })
        // }
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
      newSelectors = [item];
    }else {
      newSelectors = []
    }
    this.setState({
        itemSelectors : newSelectors,
        isSelecting : true
    });
  }


  setViewPDF = (item) => {
    this.setState({
      visible : true,
      uri : item.filePath
    })
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
        viewPDF = {()=>{
          this.setViewPDF(item)
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
    try {
        const { item,type,name } = selection
        if(type === 'SHARE') {
          Share.share({
            title: "Share PDF",
            message:
              item.name,
            url: "",
          });
        }
        if(type === 'SREENSHORT') {
          this.myAsyncPDFFunction(item,name);
        }
        if(type === 'DELETE') {
          this.setState({
            itemDelete : item
          })
        } 

        if(type === 'CHECKED') {
          let newData = helper.cloneArray(this.state.data);
          item.forEach(element => {
            const index = newData.findIndex((ele)=> ele.time === element.time);
            const status = parseInt(newData[index].checked);
            const newObj = {
              ...newData[index],
              checked : status === 0 ? 1 : 0,
            };
            newData[index] = newObj;
          });
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
        console.log("err", error);
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

  renderMoreFeature = () => {
    if(this.state.itemSelectors.length === 0) return null;
    const { itemSelectors } = this.state; 
    return(
      <View style = {{
        height : 60,
        width : "100%",
        borderTopColor : 'gray',
        borderTopWidth : 0.2,
        justifyContent : 'center',
        flexDirection : 'row'
      }}> 
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60,
            }}
            onPress = {()=>{
              this.updateFeatureItem({
                type : 'SHARE',
                item : this.state.itemSelectors[0]
              })
            }}>
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : 'ic_clould'}}
              />
              <MyText text = {'Send'}/>
            </TouchableOpacity>
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60}}
            onPress = {()=>{
              this.updateFeatureItem({
                type : 'CHECKED',
                item : this.state.itemSelectors
            });
            }}>
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : itemSelectors[0].checked ? 'bookmarked' : 'ic_tag'}}
              />
              <MyText text = {'Save'}/>
            </TouchableOpacity>
            <TouchableOpacity style = {{
              justifyContent : 'center',
              alignItems : 'center',
              width : 70,
              height : 60,
            }}
            onPress = {()=>{
                this.setState({
                    visibleMore : true
                })
            }}
            >
              <Image style = {{
                  width : 25,
                  height : 25,
                }}
                source = {{uri : 'ic_more'}}
              />
              <MyText text = {'More'}/>
            </TouchableOpacity>  

      </View>
    )
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
            ele.name && helper
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
      [<WrapperContainer 
        nameTitle = {"Browser"} 
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

        { this.state.itemSelectors.length === 0 && 
        <FloatingAction
            actions={actions}
            color = {'#1782FF'}
            onPressItem={name => {
              this.uploadImage(name)
            }}
        />}

        <ModalViewPdf  
          uri = {this.state.uri} 
          visible = {this.state.visible}
          closeFun = {()=>{
            this.setState({
              visible : false,
              uri : ''
            })
        }}/>

        <ModalCreatePdf  
          uri = {this.state.uri} 
          visible = {this.state.visibleCreate}
          closeFun = {()=>{
            this.setState({
              visibleCreate : false,
              itemCreate : null
            })
        }}
        item = {this.state.itemCreate}/>

        
        <ModalImage
          updateFeatureItem = {this.updateFeatureItem}
          addFilePdf = {this.addFilePdf}
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
            visibleMore : false 
          })
        }}
        visible  = {this.state.visibleMore}
        item = {this.state.itemSelectors[0]}/>

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
          title = {'Rename File'}
          content = {'You can only change file name, not file extension'}  
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
        
        {this.renderMoreFeature()}
      </WrapperContainer>
      ]
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
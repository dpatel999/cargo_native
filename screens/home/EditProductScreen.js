// This screen will be used by customer to post the product

import React, { Component } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Switch
} from 'react-native';
import {
  Form,
  Container,
  Content,
  Input,
  CardItem,
  Text,
  Card,
  Item,
  Textarea,
  Button,
  
} from 'native-base';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { Header } from 'react-navigation-stack';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CategoryPickerForPostProduct from '../../components/category/CategoryPickerForPostProduct';
import DaysPickerForPostProductScreen from '../../components/category/DaysPickerForPostProductScreen';
import firebase from '../../Firebase.js';
import PostProduct from '../../functions/PostProduct';
import AwesomeAlert from 'react-native-awesome-alerts';
import uuid from 'react-native-uuid';
import InputScrollView from 'react-native-input-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { StackActions, NavigationActions } from 'react-navigation';
import * as ImageManipulator from 'expo-image-manipulator';
import Spinner from 'react-native-loading-spinner-overlay';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import Conditions from '../../components/product/conditions'
import SwitchToggle from 'react-native-switch-toggle';

var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
let storageRef;
//Success Image Url
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
let width = Dimensions.get('window').width;

let checkGoogleAddress= '';

export default class PostProductScreen extends Component {
  constructor(props) {
    super(props);
    storageRef = firebase.storage().ref();
    const{navigation} = this.props;
    const reference = navigation.getParam('data');
    this.productRef = firebase.firestore().collection('Products').doc(reference.id),
    this.state={
      postAdClicked: false,
      showAlert: true,
      showAlert2: false,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
      imageSizes:[],
      newImage:[],
      downloadURLs : [],
      User:null,
      Category: 0,
      Avability:[],
      owner: "",
      addressArray:[],
      picAlert : false,
      availableAlert:false,
      showAddressAlert:false,
      firstTimeOnly: true,
      lat: 0,
      long: 0,
      googleAddressEmpty: '',
      changingAddress:0,
      canUpload:true,
      priceAlert:false,
      uploadCounter:0,
      loading: false,
      isImagesChanged: false,
      allOldDeleted: false,
      switchValue: false,
      completeStringAddress:'',
      additionalData:null,
      deliveryVehicle:'',
      deliveryProvider:false,
      sellerDeliveryPrice:'',
      switchValue:false,
      switchOn1:true,
    }

    this.categoryRemover = React.createRef();
    this.avabilityRemover = React.createRef();
    this.addressRemover = React.createRef();
    this.conditionRemover = React.createRef();

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;
    if (user != null) {
      this.state.owner = user.uid;
      console.log(" State UID ==> from  " + this.state.Owner);
    }
  }

  componentDidMount() {

  var arrayCat = [this.state.Category]

  this.categoryRemover.current.onSelectedItemsChange(arrayCat);

  this.avabilityRemover.current.onSelectedItemsChange(this.state.Avability);

  var arrayCond = [this.state.additionalData.Condition]
  
  this.conditionRemover.current.onSelectedItemsChange(arrayCond)
  console.log("Delivery prov" + this.state.switchValue)

    

  }

  componentWillUnmount() {
    
  }
 

  componentWillMount() {
    const { navigation } = this.props;
  // Here Im calculating the height of the header and statusbar to set vertical ofset for keyboardavoidingview
  const headerAndStatusBarHeight = Header.HEIGHT + Constants.statusBarHeight;
  console.log('Header and Status Bar --> ' + headerAndStatusBarHeight);
  KEYBOARD_VERTICAL_OFFSET_HEIGHT =
    Platform.OS === 'ios'
      ? headerAndStatusBarHeight - 700
      : headerAndStatusBarHeight - 100;

      

    const newData = navigation.getParam('data');

    console.log(JSON.stringify(newData.additionalData) + "  That is the data");

    var truckOrCar = true;
    
    if(newData.deliveryVehicle == "Truck")
    {
     truckOrCar = false;
    }
    else
    {
      truckOrCar = true;
    }

    this.setState({
        title: newData.title,
        price:newData.price,
        image:newData.pictures,
        downloadURLs:newData.pictures,
        description:newData.description,
        thumbnail:newData.thumbnail,
        Category:newData.category,
        Avability:newData.availability,
        completeStringAddress:newData.sellerAddress,
        brandName:newData.additionalData.BrandName,
        additionalData:newData.additionalData,
        switchOn1:truckOrCar,
        deliveryVehicle:newData.additionalData,
        switchValue:newData.deliveryProvider,
        sellerDeliveryPrice:newData.sellerDeliveryPrice,

    })

    

    console.log("This is a cat " + this.state.Category);

   
  }
 
  showAlert(){
    this.setState({
      showAlert: true,
      
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
  };

  showAlert2 =()=> {
    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.completeStringAddress;

    console.log(address + " that is the real address")

    if(titleLength.length > 0 && priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>0 && timeArray.length>0 && address != '')  {
  
      this.setState({
        showAlert2: true
      });
      

  } else {
    console.log('hello');

    if(picArray.length==0){
      this.setState({
        picAlert:true,
      })      
    }

    if((priceLength < 10 || priceLength > 1000)){
      this.setState({
        priceAlert:true,
      })      
    }
    else if(timeArray.length==0){
      this.setState({
        availableAlert:true,
      })
    }

    console.log(address)

    if(address == ''){
      this.setState({
        showAddressAlert:true,
      })
    }

    this.setState({
      postAdClicked: true,
    })
    
  };
}

  hideAlert2(){
    const { navigate } = this.props.navigation;
    
    // this.avabilityRemover.current.changeState();
    // this.googlePlacesAutocomplete._handleChangeText('');
    // this.addressRemover.current.changeAddressState();

     this.setState({
       showAlert2: false,
       uploadCounter: 0,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
      newImage:[],
      downloadURLs : [],
      addressArray:[],
      uploadCounter:0,
      firstTimeOnly:true,

     });
    

   // this.saveChanges();
    this.resetStack();
  
    
    //navigate('Home');
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL && Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  //listens to the change in auth state
  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    if (user != null){
      if(user.emailVerified){ // note difference on this line
        this.setState({ User: user});
      }
    }
    else{
      this.setState({ User: null});
    }
  };

  
  //Uploading all the product related stuff
  uploadImageData =  async () =>{
    var arraySizes = this.state.imageSizes;
    var array = this.state.newImage; //getting the uri array
    console.log(array.length);
    var first = this.state.firstTimeOnly;
    var allDeleted = this.state.allOldDeleted;
    this.setState({ loading: true });
    array.forEach(async (element , index) => {

      if(first && allDeleted){
        first=false;
        this.setState({firstTimeOnly:false});
        await this.uploadThumbnailToFirebase(element , arraySizes[index])
        .then(()=>{
          
          console.log('Thumbnail got uploaded');
          
        })
        .catch(error=>{
          console.log("Hey there is an error:  " +error);
        });
      }

      await this.uploadImageToFirebase(element,  arraySizes[index])
      .then(() => {
        console.log('Success' + uuid.v1());
        
        
      })
      .catch(error => {
        console.log('Success' + uuid.v1()); 
        console.log(error);
      });

      
    });

}



   //start post the add button
  startEditTheProduct = async () =>{
    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.completeStringAddress;
    if(titleLength.length > 0 &&priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>2 && timeArray.length>0 && address != '')  {
    if(this.state.isImagesChanged){
      console.log(this.state.isImagesChanged);
    await this.uploadImageData();
    }
    else{
      console.log('Image data is not changed during editing');
      this.saveChanges();
    }
  } else {
    console.log('hello');

    if(picArray.length < 3){

      this.setState({
        picAlert:true,
      })

    }
    else if((priceLength < 10 || priceLength > 1000) && picArray.lengt>2){
      this.setState({
        priceAlert:true,
      })      
    }
    else if(timeArray.length==0 && picArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        availableAlert:true,
      })
    }

    console.log(address)

    if(address == '' && picArray.length!=0 && timeArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        showAddressAlert:true,
      })
    }

    this.setState({
      postAdClicked: true,
    })
  }
  }


  //post the product
  postTheProduct = async() =>{

    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.googleAddressEmpty;

    if(titleLength.length > 0 &&priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>0 && timeArray.length>0 && address != '')  {
  
    console.log('Download urls --> '+this.state.downloadURLs)
    var data = {
      Description : this.state.description,
      Name : this.state.title,
      Price : this.state.price,
      Pictures : this.state.downloadURLs,
      Thumbnail : this.state.thumbnail,
      Owner : this.state.owner,
      Flag : true,
      FavouriteUsers:[],
      TimeStamp: null,
      UserClicks:[],
      Category: this.state.Category,
      Avability: this.state.Avability,
      Status:'active',
      AddressArray: this.state.addressArray,
   
    }

    //Getting the current time stamp
    var currentDate = new Date();
    data.TimeStamp = currentDate.getTime();
    //if(this.checkFields == true)
    //Posting the product
    PostProduct(data);
    console.log("Product Posted---->" + JSON.stringify(data));

    //change the overlay visibility to visible
    //this.setState({isOverlayVisible:true});
    this.showAlert2();

  } else {
    console.log('hello');

    if((priceLength < 10 || priceLength > 1000) && picArray.length!=0){
      this.setState({
        priceAlert:true,
      })      
    }
    else if(timeArray.length==0 && picArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        availableAlert:true,
      })
    }

    console.log(address)

    if(address == '' && picArray.length!=0 && timeArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        showAddressAlert:true,
      })
    }

    this.setState({
      postAdClicked: true,
    })
  }

  };  
  /**
   * Function Description: Pick image from the gallery
   */
  _pickImage = async () => {

    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need photos permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2,
     // allowsEditing: true,
      
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        newImage: this.state.Image.concat([result.uri]), 
        isImagesChanged:true, 
        image: this.state.image.concat([result.uri]),
        imageSizes : this.state.imageSizes.concat([this.sizeOfImageObj(result)]),
      });
    }
  };

    /**
   * Function Description: Pick the image using the camera
   */
    
  _pickImageCamera = async () => {

    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2
      //allowsEditing: true,
      
    });
    
    console.log(result);

    if (!result.cancelled) {
      this.setState({
        newImage: this.state.newImage.concat([result.uri]), isImagesChanged:true, image: this.state.image.concat([result.uri]),
        imageSizes : this.state.imageSizes.concat([this.sizeOfImageObj(result)]),
      });
    }
  };

  // find the width and height of the image and put it to the object
  sizeOfImageObj = (result) =>{

    var imageWidth = result.width;
    var imageHeigth = result.height;
    var biggerSide =0;
    var smallerSide = 0 ;

    if(imageHeigth>imageWidth){
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }
    if(imageHeigth<imageWidth){
      biggerSide = imageWidth;
      smallerSide = imageHeigth;
    }
    if(imageHeigth == imageWidth)
    {
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }

    var localSizeObject = {
      'height' : imageHeigth,
      'width' : imageWidth,
    }

    return localSizeObject;
  }

  //Uploading the thumbnail to the Firebase Storage
  uploadThumbnailToFirebase = async (uri, localSizeObject)=>{

    console.log("width " + localSizeObject.width + " height " + localSizeObject.height)

    var changedH = {
      'isBiggest' : false,
      'value' : localSizeObject.height,
      'valid' : true,
    }
   var changedW = {
    'isBiggest' : false,
    'value' : localSizeObject.width,
    'valid' : true,
  }

  var difValue = 1 ;
   
   if(changedH.value < changedW.value){
     changedW.isBiggest = true;

    if(changedW.value  <= 400){
      changedW.valid = false
    }
    
   }
   else{
     changedH.isBiggest = true;
     if(changedH.value  <= 400){
       changedH.valid = false
     }
      
   }

    if(changedH.isBiggest == true && changedH.valid == true){
      difValue = Math.round(changedH.value/400);
    }

    if(changedW.isBiggest == true && changedW.valid == true){
      difValue =Math.round(changedW.value/400) ;
    }

    var finalH = 1 ; 
    var finalW = 1 ;
    
    finalH = changedH.value/difValue;

    finalW = changedW.value/difValue;

    console.log(finalW + "  " + finalH)

    console.log('inside the upload thumbnial function');

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize:{width:finalW, height:finalH} }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    )

      console.log("Hey I  am the ManipResult:  "+ manipResult.uri);

      
      const response = await fetch(manipResult.uri);
      const blob =  await response.blob();
      console.log('Inside Thumnail upload Image to Firebase')
      var uploadTask = storageRef.child('images/'+uuid.v1()).put(blob);
      const that = this;
      
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('Thumbnail File available at', downloadURL);
          that.setState({thumbnail:downloadURL}); // setting the Thumbnail URL
          var uploadC = that.state.uploadCounter+1;
          that.setState({uploadCounter:uploadC});

        });
      });
    }
  


  
  checkIfInputNotEmpty(text) {
      // console.log(text)
      // if(this.props.postAdClicked  == true && text.length == 0) {
      //     alert('Please input address')
      // }
      this.props.checkInputEmpty(text)
  }

  changeAddressState = () => {
     // this.GooglePlacesRef.setAddressText("");
     this.googlePlacesAutocomplete._handleChangeText('')
     let num =1 
     num = num + this.changeAddressState;

     this.setState({
         changingAddress: num
     })
  };



 //Uploading an Image to the Firebase
 uploadImageToFirebase = async (uri, localSizeObject) => {

  console.log("width " + localSizeObject.width + " height " + localSizeObject.height)

    var changedH = {
      'isBiggest' : false,
      'value' : localSizeObject.height,
      'valid' : true,
    }
   var changedW = {
    'isBiggest' : false,
    'value' : localSizeObject.width,
    'valid' : true,
  }

  var difValue = 1 ;
   
   if(changedH.value < changedW.value){
     changedW.isBiggest = true;

    if(changedW.value  <= 800){
      changedW.valid = false
    }
    
   }
   else{
     changedH.isBiggest = true;
     if(changedH.value  <= 800){
       changedH.valid = false
     }
      
   }

    if(changedH.isBiggest == true && changedH.valid == true){
      difValue = Math.round(changedH.value/800);
    }

    if(changedW.isBiggest == true && changedW.valid == true){
      difValue =Math.round(changedW.value/800) ;
    }

    var finalH = 1 ; 
    var finalW = 1 ;
    
    finalH = changedH.value/difValue;

    finalW = changedW.value/difValue;

    console.log(finalW + "  " + finalH)


  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize:{width:finalW, height:finalH} }],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  )


  const response = await fetch(manipResult.uri);
  const blob = await response.blob();
  console.log('INside upload Image to Firebase')
  var uploadTask = storageRef.child('images/'+uuid.v1()).put(blob);
  const that = this;
  
  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
      that.state.downloadURLs.push(downloadURL);

      console.log(that.state.uploadCounter);
      //some funcky stuff
      var uploadC = that.state.uploadCounter+1;
      that.setState({uploadCounter:uploadC});
      var array = that.state.newImage;
      var allDeleted = that.state.allOldDeleted;
      if(!allDeleted){
        if(uploadC==array.length){
          //call the post product function
          console.log("Number of products uploaded:" + uploadC);
          that.saveChanges();

          //that.resetStack();
        }
      }else{
        if(uploadC==array.length+1){
          //call the post product function
          console.log("Number of products uploaded:" + uploadC);
          that.saveChanges();
          //that.resetStack();
        }
      }
    });
  });
  return 'Success';
};
 

  //Delete Image on Remove
  deleteImageOnRemove(index) {
    var array = [...this.state.image]; // make a separate copy of the array
    console.log('This is array --> ' + index);
    //this.uploadImageToFirebase(array);
    array.splice(index, 1);

    var fireArray = [...this.state.downloadURLs];
    fireArray.splice(index,1);
    //console.log(array);
    this.setState({ image: array, downloadURLs:fireArray, isImagesChanged:true });

    //if after remove the image array is empty set allOldDeleted to true
    if(array.length==0){
      this.setState({allOldDeleted:true});
    }
  }

  // goToHome=()=>{
  //   this.setState({isOverlayVisible:!this.state.isOverlayVisible});
  //   this.props.navigation.navigate('Home');
  // }


  _renderImages() {
    let images = [];
    console.log("number of images we have: "+ this.state.image.length);

    //let remainder = 4 - (this.state.devices % 4);
    this.state.image.map((item, index) => {
      images.push(
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.deleteImageOnRemove(index);
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              key={index}
              source={{ uri: item }}
              style={{ width: 100, height: 100 }}
            />
            <Ionicons
              name='md-remove-circle'
              color='red'
              size={32}
              style={styles.deleteIcon}
            />
          </View>
        </TouchableOpacity>
      );
    });

    //reverse the array
    images.reverse();

    return images;
  }

  googleAddressCallback = (latitude, longitude) => {
    console.log('Latitude ' + latitude);
    console.log('Longitude ' + longitude);
    let addressArray = [latitude, longitude];
    this.setState({
      addressArray
    })


    //var latLongArray = dataFromChild.split(",");
  }

  googleAddressEmpty = (checkString) => {
    if (checkString.length == 0) {
      this.setState({
        googleAddressEmpty:'EMPTY'
      })
    } else {
      this.setState({
      googleAddressEmpty:checkString
      })
    }
  }


  //this functions gets the category id from the child component
  callbackFunction = (childData) => {
    this.setState({Category: childData[0]})
    console.log("from post product screen ==> "+ typeof childData[0])
  }

  avabilitycallbackFunction = (childData) => {
    this.setState({Avability: childData})
    console.log("product screen ==> "+ JSON.stringify(childData));
  }

  changeInputFieldFunction(text){
    

    if(this.state.postAdClicked) {
      if(text.length > 0){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forCategoryColor(text){
    
    
    if(this.state.postAdClicked) {
      console.log("it is here")
      console.log(this.state.Category)
      if(text > 0){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forPrice(text){
    
    
    if(this.state.postAdClicked) {
      if(text > 10 && text <1000){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forPictures =(pictures)=>{
    if(this.state.postAdClicked) {
      if(pictures.length >0){
        return true
      } else{
        return false
      }
    }

    return true    
  }

  hidePicAlert =() =>{
    this.setState({
      picAlert:false,
    })    
  }

  availabilityAlertHide =() =>{
       this.setState({
         availableAlert:false,
       })
  }

  addressAlert =() =>{
    this.setState({
      showAddressAlert:false,
    })
  }

  closePriceAlert =() =>{
    this.setState({
      priceAlert:false,
    })
  }

  testFunction(text){
    console.log('test fucntion');
    checkGoogleAddress = 'lalalals'
    console.log(checkGoogleAddress)
    this.state.googleAddressEmpty = '';
    //this.setState({googleAddressEmpty: 'test'})
    
  }

  saveButton =() =>{
    if(this.state.canUpload){
     return(
       <View
           style={{
             flexDirection: 'row',
             justifyContent: 'center',
             alignItems: 'center',
             margin: 10
           }}
         >
           <Button light rounded large style={styles.secondaryButton} onPress={()=>{this.startEditTheProduct()}}>
             <Text style = {styles.secondaryWhiteText}>Save</Text>
           </Button>
         </View>
     );
    }
    else{
     <View
     style={{
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       margin: 10
     }}
   >
     <Button disabled style={styles.secondaryButton} onPress={this.startEditTheProduct()}>
       <Text>Save changes</Text>
     </Button>
   </View>
    }
  }

  saveChanges(){

    console.log('this is a length of the downloadURLs array' + this.state.downloadURLs.length);
    console.log('this is a length ' + this.state.price);

    const additionaldataObject = {
      BrandName:this.state.brandName,
      Condition:this.state.condition
    }

    var truckOrCar = '';
    
    if(this.state.switchOn1 == false)
    {
     truckOrCar = "Truck"
    }
    else
    {
      truckOrCar = "Car"
    }


    var sellerPrice = ""
    if(this.state.switchValue)
    {
      console.log(this.state.switchValue + " This is the switch")
      sellerPrice = this.state.sellerDeliveryPrice
    }

    console.log(JSON.stringify(additionaldataObject)+ " Last obj ")
    this.productRef.update({
        Name:this.state.title,
        Pictures:this.state.downloadURLs,
        Price:this.state.price,
        Thumbnail : this.state.thumbnail, 
        Description:this.state.description,
        Category: this.state.Category,
        Avability: this.state.Avability,
        SellerAddress:this.state.completeStringAddress,
        AdditionalData:additionaldataObject,
        DeliveryVehicle:truckOrCar,
        DeliveryProvider:this.state.switchValue,
        SellerDeliveryPrice:sellerPrice,

    }).then(()=>{
      //show the alert
      this.setState({ loading: false });
      this.showAlert2();
    });

    //this.setState({isOverlayVisible:true});
    //this.resetStack();

  }

  resetStack = () => {
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
          }),
        ],
      }))
   }

   displayDeliveryPrice() {
    if (this.state.switchValue) {
        return <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                  <Foundation name='dollar' size={28}/>
                  <Input keyboardType='numeric' 
                    placeholder='0.00'
                    name="price"
                    onChangeText={(text)=>this.setState({sellerDeliveryPrice:text})}
                    value={this.state.sellerDeliveryPrice} 
                    maxLength={3}
                    returnKeyType='done'
                    style={{borderColor:'blue', borderWidth: 0.5, height:30, marginLeft:5 }}
                    />
              </View> 
    } else {
        return null
    }
}

getButtonText() {
    
  return this.state.switchOn1 ? '🚗Car' : '🚚Truck';
  
}

getRightText() {
  return this.state.switchOn1 ? '' : '🚗Car';
  //return 'Signup';
}

getLeftText() {
  //return this.state.switchOn1 ? 'Signup' : '';
  return '🚚Truck';
}

toggleSwitch = value => {
  //onValueChange of the switch this function will be called
  this.setState({ switchValue: value });
  //state changes according to switch
  //which will result in re-render the text
};


onPress1 = () => {
  this.setState({switchOn1: !this.state.switchOn1});
};

conditionCallBack = (callBack)=>{
  console.log( callBack[0]);
    this.setState({
      condition:callBack[0],
    })
}
  render() {

    let { image } = this.state;
    const { user } = this.state;
    const {showAlert} = this.state;
    const {showAlert2} = this.state;
    const {noPictures} = this.state.picAlert;
    
   
      return (
        <View style={{flex:1}}>
        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        <KeyboardAvoidingView

          style={{ flex: 1 }}
          behavior='height'
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}
        >
          <InputScrollView>
            <Content padder contentContainerStyle={{ justifyContent: 'center' }}>

              <Card style={this.forPictures(this.state.image) ? styles.correctStyle : styles.errorStyle}>
                <View  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>

                  <TouchableOpacity onPress={this._pickImage}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Ionicons name='ios-images' size={32} />
                    </CardItem>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this._pickImageCamera}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Foundation name='camera' size={32} />
                    </CardItem>
                  </TouchableOpacity>
                </View>
                <CardItem>
                  <ScrollView style={styles.scrollStyle} horizontal={true}>
                    {this._renderImages()}
                  </ScrollView>
                </CardItem>
                <Text style={{fontSize:12,margin:3}}>
                Tip: Please upload at least 3 images
              </Text>
              </Card>
              
              <Item style={[{ marginBottom: 10},this.changeInputFieldFunction(this.state.title) ? styles.correctStyle : styles.errorStyle]}>
                <Input placeholder='Title' 
                  name="title" 
                  onChangeText={(text)=>this.setState({title:text})}
                  value={this.state.title}
                  maxLength={50}
                  returnKeyType='done'
                    />
              </Item>
              <Item style={[{ marginBottom: 10},this.forPrice(parseInt(this.state.price)) ? styles.correctStyle : styles.errorStyle]}>
                <Foundation name='dollar' size={32} style={{ padding: 10 }} />
                <Input keyboardType='numeric' 
                  placeholder='0.00'
                  name="price"
                  onChangeText={(text)=>this.setState({price:text})}
                  value={this.state.price} 
                  maxLength={4}
                  returnKeyType='done'
                  />
                  
              </Item>

              {/* Pick category for the product */}
              <View style={[styles.productCategoryStyle, this.forCategoryColor(this.state.Category) ? styles.correctStyle : styles.errorStyle]}>
              <CategoryPickerForPostProduct parentCallback = {this.callbackFunction} ref={this.categoryRemover} />
              
              </View>
              
              
              
              {/* Depending on device(ios or android) we'll change padding to textarea inputs  */}
              <Form>
                {Platform.OS === 'ios' ? (
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder='Description'
                    name="description" 
                    onChangeText={(text)=>this.setState({description:text})}
                    value={this.state.description}
                    style={[styles.iosDescriptionStyle, this.changeInputFieldFunction(this.state.description) ? styles.correctStyle : styles.errorStyle]}
                    maxLength={500}
                    returnKeyType='return'
                    
                  />
                ) : (
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder='Description'
                    name="description" 
                    onChangeText={(text)=>this.setState({description:text})}
                    value={this.state.description}
                    style={[styles.androidDescriptionStyle, this.changeInputFieldFunction(this.state.description) ? styles.correctStyle : styles.errorStyle]}
                    maxLength={500}
                    returnKeyType='return'
                    
                  />
                )}
              </Form>
              <View style={[styles.productCategoryStyle, this.forPictures(this.state.Avability) ? styles.correctStyle : styles.errorStyle]}>
                <DaysPickerForPostProductScreen parentCallback={this.avabilitycallbackFunction} ref={this.avabilityRemover} />
              </View>

              <View
              style= {{
                borderColor:"blue",
                borderWidth:0.5,
                marginVertical: 10,
                padding : 4,
                backgroundColor:'white',
                
              }}>

              <Text style={
               {
                 marginLeft:5,
                 fontSize:20,
                 fontWeight:'500'
               } 
              }>
                Additional Information (optional)
              </Text>
              <Item
                 style={{
                 marginVertical:10,
                 backgroundColor:'white',
                 borderBottomColor:Colors.primary,
                 borderWidth:1,
               }}>
                <Input
               placeholder="Brand Name"
               name="Brand" 
               onChangeText={(text)=>this.setState({brandName:text})}
               value={this.state.brandName}
               maxLength={50}
               returnKeyType='done'
              />
              </Item>
              
              
                <Conditions ref ={this.conditionRemover} parentCallback={this.conditionCallBack} />
             

            </View>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.deliveryText}>Do you want to deliver?</Text>
            <Switch
              style={{ marginLeft: 10 }}
              onValueChange={this.toggleSwitch}
              value={this.state.switchValue}
            />
          </View>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
            <Text>{this.state.switchValue ? 'How much for delivery ?': 'CarGo will take care of delivery!'}</Text>
            {this.displayDeliveryPrice()}
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}> 
          <Text style={styles.carText}>Does item fit in?</Text>
          <SwitchToggle
          buttonText={this.getButtonText()}
          backTextRight={this.getRightText()}
          backTextLeft={this.getLeftText()}
          
          type={1}
          buttonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
          
          rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        
          buttonTextStyle={{fontSize: 15, color:'white'}}
          textRightStyle={{fontSize: 15}}
          textLeftStyle={{fontSize: 15}}

          containerStyle={{
            marginLeft:5,
            width: 160,
            height: 50,
            borderRadius: 27.5,
            padding: 3,
            borderWidth:1,
            borderColor:Colors.primary,
          }}
          backgroundColorOn='#fff'
          backgroundColorOff='#fff'
          circleStyle={{
            width: 80,
            height: 40,
            borderRadius: 27.5,
            backgroundColor: 'blue', // rgb(102,134,205)
          }}
          switchOn={this.state.switchOn1}
          onPress={this.onPress1}
          circleColorOff={Colors.primary}
          circleColorOn={Colors.primary}
          duration={100}
        />
        </View>

        {/* <TextInput
            placeholder= 'Pickup Address'
            underlineColorAndroid="transparent"
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.TextInputStyle}
            onChangeText = {text => this.setState({completeStringAddress: text, googleAddressEmpty: text})}
          /> */}

              <Input
              style={styles.TextInputStyle}
               placeholder="Pickup Address"
               name="PickUp" 
               onChangeText={(text)=>this.setState({completeStringAddress:text, googleAddressEmpty: text})}
               value={this.state.completeStringAddress}
               maxLength={100}
               returnKeyType='done'
              />

          
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Dimensions.get('screen').height*0.01,
              }}
            >
              {/* <Button style={styles.postAdButton} onPress={this.postTheProduct}>
                <Text>Post Ad</Text>
              </Button> */}
              <Button  light rounded large style={styles.secondaryButton} onPress={()=>{this.props.navigation.goBack()}}>
             <Text style={styles.secondaryWhiteText} >Cancel</Text>
            </Button>
              {this.saveButton()}               
            </View>
            </Content>
            
          </InputScrollView>
          </KeyboardAvoidingView>

          {/* <Overlay
            isVisible={this.state.isOverlayVisible}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            overlayBackgroundColor=" #f5f2d0"
            
            width="auto"
            height="auto"
            >
            <Image source={{uri:successImageUri}} style={{ width: 100, height: 100, marginBottom: 25 }}/>
            <Button onPress={this.goToHome}>
              <Text>Go to Home</Text>
            </Button>

          </Overlay> */}

          

            <AwesomeAlert
            show={showAlert2}
            showProgress={false}
            title="Awesome!"
            message={'Successfully changes'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to Home !!"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert2();
            }}
            onConfirmPressed={() => {
              this.hideAlert2();
            }}
          />

            <AwesomeAlert
            show={this.state.picAlert}
            showProgress={false}
            title="Oops!"
            message={'Please upload at least 3 images!'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.hidePicAlert();
            }}
          />
          

          <AwesomeAlert
            show={this.state.availableAlert}
            showProgress={false}
            title="Oops!"
            message={'Choose availability'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.availabilityAlertHide();
            }}
          />

            <AwesomeAlert
            show={this.state.showAddressAlert}
            showProgress={false}
            title="Oops!"
            message={'Choose pick up address'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.addressAlert();
            }}
          />

            <AwesomeAlert
            show={this.state.priceAlert}
            showProgress={false}
            title="Oops!"
            message={'price should be from 10 to 1000 $'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.closePriceAlert();
            }}
          />

          </View>
        
      );

    
  }
}

const styles = {
  mainConatiner: {
    flex: 1
  },
  imageUploadStyle: {
    height: 100,
    width: width/2 - 15,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center'
  },
  contentWrapperStyle: {},
  iosDescriptionStyle: {
    padding: 30,
    
  },
  androidDescriptionStyle: {
    padding: 20,
    borderRadius:1,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0
  },
  postAdButton: {
    flex: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height: 50,
  width: Dimensions.get('screen').width*0.3,
  margin: 5,
  backgroundColor: Colors.primary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  },
  productCategoryStyle:{
    //borderRadius:50,
    borderWidth:0.5,
    justifyContent:'center',
    marginTop: 5,
    //alignItems:'center'
  },

  errorStyle:{
    borderColor:'red',
    borderWidth: 0.5 ,
    //borderColor: 'green'
  },
  correctStyle:{
    borderColor: Colors.primary,
    borderWidth:0.5,
  },

  secondaryWhiteText: {
    color: "#fff",
    fontSize: Dimensions.get('window').width*0.04,
    fontWeight: "500",
    letterSpacing: 1.2
  },

  cancelButton:{
    color: "#fff",
    fontSize: Dimensions.get('window').width*0.04,
    fontWeight: "500",
    letterSpacing: 1.2
  },

  secondaryButton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height:Dimensions.get('window').height*0.065,
    width: Dimensions.get('window').width*0.35,
    margin: 5,
    backgroundColor: Colors.primary,
  },
  spinnerTextStyle: {
    color: '#0000FF'
  },

  TextInputStyle: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    //textAlign: "center",
    alignItems: "center",
    height: 40,
    //width: 120,
    borderRadius: 5,
    //margin: 10,
    marginTop:10,
    padding:10,
    //backgroundColor: "#f8f8f8",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },
};
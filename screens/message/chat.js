import React from 'react';

import {Text, View, Button} from 'react-native';
import firebaseChat from '../../FirebaseChat';
import ChatDynamicFlatList from '../../handlers/ChatDynamicFlatList';
import firebase from 'firebase';


let testObj ={}
class Chat extends React.Component {

  constructor(props) {
    super(props);
    // let chatObjects = this.getAllChats(firebaseChat.uid);
    var {navigate} = this.props.navigation;


    this.state = {
      messages: [],
      chats:{},
      filteredChats:{},
      userId: firebaseChat.uid
    };
    // this.getAllChats = this.getAllChats.bind(this)
    //this.getUserChatThread = this.getUserChatThread.bind(this)    
    //console.log(this.getAllChats(firebaseChat.uid))
    
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });


  componentWillMount() {

    //let chatObjects = firebaseChat.getAllChats(firebaseChat.uid);
    //this.setState({chats: chatObjects})
    
  }


    
  // }

  componentWillUnmount() {
    firebaseChat.refOff();
  }

  componentDidMount(){
    this.setState({ loading: true });
    firebase.database().ref('Chat').on('value', snapshot => {
      this.setState({ loading: false });

      this.setState({snapshot: snapshot.val()})

    for (var prop in snapshot.val()) {
      if (prop.includes(this.state.userId)) {
          // do stuff
          newObj = {chat: 'this is test'}
          console.log(prop)
          this.setState({filteredChats: newObj})
      }
    }

      this.setState({snapshot: snapshot.val()})
    });
      //this.getUserChatThread()

  }

  // getAllChats() {

  //   var urlRef = firebase.database().ref('Chat');
  //   let chatObjects=[];
  //   urlRef.once("value").then((snapshot) =>  {
  //     this.setState({chats: snapshot.val()})
  //     return chatObjects

  //   });

  
  // }

  render() {
    return (
      <View style ={styles.containerStyle}>
        {/* <ChatDynamicFlatList chats = {this.state.chats}/> */}

        <ChatDynamicFlatList chats = {this.state.filteredChats} navigation = {this.props.navigation}/>

      </View>
    );
  }



}

const styles = {
  containerStyle: {
    flex: 1,


  }
}

export default Chat;
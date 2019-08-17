import React from 'react';
import { Button, } from 'react-native';
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import TabBarIcon from '../components/navigation/TabBarIcon';
import ChatScreen from '../screens/message/chat';

export default (MessageStack = createStackNavigator({
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      title: 'Chat',
      //header: null
    }
  },
  
}));

MessageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let headerLeft;
  const prevScreen = navigation.getParam('PreviousScreen');

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {

      if (route.routeName === 'Chat') {
        tabBarVisible = true;
      } 
       else {
        tabBarVisible = false;
        
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='message1' />
  };
};
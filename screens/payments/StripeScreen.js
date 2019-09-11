import React, {Component} from 'react';
import {View, Text } from 'react-native';
import Stripe from '../../components/payments/stripe'


export default class StripeScreen extends Component {


  constructor(props){
    super(props);

    const { navigation } = this.props;
    const TotalCartAmount = parseFloat(navigation.getParam('TotalCartAmount')) ;
    const BuyerName = navigation.getParam('BuyerName');
    const Title = navigation.getParam('Title');
    const SellerAddress = navigation.getParam('sellerAddress');
    const Email = navigation.getParam('Email');
    const productID = navigation.getParam('productID');
    const userId = navigation.getParam('userId');


    this.state={
      TotalAmount: TotalCartAmount,
      BuyerName: BuyerName,
      SellerAddress: SellerAddress,
      Title: Title,
      Email:Email,
      productID:productID,
      userId:userId,
    }
  }

  render() {
    return(
      <View style= {styles.TestContainer}> 
        <Stripe Email ={this.state.Email} Title= {this.state.Title} SellerAddress ={this.state.SellerAddress} charge = {this.state.TotalAmount} BuyerName= {this.state.BuyerName} navigation={this.props.navigation} productID={this.state.productID} userId ={this.state.userId}/>
      </View>
    )
  }

}

const styles = {
  TestContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
}

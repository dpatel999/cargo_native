import React, {Component} from 'react';
import {View, Text,} from 'react-native';
import ProductThumbnail from './ProductThumbnail';

class ChatCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: '', description: '', price :'', image: '', id:'' , owner:'', pickupAddress: '', BuyerID:'', Status:''};
    }

    render() {
        return (
            <View style = {styles.containerStyle}>
                
             {/* This is thumbnail container  */}
                <View style = {styles.thumbnailContainer}>
                    <ProductThumbnail url = {this.props.thumbnail}/>    
                </View>
            {/* This is main content container with title and desc */}
                <View style = {styles.contentContainer}>
                    <Text style = {styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.title} </Text>
                    <Text style = {styles.descriptionStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.description}</Text> 
                    {/* <SmallButtonComponent text ={this.props.price} buttonColor = {Colors.secondary}/> */}
                </View>

            </View>
        )
    }

}


const styles = {

    containerStyle:{

        flexDirection: 'row',
        margin: 10,
        borderRadius: 5,
        //padding: 10,        justifyContent: 'space-between', 
        height: 125,
        // background: "#FDFCF5",
        backgroundColor:'#FDFCF5',
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
          height: 1,
          width: 0
        },
    },

    thumbnailContainer: {
        padding: 10,
    },

    contentContainer : {
        //flexDirection: 'column',
        flex: 2,
        //justifyContent: 'space-between',
        marginLeft: 5,
        marginBottom:20,
        padding: 10,
        
    },

    rightSideIconsContainer : {
        flex: 1,
        justifyContent: 'center',
        //padding: 10,
        // borderWidth:5,
        // borderColor:'black',
        alignItems:'center',
        //backgroundColor:Colors.secondary
    },

    titleStyle: {
        fontWeight: '900',
    },
    descriptionStyle :{
        flexWrap: 'wrap',
    },
    priceStyle:{
        fontWeight:'900',
        fontSize:20,
        
    }
}


export default ChatCard;
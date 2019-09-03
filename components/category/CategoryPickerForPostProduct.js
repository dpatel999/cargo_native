import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
  // this is the parent or 'item'
  {
    name: 'Categories',
    id: 0,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Clothing',
        id: 1,
      },
      {
        name: 'Furniture',
        id: 2,
      },
      {
        name: 'Sporting Goods, Exercise',
        id: 3,
      },
      {
        name: 'Home-Indoor',
        id: 4,
      },
      {
        name: 'Art, Collectables',
        id: 5,
      },
      {
        name: 'Home Appliances',
        id: 6,
      },
      {
        name: 'Baby Items',
        id: 7,
      },
      {
        name: 'Toys, Games',
        id: 8,
      },
      {
        name: 'Electronics',
        id: 9,
      },
      {
        name: 'Phones',
        id: 10,
      },
      {
        name: 'Computers',
        id: 11,
      },
      {
        name: 'Books',
        id: 12,
      },
      {
        name: 'Other',
        id: 13,
      },
    ],

  },

  {
    name: 'SubCategories',
    id: 1,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Lala lalal',
        id: 99
      }
    ]

  }

];

export default class extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems:[],
    };
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    console.log(typeof selectedItems);
    this.props.parentCallback(selectedItems);
  };

  render() {
    return (
        <View >
        <SectionedMultiSelect
          items={items}
          uniqueKey="id"
          subKey="children"
          selectText="Select Category"
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={true}  
              
        />
      </View>
    );
  }
}
import React from 'react';
import PropTypes from 'prop-types';

const CartItemComponent = ({ item }) => {
  // Component logic and JSX
};

CartItemComponent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  image: PropTypes.string.isRequired 
};

export default CartItemComponent;
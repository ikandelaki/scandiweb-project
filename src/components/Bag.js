import React from "react";
import "./Bag.css";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

// Importing actions
import { selectAttribute, addToCart, removeFromCart } from "../actions";

class Bag extends React.Component {
  // Render Attributes of a cart item
  renderAttributes = (item) => {
    return item.attributes.map((attribute) => {
      return (
        <div key={attribute.id} className="cart-attributes">
          <span className="cart-attribute">{attribute.name}:</span>
          <ul className={`cart-list ${attribute.type}`}>
            {attribute.items.map((attrItem) => {
              if (attribute.type === "text") {
                return (
                  <li
                    key={attrItem.id}
                    className={`${attrItem.selected ? "active" : ""}`}
                    onClick={() =>
                      this.props.selectAttribute(
                        item,
                        item.id,
                        attribute.id,
                        attrItem.id
                      )
                    }
                  >
                    {attrItem.value}
                  </li>
                );
              } else if (attribute.type === "swatch") {
                return (
                  <li
                    key={attrItem.id}
                    style={{ backgroundColor: attrItem.value }}
                    className={`${attrItem.selected ? "active" : ""}`}
                    onClick={() =>
                      this.props.selectAttribute(
                        item,
                        item.id,
                        attribute.id,
                        attrItem.id
                      )
                    }
                  >
                    {" "}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    });
  };

  // Render the details about the cart item
  renderItems = () => {
    if (!this.props.cart) return;

    return this.props.cart.map((cartItem) => {
      return (
        <div className="bag-item-container" key={cartItem.id}>
          <div className="bag-item-flex">
            <h2>{cartItem.brand}</h2>
            <h3>{cartItem.name}</h3>
            <span className="cart-item-price">
              {cartItem.prices.map((price) => {
                return price.currency.symbol === this.props.currency
                  ? price.currency.symbol + "" + price.amount
                  : null;
              })}
            </span>
            {this.renderAttributes(cartItem)}
          </div>
          {this.renderImageAndQuantity(cartItem)}
        </div>
      );
    });
  };

  // Render image and quantity regulator of the cart item
  renderImageAndQuantity = (item) => {
    return (
      <div className="product-quantity-picture">
        <div className="product-quantity">
          <div
            className="change-quantity-cart"
            onClick={() => this.props.addToCart(item)}
          >
            +
          </div>
          <div className="cart-item-quantity">{item.quantity}</div>
          <div
            className="change-quantity-cart"
            onClick={() => this.props.removeFromCart(item)}
          >
            -
          </div>
        </div>
        <div className="product-picture-cart">
          <Link
            to={`/product/${item.id}`}
            onClick={() => this.props.toggleCart(false)}
          >
            <img src={item.gallery[0]} alt="" />
          </Link>
        </div>
      </div>
    );
  };

  totalPrice = () => {
    // Calculating the total price of items in cart
    const prices = [];
    this.props.cart.forEach((cartItem) => {
      cartItem.prices.forEach((price) => {
        return price.currency.symbol === this.props.currency
          ? prices.push(price.amount * cartItem.quantity)
          : null;
      });
    });
    return prices.reduce((cur, price) => cur + price).toFixed(2);
  };

  render() {
    console.log(this.props.cart);
    return (
      <div className="bag-container">
        <h1>Cart</h1>
        <div className="bag-flex">{this.renderItems()}</div>
        {this.props.cart.length ? (
          <div className="order-items">
            <div>
              <span>Tax 21%:</span>
              <span>Quantity:</span>
              <span>Total:</span>
            </div>
            <div className="order-values">
              {/* Tax value */}
              <span>
                {this.props.currency}
                {((this.totalPrice() * 21) / 100).toFixed(2)}
              </span>
              {/* Number of items */}
              <span>
                {this.props.cart.reduce(
                  (cur, cartItem) => cur + cartItem.quantity,
                  0
                )}
              </span>
              {/* Price of items */}
              <span>
                {this.props.currency}
                {this.totalPrice()}
              </span>
            </div>
            <div className="order-btn">Order</div>
          </div>
        ) : (
          <p>There are no items in cart</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { cart: state.cart.cartItems, currency: state.currency };
};

export default connect(mapStateToProps, {
  selectAttribute,
  addToCart,
  removeFromCart,
})(Bag);

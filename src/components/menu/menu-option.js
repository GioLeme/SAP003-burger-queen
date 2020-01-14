import React from "react";
import Counter from "../counter/counter";
import "./menu.css";

const MenuOption = props => (
  <section>
    <div className="product-container">
      <div className="product-info">
        <div className="product-image">
          <img src={props.url_image} />
        </div>
        <div className="name-and-price">
          <p className="name-and-price-text">{props.name}</p>
          <p className="name-and-price-text">R$ {props.price},00</p>
        </div>
      </div>
      <Counter
        name={props.name}
        price={props.price}
        options={props.options}
        extras={props.extras}
      />
    </div>
  </section>
);

export default MenuOption;

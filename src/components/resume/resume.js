import React, { Component } from "react";
import Counter from "../counter/counter";
import fire from "../../config/firebase";
import { withRouter } from "react-router-dom";

import moment from "moment";
import SweetAlert from "sweetalert2-react";
import "./resume.css";

class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: [],
      show: false
    };

    this.getItemLocalStorage = () =>
      JSON.parse(localStorage.getItem("request"));

    this.loadProducts = () => {
      return this.state.request.products.map((actualProduct, index) => (
        <li key={index} className="request-line">
          <div className="request-resume-container">
            {actualProduct.quantity}
            {actualProduct.name}
            <div className="margin-left">
              {actualProduct.options
                ? ` de  ${actualProduct.options} `
                : ""}
             <span className="margin-left margin-right">{actualProduct.extras ? `e ${actualProduct.extras.name} extra` : ""}</span>
            </div>
            R${" "}
            {actualProduct.extras
              ? actualProduct.price + actualProduct.extras.price
              : actualProduct.price * actualProduct.quantity}{" "}
            ,00
          </div>
          <span onClick={this.updateRequest}>
            <Counter
              isResume={true}
              name={actualProduct.name}
              price={actualProduct.price}
              options={actualProduct.options}
              extras={actualProduct.extras}
            />
          </span>
        </li>
      ));
    };

    this.updateRequest = () => {
      this.setState({ request: this.getItemLocalStorage() });
    };

    this.sum = () => {
      return this.state.request.products.reduce(
        (LastSumProduct, actualProduct) => {
          if (actualProduct.extras && actualProduct.extras.price) {
            return (
              (LastSumProduct +
                actualProduct.price +
                actualProduct.extras.price) *
              actualProduct.quantity
            );
          }
          return (
            (LastSumProduct + actualProduct.price) * actualProduct.quantity
          );
        },
        0
      );
    };

    this.sendRequestToFirebase = () => {
      fire
        .firestore()
        .collection("requests")
        .doc()
        .set({
          ...this.state.request,
          createdAt: moment()
            .subtract(1, "hours")
            .format("DD/MM/YYYY  HH:mm:ss"),
          status: "toDo"
        })
        .then(() => {
          localStorage.removeItem("request");
          this.setState({ show: true });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/");
          }, 1700);
        });
    };
  }

  componentWillMount() {
    this.updateRequest();
  }

  render() {
    return (
      <div className="resume-container">
        <div>
          <h1 className="title-resume">Resumo</h1>
          <ul>
            <div className="product-request">
              {this.loadProducts().length > 0
                ? this.loadProducts()
                : "O pedido está vazio!"}
            </div>
          </ul>
        </div>
        <div className="resume-footer">
          <h3 className="total">Total: R$ {this.sum()},00</h3>
          <button
            className="button-resume"
            disabled={!this.loadProducts().length}
            onClick={this.sendRequestToFirebase}
          >
            Enviar pedido para a cozinha
          </button>
        </div>
        <SweetAlert
          show={this.state.show}
          type="success"
          title="Pedido Enviado"
          showConfirmButton={false}
        />
      </div>
    );
  }
}

export default withRouter(Resume);

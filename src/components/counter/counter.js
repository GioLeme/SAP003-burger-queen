import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import "./counter.css";
import DeleteIcon from "@material-ui/icons/Delete";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      modal: false,
      checkedOption: null,
      checkedExtra: null
    };

    this.getItemLocalStorage = () =>
      JSON.parse(localStorage.getItem("request"));

    this.getActualProduct = () => {
      const request = this.getItemLocalStorage();
      return request.products.filter(
        product => product.name === this.props.name
      );
    };

    this.decrement = () => {
      const request = this.getItemLocalStorage();
      request.products = request.products.map(product => {
        if (product.name === this.props.name) {
          product.quantity -= 1;
        }
        return product;
      });
      this.setState({ counter: this.state.counter - 1 });
      localStorage.setItem(
        "request",
        JSON.stringify(this.removeEmptyProduct(request))
      );
    };

    this.increment = () => {
      const actualProduct = this.getActualProduct();
      const request = this.getItemLocalStorage();
      if (actualProduct.length === 0) {
        request.products.push({
          name: this.props.name,
          price: this.props.price,
          quantity: 1
        });
      } else {
        request.products = request.products.map(product => {
          if (product.name === this.props.name) {
            product.quantity += 1;
          }
          return product;
        });
      }

      this.setState({ counter: this.state.counter + 1 });
      localStorage.setItem(
        "request",
        JSON.stringify(this.removeEmptyProduct(request))
      );
    };

    this.removeEmptyProduct = request => {
      request.products = request.products.filter(
        product => product.quantity !== 0
      );
      return request;
    };

    this.listOptions = () => {
      if (Array.isArray(this.props.options)) {
        return this.props.options.map(option => (
          <div key={option}>
            <Radio
              value={option}
              checked={this.state.checkedOption === option}
              onChange={() => this.setState({ checkedOption: option })}
            />
            <span>{option}</span>
          </div>
        ));
      }
    };

    this.listExtras = () => {
      if (Array.isArray(this.props.extras)) {
        return this.props.extras.map(extra => (
          <div key={extra.name}>
            <Radio
              value={extra.name}
              checked={this.state.checkedExtra === extra}
              onChange={() => this.setState({ checkedExtra: extra })}
            />
            <span>{extra.name}</span>
          </div>
        ));
      }
    };

    this.selectOptionsAndExtras = () => {
      this.setState({ modal: true });
    };

    this.sendOptionandExtrasToRequest = e => {
      e.preventDefault();
      const request = this.getItemLocalStorage();
      request.products.push({
        name: this.props.name,
        price: this.props.price,
        quantity: 1,
        options: this.state.checkedOption,
        extras: this.state.checkedExtra
      });
      localStorage.setItem(
        "request",
        JSON.stringify(this.removeEmptyProduct(request))
      );
      this.setState({ counter: this.state.counter + 1 });
      this.setState({ modal: false });
      this.setState({ checkedOption: null });
      this.setState({ checkedExtra: null });
    };

    this.hasOptionsOrExtras = () => {
      return this.props.options || this.props.extras;
    };

    this.removeProduct = () => {
      const request = this.getItemLocalStorage();
      request.products = request.products.filter(
        product => product.name !== this.props.name
      );
      localStorage.setItem(
        "request",
        JSON.stringify(this.removeEmptyProduct(request))
      );
    };
  }

  componentDidMount() {
    const actualProduct = this.getActualProduct();
    if (actualProduct[0] && !this.hasOptionsOrExtras()) {
      this.setState({ counter: actualProduct[0].quantity });
    } else if (this.hasOptionsOrExtras()) {
      this.setState({ counter: actualProduct.length });
    }
  }

  render() {
    return (
      <div>
        <div className="counter">
          {this.props.isResume && this.hasOptionsOrExtras() ? (
            ""
          ) : (
            <button
              className="counter-button"
              disabled={
                this.state.counter === 0 ||
                this.props.options ||
                this.props.extras
              }
              onClick={this.decrement}
            >
              -
            </button>
          )}
          {this.props.isResume && this.hasOptionsOrExtras() ? (
            ""
          ) : (
            <h1>{this.state.counter}</h1>
          )}
          {this.props.isResume && this.hasOptionsOrExtras() ? (
            ""
          ) : (
            <button
              className="counter-button"
              onClick={
                this.props.options || this.props.extras
                  ? this.selectOptionsAndExtras
                  : this.increment
              }
            >
              +
            </button>
          )}
          {this.props.isResume ? (
            <button className="delete-button" onClick={this.removeProduct}>
              <DeleteIcon />
            </button>
          ) : (
            ""
          )}
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={this.state.modal}
          onClose={() => this.setState({ modal: false })}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Fade in={this.state.modal}>
            <div
              style={{
                backgroundColor: "#fff",
                border: "2px solid #000",
                boxShadow: "4px 7px 20px 3px rgba(0,0,0,0.61)",
                padding: "10px",
                width: "60vw",
                height: "60vh"
              }}
            >
              <form onSubmit={this.sendOptionandExtrasToRequest} className='modal-form'>
              <h2 id="transition-modal-title" style={{ textAlign: "center" }}>
                Opções
              </h2>
                <div className='modal-content'>
                <div>
                  <p>Hambúrguer:</p>
                  {this.listOptions()}
                </div>
                <div>
                  <p>Adicionar porR$1,00:</p>
                  {this.listExtras()}
                </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <p>Este pedido só poderá ser removido na página de resumo.</p>
                <Button disabled={!this.state.checkedOption} type="submit"  style={{ width: "300px", backgroundColor: "#ab5466", marginTop: '10px'}}>
                  <span style={{ color: "#fff" }}>Pronto !</span>
                </Button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

export default Counter;

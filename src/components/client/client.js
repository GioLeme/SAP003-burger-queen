import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import "./client.css";

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      table: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.newRequest = this.newRequest.bind(this);
  }

  newRequest(e) {
    e.preventDefault();
    localStorage.setItem(
      "request",
      JSON.stringify({
        name: this.state.name,
        table: this.state.table,
        products: []
      })
    );
    this.props.history.push("/menu");
  }

  loadClientData() {
    const requestObject = JSON.parse(localStorage.getItem("request"));
    if (requestObject) {
      this.setState({ name: requestObject.name });
      this.setState({ table: requestObject.table });
    }
  }

  componentDidMount() {
    this.loadClientData();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="page-client">
        <form onSubmit={this.newRequest}>
          <div className="client-info">
            <p> Informações do cliente: </p>
            <div className="client-inputs">
              <TextField
                type="text"
                placeholder="Nome"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <TextField
                type="number"
                placeholder="Mesa"
                name="table"
                value={this.state.table}
                onChange={this.handleChange}
                style={{ marginLeft: "15px" }}
              />
            </div>
            <Button
              type="submit"
              disabled={this.state.name === "" || this.state.table === ""}
              style={{ backgroundColor: "#ab5466", marginTop: "15px" }}
            >
              <span style={{ color: "#fff" }}> Próximo ></span>{" "}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default Client;

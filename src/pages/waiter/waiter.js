import React, { Component } from "react";
import fire from "../../config/firebase";
import { withRouter } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import "./waiter.css";

class Waiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestList: []
    };
    this.clientInfo = this.clientInfo.bind(this);
    this.getDelivery = this.getDelivery.bind(this);
  }

  getDelivery() {
    return fire
      .firestore()
      .collection("requests")
      .get()
      .then(request => {
        const requestList = [];
        request.forEach(doc => requestList.push({ ...doc.data(), id: doc.id }));
        this.setState({
          requestList: requestList.filter(request => request.status === "done")
        });
      })
      .catch(err => err);
  }

  loadClientDelivery() {
    return this.state.requestList.map((data, index) => (
      <div className="requests" key={index}>
        <p>
          {data.name} - {data.table}
        </p>
        <Button onClick={() => this.updateRequest(data.id, "delivered")}>
          {" "}
          <CheckCircleOutlineIcon style={{ fill: "#7ed957" }} />{" "}
        </Button>
      </div>
    ));
  }

  async componentDidMount() {
    await this.getDelivery();
    setInterval(async () => {
      await this.getDelivery();
    }, 15000);
  }

  async updateRequest(id, status) {
    await fire
      .firestore()
      .collection("requests")
      .doc(id)
      .update({
        status
      });
    this.getDelivery();
  }

  clientInfo() {
    this.props.history.push("/client");
  }

  render() {
    return (
      <div className="page-waiter">
        <div className="main-waiter">
          <div className="deliver">
            <p className="deliver-header">Prontos para a entrega :</p>
            <div className="deliver-container">{this.loadClientDelivery()}</div>
          </div>
          <div className="new-request">
            <p className="request-title">Fazer um novo pedido</p>
            <Fab
              onClick={this.clientInfo}
              style={{
                backgroundColor: "#ab5466",
                width: "80px",
                height: "80px"
              }}
              aria-label="add"
            >
              <AddIcon style={{ fill: "#fff", fontSize: "40px" }} />
            </Fab>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Waiter);

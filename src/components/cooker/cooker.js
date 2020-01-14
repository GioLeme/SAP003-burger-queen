import React, { Component } from "react";
import fire from "firebase";
import Button from "@material-ui/core/Button";
import moment from "moment";
import "./cooker.css";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import WarningIcon from "@material-ui/icons/Warning";

class CookerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestList: [],
      requestStatus: ""
    };

    this.getRequestFirebase = () => {
      return fire
        .firestore()
        .collection("requests")
        .get()
        .then(request => {
          const requestList = [];
          request.forEach(doc =>
            requestList.push({ ...doc.data(), id: doc.id })
          );
          this.setState({
            requestList: requestList.filter(
              request =>
                request.status !== "done" && request.status !== "delivered"
            )
          });
        })
        .catch(err => err);
    };

    this.getUserId = () => fire.auth().currentUser.uid;

    this.updateRequest = async (id, status) => {
      await fire
        .firestore()
        .collection("requests")
        .doc(id)
        .update({
          status,
          cookerId: this.getUserId()
        });
      this.getRequestFirebase();
    };

    this.buttonName = request => {
      const userId = this.getUserId();
      if (request.status === "toDo") {
        return (
          <Button
            style={{ backgroundColor: "#7ed957", width: "70%" }}
            onClick={() => this.updateRequest(request.id, "doing")}
          >
            {" "}
            Preparar
          </Button>
        );
      }
      if (request.status === "doing" && request.cookerId !== userId) {
        return (
          <Button style={{ width: "70%" }} disabled>
            {" "}
            Em preparo...
          </Button>
        );
      }
      if (request.status === "doing" && request.cookerId === userId) {
        return (
          <Button
            style={{ backgroundColor: "#7ed957", width: "70%" }}
            onClick={() => this.updateRequest(request.id, "done")}
          >
            {" "}
            <CheckCircleOutlineIcon />{" "}
          </Button>
        );
      }
    };
    this.createRestaurantManager = () => {
      return this.state.requestList.map((actualRequest, actualIndex) => {
        const timeStatus = this.getRequestStatus(
          this.getTime(actualRequest.createdAt)
        );
        return (
          <div
            key={actualIndex}
            className={timeStatus + " " + "restaurant-manager"}
          >
            <div className="info">
              <p>Mesa {actualRequest.table}</p>
              <div className="timer">
                {this.statusIcon(timeStatus)}{" "}
                {this.getTime(actualRequest.createdAt)}
              </div>
            </div>
            <div className="request">
              {actualRequest.products.map((arrRequest, index) => (
                <div key={index} className="product">
                  <p>
                    {" "}
                    {arrRequest.quantity} {arrRequest.name}{" "}
                  </p>
                  <p className="options-extras"> {arrRequest.options || ""} </p>
                  <p className="options-extras">
                    {arrRequest.extras ? arrRequest.extras.name : ""}{" "}
                  </p>
                </div>
              ))}
            </div>
            <div className="button">
              <p className="lateMessage">
                {timeStatus === "late" ? "Atrasado" : ""}
              </p>
              {this.buttonName(actualRequest)}
            </div>
          </div>
        );
      });
    };

    this.getTime = time => {
      const startTime = moment(time, "DD/MM/YYYY HH:mm");
      const now = moment().add(2, "hours");
      return moment(moment(now).diff(startTime, "HH:mm")).format("HH:mm");
    };

    this.getRequestStatus = time => {
      const minutes = time.slice(-2);
      const hour = time.slice(1, 2);
      const handleMinutes = Number(minutes);
      const handleHours = Number(hour);
      if (handleHours > 0 || handleMinutes > 15) {
        return "late";
      }
      if (handleMinutes >= 0 && handleMinutes <= 10) {
        return "ok";
      }
      if (handleMinutes >= 11 && handleMinutes <= 15) {
        return "warning";
      }
    };

    this.statusIcon = status => {
      if (status === "late") {
        return <SentimentVeryDissatisfiedIcon style={{ fill: "#f57970" }} />;
      }
      if (status === "warning") {
        return <WarningIcon style={{ fill: "#ffcc4d" }} />;
      }
      if (status === "ok") {
        return <CheckCircleOutlineIcon style={{ fill: "#7ed957" }} />;
      }
    };
  }

  async componentWillMount() {
    await this.getRequestFirebase();
    setInterval(async () => {
      await this.getRequestFirebase();
    }, 30000);
  }

  render() {
    return <div className="manager">{this.createRestaurantManager()}</div>;
  }
}

export default CookerComponent;

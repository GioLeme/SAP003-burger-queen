import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import fire from "../../config/firebase";
import Logo from "../../assets/logo/hi.png";
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Logout from "../../assets/icons/logout.png";
import Fab from "@material-ui/core/Fab";
import "./header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.setState = {};

    this.logout = () => {
      fire
        .auth()
        .signOut()
        .then(() => this.props.history.push("/login"))
        .catch(error => error);
    };

    this.back = () => {
      this.props.history.goBack();
    };
  }

  render() {
    return (
      <div className="header">
        {window.location.pathname === "/" ? (
          <Fab style={{ visibility: "hidden" }} />
        ) : (
          <Fab
            onClick={this.back}
            style={{ backgroundColor: "#34b6a6", marginLeft: "5px" }}
            aria-label="add"
          >
            <ArrowBack style={{ fill: "#fff" }} />
          </Fab>
        )}
        <div className="logo-container">
          <p className="title">Burger Queen</p>
          <img className="logo" src={Logo} alt="Logo" />
        </div>
        <Button className="exit-button" onClick={this.logout}>
          <img className="logout" src={Logout} alt="Logout" />
        </Button>
      </div>
    );
  }
}

export default withRouter(Header);

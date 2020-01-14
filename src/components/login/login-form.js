import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Icon } from "@material-ui/core";
import fire from "../../config/firebase";
import Snackbar from "@material-ui/core/Snackbar";
import ErrorIcon from "@material-ui/icons/Error";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import "./login.css";
import Logo from "../../assets/logo/logo.png";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      snackbar: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login(e) {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push("/");
      })
      .catch(() => this.setState({ snackbar: true }));
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="login-page">
        <div className="main">
          <img style={{ maxWidth: "300px" }} src={Logo} alt="Logo" />

          <form className="form" onSubmit={this.login}>
            <TextField
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
              placeholder="email"
              name="email"
              className="input"
              style={{ width: "350px" }}
            />
            <TextField
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder="senha"
              name="password"
              className="input"
              style={{ width: "350px", margin: "10px 0px 10px 0px" }}
            />
            <Button
              type="submit"
              style={{ width: "350px", backgroundColor: "#ab5466" }}
            >
              <span style={{ color: "#fff" }}>Entrar</span>
            </Button>
          </form>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={3000}
            open={this.state.snackbar}
            onClose={() => this.setState({ snackbar: false })}
          >
            <SnackbarContent
              message={
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold"
                  }}
                >
                  <ErrorIcon style={{ marginRight: "10px" }} />
                  Email ou senha inválidos.
                </span>
              }
              style={{ backgroundColor: "#99001A" }}
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginForm);

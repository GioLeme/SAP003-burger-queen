import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Login from "./pages/login/login";
import fire from "./config/firebase";
import Waiter from "./pages/waiter/waiter";
import Cooker from "./pages/cooker/cooker";
import Client from "./components/client/client";
import Menu from "./pages/menu/menu";
import Header from "./components/header/header";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      componentToLoad: {
        waiter: Waiter,
        cooker: Cooker
      }
    };
  }

  componentDidMount() {
    this.authListener();
  }

  routerConfig() {
    return (
      <div>
        <CssBaseline />
        <BrowserRouter>
          {window.location.pathname === "/login" ? "" : <Header />}
          <Switch>
            <Route path="/login" component={Login} />
            <Route
              path="/"
              component={
                this.state.user
                  ? this.state.componentToLoad[this.state.user.profession]
                  : ""
              }
              exact
            />
            <Route path="/client" component={Client} />
            <Route path="/menu" component={Menu} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  setUser(userId) {
    return fire
      .firestore()
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          this.setState({ user: doc.data() });
        });
      })
      .catch(err => err);
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUser(user.uid);
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return <div>{this.routerConfig()}</div>;
  }
}

export default App;

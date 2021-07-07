import React from "react";
import Form from "components/form";
import Home from "./home";
import Menu from "./menu";
import Banner from "./banner";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";


class Root extends React.Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Banner/>
          <div id="page-home">
            <h1>Bienvenue dans PUBLIC ENEMY</h1>
          <Menu />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/papi" component={() => <Form type="papi" />} />
            <Route
              path="/capi"
              component={() => <Form type="capi" />}
            />
            <Route path="/cawi" component={() => <Form type="cawi" />} />
            <Route path="/cawiv2" component={() => <Form type="cawiv2" />} />
          
            <Redirect from="*" to="/" />
          </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default Root ;

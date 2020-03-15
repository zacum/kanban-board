import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";

import { theme } from "./const";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Navbar />
            <Switch>
              <Route path="/boards">
                <BoardList />
              </Route>
              <Route path="/b/:id">
                <BoardBar />
                <Board />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;

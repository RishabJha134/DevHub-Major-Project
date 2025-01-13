import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./Feed";

const App = () => {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body></Body>}>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/" element={<Feed></Feed>}>
                {" "}
              </Route>
              <Route path="/profile" element={<Profile></Profile>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;

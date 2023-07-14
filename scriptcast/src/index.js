import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";

const store = configureStore();
const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<div>loading...</div>}>
      <App />
    </PersistGate>
  </Provider>
);

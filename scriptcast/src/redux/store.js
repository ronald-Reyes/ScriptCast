import { createStore, applyMiddleware, combineReducers } from "redux";
import { user, script, projects, audioArray } from "./reducers";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const reducers = {
  script,
  user,
  projects,
  audioArray,
};
const persistConfig = {
  key: "root",
  storage,
  storageReconcile: autoMergeLevel2,
  blacklist: ["audioArray"],
  //audio store is blacklisted from persist because it can populate to localstorage exceeding the maximum size limit which is 10mb
  //which means every session user must synch database's audio collection with local store.
};

const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () =>
  createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));

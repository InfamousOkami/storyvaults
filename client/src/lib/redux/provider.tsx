"use client";

import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        {children}
      </PersistGate>
    </Provider>
  );
}

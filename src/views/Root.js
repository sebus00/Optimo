import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import MainTemplate from 'templates/MainTemplate';

const Root = () => (
  <Provider store={store}>
    <MainTemplate />
  </Provider>
);

export default Root;

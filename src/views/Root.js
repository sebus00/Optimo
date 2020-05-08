import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import MainTemplate from 'templates/MainTemplate';
import Managment from 'components/Managment/Managment';

const Root = () => (
  <Provider store={store}>
    <MainTemplate>
      <Managment />
    </MainTemplate>
  </Provider>
);

export default Root;

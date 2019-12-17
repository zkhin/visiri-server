import React from 'react';
import ReactDOM from 'react-dom';
import RegionsList from './RegionsList';

import { BrowserRouter } from 'react-router-dom'
import { MarkupContextProvider } from '../../contexts/MarkupContext'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <MarkupContextProvider>
        <RegionsList />
      </MarkupContextProvider>
    </BrowserRouter>,
    div
  )
  ReactDOM.unmountComponentAtNode(div);
});
import React from 'react';
import ReactDOM from 'react-dom';
import UploadPage from './UploadPage';
import { BrowserRouter } from 'react-router-dom'
import { MarkupContextProvider } from '../contexts/MarkupContext'

Konva.isBrowser=false

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <MarkupContextProvider>
        <UploadPage />
      </MarkupContextProvider>
    </BrowserRouter>,
    div
  )
  ReactDOM.unmountComponentAtNode(div);
});
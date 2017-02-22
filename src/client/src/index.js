import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

import io from 'socket.io-client';

var socket = io('http://localhost:8082');

ReactDOM.render(
  <App socket={socket} />,
  document.getElementById('root')
);

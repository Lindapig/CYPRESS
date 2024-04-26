// import React from "react";
// import ReactDOM from "react-dom";
// import "./stylesheets/index.css";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);


import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.render(

  <FakeStackOverflow />
    ,

  document.getElementById('root')
);

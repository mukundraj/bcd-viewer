import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from "react-ga4";

import 'bootstrap/dist/css/bootstrap.css'; // for slider
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'; // for slider
import 'react-bootstrap-typeahead/css/Typeahead.css'; // for typeahead
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css'; // for typeahead's bootstrap5 support (fixed clearButton issue)

ReactGA.initialize("G-YJETVHXCRD");
ReactGA.ga('set', 'anonymizeIp', true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

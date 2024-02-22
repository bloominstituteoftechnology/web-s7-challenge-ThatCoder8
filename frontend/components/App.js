import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home'
import Form from './Form'

function App() {
  return (
    <div id="app">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<Form />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;

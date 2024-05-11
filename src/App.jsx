import React from "react";
import styles from "./App.module.css";
import { Footer } from "./components/Footer/Footer";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Home } from "./pages/Home"; 
import { InsertionSort } from "./pages/AlgoPages/InsertionSort";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Routes>
          <Route path="/insertion-sort" element={<InsertionSort/>}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

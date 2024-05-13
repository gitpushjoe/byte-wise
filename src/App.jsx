import React from "react";
import styles from "./App.module.css";

import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { Home } from "./pages/Home"; 
import { AlgoPage } from "./components/AlgoPage/AlgoPage";

import InsertionSort from "./components/achilles/implementations/insertion_sort";
import MergeSort from "./components/achilles/implementations/merge_sort";
import SelectionSort from "./components/achilles/implementations/selection_sort";

import InsertionSortCode from "./data/code/insertion_sort/source_code.js";
import MergeSortCode from "./data/code/merge_sort/source_code.js";
import SelectionSortCode from "./data/code/selection_sort/source_code.js";

import Explanations from "./data/explanations.json";

function App() {
  return (
    <div className={styles.App}>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/insertion-sort" element={
            <AlgoPage 
              sourceCode={InsertionSortCode()}
              achillesStage={InsertionSort}
              explanation={Explanations['insertion-sort']}
              path="insertion-sort"
            />
          } />
          <Route path="/merge-sort" element={
            <AlgoPage 
              sourceCode={MergeSortCode()}
              achillesStage={MergeSort}
              explanation={Explanations['merge-sort']}
              path="merge-sort"
            />
          } />
          <Route path="/selection-sort" element={
            <AlgoPage 
              sourceCode={SelectionSortCode()}
              achillesStage={SelectionSort}
              explanation={Explanations['selection-sort']}
              path="selection-sort"
            />
          } />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

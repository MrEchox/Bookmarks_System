import React from 'react';
import { Route, HashRouter, Routes } from "react-router-dom";

import './App.css';
import Header from './components/Header' ;
import BookmarkManager from './components/content/BookmarkManager';

function App() {
  return (
    <HashRouter>
      <Header />
      <div className="App">
        <BookmarkManager />
      </div>
    </HashRouter>
  );
}

export default App;

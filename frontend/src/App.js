import React from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from "./utils/AuthContext";

import './App.css';
import Header from './components/Header' ;
import BookmarkManager from './components/content/BookmarkManager';
import Login from './components/auth/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <br />
        <div className="App">
          <Routes>
            {/* Private routes */}
            <Route path="/" element={<PrivateRoute element={<BookmarkManager />}/>}/>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

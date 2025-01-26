import React from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from "./utils/AuthContext";

import './App.css';
import Header from './components/Header' ;
import BookmarkManager from './components/content/BookmarkManager';
import Login from './components/auth/Login';
import Register from './components/auth/Registration';
import WorkspaceList from './components/content/WorkspaceList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <br />
        <div className="App">
          <Routes>
            {/* Private routes */}
            <Route path="/" element={<PrivateRoute element={<WorkspaceList />}/>}/> 
            <Route path="/workspaces" element={<PrivateRoute element={<WorkspaceList />}/>}/> 
            <Route path="/workspaces/:workspaceId/bookmarks" element={<PrivateRoute element={<BookmarkManager />}/>}/> 
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

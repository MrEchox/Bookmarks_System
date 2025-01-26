// Header.js
import React from "react";
import {Link} from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

import Logout from "./auth/Logout";

const Header = () => {
    const { isAuthed } = useAuth();
    return (
        <div className="header">
            <h2>Bookmarking System</h2>
            <div className="header-links">
                {isAuthed ? (
                        <>
                            <Link to="/workspaces">Workspaces</Link>
                            <span> | </span>
                            <Logout />
                        </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <span> | </span>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
            <br />
        </div>
    );
};

export default Header;
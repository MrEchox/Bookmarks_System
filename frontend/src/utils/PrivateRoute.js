import {Navigate} from 'react-router-dom'
import React from 'react';
import { useAuth } from "./AuthContext"; 

const PrivateRoute = ({element}) => {
    const { isAuthed } = useAuth();

    if (!isAuthed) {
        return <Navigate to="/login" />
    }
    return element;
}

export default PrivateRoute;
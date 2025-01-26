import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
} from "@mui/material";
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../../utils/ApiService';

const WorkspaceList = () => {
    const [workspaceList, setWorkspaceList] = useState([]);
    const [newWorkspace, setNewWorkspace] = useState({ name: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const workspaces = await getWorkspaces();
            setWorkspaceList(workspaces);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
            if (error.response && error.response.status === 404) {
                setErrorMessage("You do not have any workspaces.");
            }
        }
    }

    const addWorkspace = async () => {
        if (!newWorkspace.name) {
            setErrorMessage("Workspace name is required");
            return;
        }
        try {
            const workspace = await createWorkspace(newWorkspace);
            setWorkspaceList([...workspaceList, workspace]);
            setNewWorkspace({ name: "" });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
        }
    }

    const openWorkspace = (index) => {
        console.log("Opening workspace: ", workspaceList[index].id);
        navigate('/workspaces/' + workspaceList[index].id + '/bookmarks');
    }

    const removeWorkspace = (index) => {
        const workspaceId = workspaceList[index].id;
        console.log("Removing workspace with ID: ", workspaceId);
        try {
            deleteWorkspace(workspaceId);
            const newWorkspaceList = workspaceList.filter((workspace, i) => i !== index);
            setWorkspaceList(newWorkspaceList);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
        }
    }

    return (
        <div>
            <h1>Workspace List</h1>
            <div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <TextField
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    label="Workspace Name" />
                    <br />
                    <br />
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => {addWorkspace()}}
                >
                    Create Workspace
                </Button>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Workspace Name</TableCell>
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workspaceList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell align='center'>
                                        <Button variant="contained" color="primary" onClick={() => openWorkspace(index)}>Open</Button>
                                        <span> </span>
                                        <Button variant='contained' color="error" onClick={() => removeWorkspace(index)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default WorkspaceList;

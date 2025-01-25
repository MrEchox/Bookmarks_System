// BookmarkManager.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
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

const BookmarkManager = () => {
    const [bookmarks, setBookmarks] = useState([
        { name: "Google", url: "https://www.google.com", status: "Available" },
        { name: "Facebook", url: "https://www.facebook.com", status: "Checking" },
        { name: "GitHub", url: "https://github.com", status: "Redirecting" },
        { name: "Dead Link", url: "https://dead-link.com", status: "Dead" },
    ]);
    const [newBookmark, setNewBookmark] = useState({ name: "", url: ""});
    const [searchWord, setSearchWord] = useState("");

    const filteredBookmarks = bookmarks.filter((bookmark) => 
        bookmark.name.toLowerCase().includes(searchWord.toLowerCase())
    );

    // Add useEffect to check URL status

    const addBookmark = () => {
            setBookmarks([...bookmarks,
                { name: newBookmark.name, url: newBookmark.url, status: "Checking"}
            ]);
        setNewBookmark({ name: "", url: ""});
    };

    const removeBookmark = (index) => {
        setBookmarks(bookmarks.filter((_, i) => i !== index));
    };

    const checkUrlStatus = (url) =>{
        // Add API call to backend to check URL status
    }

    return (
        <div>
            <h2>Bookmark Manager</h2>

            {/* Add Bookmark */}
            <div>
                <TextField
                    label="Name"
                    value={newBookmark.name}
                    onChange={(e) => setNewBookmark({ ...newBookmark, name: e.target.value })}
                />
                <TextField
                    label="URL"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                />
                <Button onClick={addBookmark}>Add Bookmark</Button>
            </div>
            <br />
            {/* List Bookmarks */}
            <div>
                <TextField
                    label="Search"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
                <TableContainer component={Paper}>
                    <Table aria-label="Your bookmarks">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Tag</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookmarks.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.tag}</TableCell>
                                    <TableCell>{row.url.length > 40 ? row.url.slice(0, 40) + '...' : row.url}</TableCell>
                                    <TableCell className={`row-status-${row.status}`}>{row.status}</TableCell>
                                    <TableCell>
                                        <Button>Open</Button>
                                        <Button>Edit</Button>
                                        <Button onClick={() => removeBookmark(index)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default BookmarkManager;
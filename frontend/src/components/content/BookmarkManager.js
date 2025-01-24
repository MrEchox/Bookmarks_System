import React, {useState} from 'react';
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
        { name: "Dead Link", url: "https://dead-link.com", status: "Dead" },
    ]);
    const [newBookmark, setNewBookmark] = useState({ name: "", url: ""});

    const addBookmark = () => {
        if (newBookmark.name && newBookmark.url) {
            setBookmarks([...bookmarks,
                { name: newBookmark.name, url: newBookmark.url, status: "Not checked" }
            ]);
        }
        setNewBookmark({ name: "", url: ""});
    };

    const removeBookmark = (index) => {
        setBookmarks(bookmarks.filter((_, i) => i !== index));
    };

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

            {/* List Bookmarks */}
            <div>
                <TableContainer component={Paper}>
                    <Table aria-label="Your bookmarks">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookmarks.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.url}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>
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
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
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
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import {checkUrlStatus as checkUrlStatusAPI, getBookmarks, createBookmark, updateBookmark, deleteBookmark} from '../../utils/ApiService';

const BookmarkManager = () => {
    const { workspaceId } = useParams();

    const [bookmarks, setBookmarks] = useState([]);
    const [newBookmark, setNewBookmark] = useState({ name: "", url: ""});
    const [searchWord, setSearchWord] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editableBookmark, setEditableBookmark] = useState(null);

    const filteredBookmarks = bookmarks.filter((bookmark) => 
        bookmark.name?.toLowerCase().includes(searchWord.toLowerCase()) ||
        bookmark.tag?.toLowerCase().includes(searchWord.toLowerCase()) ||
        bookmark.url?.toLowerCase().includes(searchWord.toLowerCase())
    );

    const checkUrlStatus = async (url) => {
        console.log("Checking URL: ", url);
        return await checkUrlStatusAPI(url);
    };

    const updateStatuses = async () => {
        const updatedBookmarks = await Promise.all(
            bookmarks.map(async (bookmark) => {
                try {
                    const response = await checkUrlStatus(bookmark.url);
                    const status = response.status || "unknown";
                    return { ...bookmark, status };
                } catch (error) {
                    console.error(`Error checking status for URL ${bookmark.url}:`, error);
                    return { ...bookmark, status: "error" };
                }
            })
        );
        setBookmarks(updatedBookmarks);
    };
    

    useEffect(() => {
        fetchBookmarks();
    }, []);

    useEffect(() => { 
        const interval = setInterval(() => {
            updateStatuses();
        }, 500000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        updateStatuses();
    }, [bookmarks.length]);


    const fetchBookmarks = async () => {
        try {
            const bookmarks = await getBookmarks(workspaceId);
            console.log("Fetched bookmarks: ", bookmarks);
            setBookmarks(bookmarks);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
            if (error.response && error.response.status === 404) {
                setErrorMessage("You do not have any bookmarks.");
            }
        }
    };

    const addBookmark = async () => {
        if (!newBookmark.name || !newBookmark.url || !newBookmark.tag) {
            setErrorMessage("Name and URL are required!");
            return;
        }
        if (!newBookmark.url.startsWith("http://") && !newBookmark.url.startsWith("https://")) {
            setErrorMessage("URL must start with http:// or https://");
            return;
        }
        try {
            const bookmark = await createBookmark(workspaceId, newBookmark);
            setBookmarks([...bookmarks, bookmark]);
            setNewBookmark({ name: "", url: "", tag: "" });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
        }
    }

    const openBookmark = (url) => {
        console.log("Opening URL: ", url);
        window.open(url, "_blank");
    }

    const removeBookmark = (index) => {
        console.log("Removing bookmark at index: ", index);
        try {
            deleteBookmark(workspaceId, bookmarks[index].id);
            const newBookmarkList = bookmarks.filter((bookmark, i) => i !== index);
            setBookmarks(newBookmarkList);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
        }
    }

    const handleEditClick = (index) => {
        console.log("Editing bookmark at index: ", index);
        setEditableBookmark(bookmarks[index]);
        setOpenEditModal(true);
    }

    const handleEditSave = async () => {
        try {
            await updateBookmark(workspaceId, editableBookmark.id, editableBookmark);
            const updatedBookmarks = bookmarks.map((bookmark) => {
                if (bookmark.id === editableBookmark.id) {
                    return editableBookmark;
                }
                return bookmark;
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized. Please login again.");
            }
        } finally {
            setEditableBookmark(null);
            setOpenEditModal(false);
            fetchBookmarks();
        }
    }

    return (
        <div>
            <h2>Bookmark Manager</h2>
            {/* Add Bookmark */}
            <div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
                <TextField
                    label="Tag"
                    value={newBookmark.tag}
                    onChange={(e) => setNewBookmark({ ...newBookmark, tag: e.target.value })}
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
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookmarks.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.tag}</TableCell>
                                    <TableCell>{row.url && row.url.length > 40 ? row.url.slice(0, 40) + '...' : row.url}</TableCell>
                                    <TableCell className={`row-status-${row.status || "Checking"}`}>
                                        {row.status || "Checking..."}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Button variant='contained' color="primary" onClick={() => openBookmark(row.url)}>Open</Button>
                                        <span> </span>
                                        <Button variant='contained' color="secondary" onClick={() => handleEditClick(index)}>Edit</Button>
                                        <span> </span>
                                        <Button variant='contained' color="error" onClick={() => removeBookmark(index)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Edit Bookmark Modal */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <DialogTitle>Edit Bookmark</DialogTitle>
                <br />
                <DialogContent>
                    {editableBookmark && (
                        <>
                            <TextField
                                label="Name"
                                value={editableBookmark.title}
                                onChange={(e) => setEditableBookmark({ ...editableBookmark, title: e.target.value })}
                            />
                            <br />
                            <br />
                            <TextField
                                label="URL"
                                value={editableBookmark.url}
                                onChange={(e) => setEditableBookmark({ ...editableBookmark, url: e.target.value })}
                            />
                            <br />
                            <br />
                            <TextField
                                label="Tag"
                                value={editableBookmark.tag}
                                onChange={(e) => setEditableBookmark({ ...editableBookmark, tag: e.target.value })}
                            />
                            <br />
                            <br />
                            <Button onClick={handleEditSave}>Save</Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookmarkManager;
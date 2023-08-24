const express = require("express");
const app = express();
const notesRouter = require("./notes/notes.router");
const ratingsData = require("./data/ratings-data"); // Import ratings data
const notesData = require("./data/notes-data"); // Import notes data

app.use(express.json());
app.use("/notes", notesRouter);

// Helper function to get a note by ID
function getNoteById(noteId) {
  return notesData.find(note => note.id === noteId);
}

// Helper function to get ratings by noteId
function getRatingsByNoteId(noteId) {
  return ratingsData.filter(rating => rating.noteId === noteId);
}

// Helper function to get rating by noteId and ratingId
function getRatingByNoteIdAndRatingId(noteId, ratingId) {
  return ratingsData.find(rating => rating.noteId === noteId && rating.id === ratingId);
}

// Helper function to get rating by ratingId
function getRatingById(ratingId) {
  return ratingsData.find(rating => rating.id === ratingId);
}

// Task 1: Return All Ratings for a Note
app.get("/notes/:noteId/ratings", (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const note = getNoteById(noteId);

  if (!note) {
    return res.status(404).json({ error: `Note not found` });
  }

  const noteRatings = getRatingsByNoteId(noteId);

  const formattedRatings = noteRatings.map(rating => ({
    id: rating.id,
    noteId: rating.noteId,
    stars: rating.stars,
    comment: rating.comment,
  }));

  res.status(200).json({ data: formattedRatings });
});

// Task 2: Return a Specific Rating for a Note
app.get("/notes/:noteId/ratings/:ratingId", (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const ratingId = parseInt(req.params.ratingId);

  const note = getNoteById(noteId);
  if (!note) {
    return res.status(404).json({ error: `Note with ID ${noteId} not found` });
  }

  const rating = getRatingByNoteIdAndRatingId(noteId, ratingId);
  if (!rating) {
    return res.status(404).json({ error: `Rating with ID ${ratingId} not found` });
  }

  res.json({ data: rating });
});


// Task 3: Return All Ratings
app.get("/ratings", (req, res) => {
  const response = {
    status: 200,
    data: ratingsData, // Use the correct ratings data array here
  };
  res.json(response);
});

// Task 4: Return a Specific Rating
app.get("/ratings/:ratingId", (req, res) => {
  const ratingId = parseInt(req.params.ratingId);
  const rating = getRatingById(ratingId);

  if (!rating) {
    return res.status(404).json({ error: "Rating not found" });
  }

  res.json({ data: rating }); // Wrap the response in an object with a "data" key
});

// Task 6: Handle Unhandled HTTP Methods
app.all("*", (req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

// Not-found handler
app.use((req, res, next) => {
  return next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;

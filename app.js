/** Express app for bookstore. */

// app.js
const express = require("express");
const app = express();
const bookRoutes = require("./routes/books");

app.use(express.json());
app.use("/books", bookRoutes);

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		error: err.message || "Internal Server Error",
	});
});

module.exports = app;

/** general error handler */

app.use(function (err, req, res, next) {
	res.status(err.status || 500);

	return res.json({
		error: err,
		message: err.message,
	});
});

module.exports = app;

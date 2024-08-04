// routes/books.js
const express = require("express");
const router = new express.Router();
const Book = require("../models/book");
const { validateBook } = require("../middleware/validation");

router.get("/", async (req, res, next) => {
	try {
		const books = await Book.findAll();
		res.json({ books });
	} catch (err) {
		next(err);
	}
});

router.post("/", validateBook, async (req, res, next) => {
	try {
		const book = await Book.create(req.body);
		res.status(201).json({ book });
	} catch (err) {
		next(err);
	}
});

router.get("/:isbn", async (req, res, next) => {
	try {
		const book = await Book.findOne(req.params.isbn);
		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}
		res.json({ book });
	} catch (err) {
		next(err);
	}
});

router.put("/:isbn", validateBook, async (req, res, next) => {
	try {
		const book = await Book.update(req.params.isbn, req.body);
		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}
		res.json({ book });
	} catch (err) {
		next(err);
	}
});

router.delete("/:isbn", async (req, res, next) => {
	try {
		await Book.delete(req.params.isbn);
		res.json({ message: "Book deleted" });
	} catch (err) {
		next(err);
	}
});

module.exports = router;

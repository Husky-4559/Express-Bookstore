// test/books.test.js
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../config");

let book = {
	isbn: "0691161518",
	amazon_url: "http://a.co/eobPtX2",
	author: "Matthew Lane",
	language: "english",
	pages: 264,
	publisher: "Princeton University Press",
	title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
	year: 2017,
};

beforeEach(async () => {
	await db.query("DELETE FROM books");
	await db.query(
		"INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		[
			book.isbn,
			book.amazon_url,
			book.author,
			book.language,
			book.pages,
			book.publisher,
			book.title,
			book.year,
		]
	);
});

afterAll(async () => {
	await db.end();
});

describe("GET /books", () => {
	test("Get a list of books", async () => {
		const res = await request(app).get("/books");
		expect(res.statusCode).toBe(200);
		expect(res.body.books).toHaveLength(1);
		expect(res.body.books[0]).toHaveProperty("isbn");
	});
});

describe("POST /books", () => {
	test("Create a new book", async () => {
		const newBook = {
			isbn: "1234567890",
			amazon_url: "http://a.co/eobPtX3",
			author: "New Author",
			language: "english",
			pages: 300,
			publisher: "New Publisher",
			title: "New Book",
			year: 2021,
		};
		const res = await request(app).post("/books").send(newBook);
		expect(res.statusCode).toBe(201);
		expect(res.body.book).toHaveProperty("isbn");
	});

	test("Fail to create a new book with invalid data", async () => {
		const newBook = {
			isbn: "1234567890",
			amazon_url: "not a url",
			author: "New Author",
			language: "english",
			pages: "300",
			publisher: "New Publisher",
			title: "New Book",
			year: 2021,
		};
		const res = await request(app).post("/books").send(newBook);
		expect(res.statusCode).toBe(400);
		expect(res.body.errors).toBeTruthy();
	});
});

describe("GET /books/:isbn", () => {
	test("Get a single book", async () => {
		const res = await request(app).get(`/books/${book.isbn}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.book).toHaveProperty("isbn");
	});

	test("Fail to get a non-existing book", async () => {
		const res = await request(app).get("/books/nonexistingisbn");
		expect(res.statusCode).toBe(404);
	});
});

describe("PUT /books/:isbn", () => {
	test("Update an existing book", async () => {
		const updatedBook = {
			amazon_url: "http://a.co/eobPtX4",
			author: "Updated Author",
			language: "english",
			pages: 300,
			publisher: "Updated Publisher",
			title: "Updated Book",
			year: 2022,
		};
		const res = await request(app).put(`/books/${book.isbn}`).send(updatedBook);
		expect(res.statusCode).toBe(200);
		expect(res.body.book).toHaveProperty("isbn");
		expect(res.body.book.author).toBe(updatedBook.author);
	});

	test("Fail to update a book with invalid data", async () => {
		const updatedBook = {
			amazon_url: "not a url",
			author: "Updated Author",
			language: "english",
			pages: "300",
			publisher: "Updated Publisher",
			title: "Updated Book",
			year: 2022,
		};
		const res = await request(app).put(`/books/${book.isbn}`).send(updatedBook);
		expect(res.statusCode).toBe(400);
		expect(res.body.errors).toBeTruthy();
	});
});

describe("DELETE /books/:isbn", () => {
	test("Delete a book", async () => {
		const res = await request(app).delete(`/books/${book.isbn}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: "Book deleted" });
	});

	test("Fail to delete a non-existing book", async () => {
		const res = await request(app).delete("/books/nonexistingisbn");
		expect(res.statusCode).toBe(404);
	});
});

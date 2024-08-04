// models/book.js
const db = require("../config");

class Book {
	static async findAll() {
		const result = await db.query("SELECT * FROM books");
		return result.rows;
	}

	static async findOne(isbn) {
		const result = await db.query("SELECT * FROM books WHERE isbn = $1", [
			isbn,
		]);
		return result.rows[0];
	}

	static async create(data) {
		const result = await db.query(
			"INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
			[
				data.isbn,
				data.amazon_url,
				data.author,
				data.language,
				data.pages,
				data.publisher,
				data.title,
				data.year,
			]
		);
		return result.rows[0];
	}

	static async update(isbn, data) {
		const result = await db.query(
			"UPDATE books SET amazon_url=$1, author=$2, language=$3, pages=$4, publisher=$5, title=$6, year=$7 WHERE isbn=$8 RETURNING *",
			[
				data.amazon_url,
				data.author,
				data.language,
				data.pages,
				data.publisher,
				data.title,
				data.year,
				isbn,
			]
		);
		return result.rows[0];
	}

	static async delete(isbn) {
		await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
	}
}

module.exports = Book;

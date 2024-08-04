// middleware/validation.js
const Ajv = require("ajv");

const ajv = new Ajv();

const bookSchema = {
	type: "object",
	properties: {
		isbn: { type: "string" },
		amazon_url: { type: "string", format: "uri" },
		author: { type: "string" },
		language: { type: "string" },
		pages: { type: "integer" },
		publisher: { type: "string" },
		title: { type: "string" },
		year: { type: "integer" },
	},
	required: [
		"isbn",
		"amazon_url",
		"author",
		"language",
		"pages",
		"publisher",
		"title",
		"year",
	],
	additionalProperties: false,
};

const validateBook = (req, res, next) => {
	const validate = ajv.compile(bookSchema);
	const valid = validate(req.body);

	if (!valid) {
		return res.status(400).json({ errors: validate.errors });
	}

	next();
};

module.exports = { validateBook };

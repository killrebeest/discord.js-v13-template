const mongoose = require("mongoose");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

class Database {
	constructor() {
		this.connection = null;
	}

	connect() {
		console.log("Connecting to database...");

		mongoose
			.connect(process.env.DATABASE_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log("Client has connected to database.");
				this.connection = mongoose.connection;
			})
			.catch((err) => {
				console.error(err);
			});
	}
}

module.exports = Database;
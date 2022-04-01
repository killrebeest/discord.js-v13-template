const mongoose = require("mongoose");

const AntiLinkSchema = new mongoose.Schema({
	guild_id: String,
	toggled: String,
});

module.exports = mongoose.model("AntiLink", AntiLinkSchema);
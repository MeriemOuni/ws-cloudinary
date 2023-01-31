// 1 require mongoose
const mongoose = require("mongoose");

// create schema
const schema = mongoose.Schema;

const contactSchema = new schema({
	name: String,
	email: String,
	password: String,
	profile_img: String,
	cloudinary_id: String,
});

module.exports = Contact = mongoose.model("contact", contactSchema);

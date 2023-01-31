const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../models/User");

// POST
router.post("/", upload.single("image"), async (req, res) => {
	try {
		// Upload image to cloudinary
		const result = await cloudinary.uploader.upload(req.file.path);
		// Create new user
		let user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			profile_img: result.secure_url,
			cloudinary_id: result.public_id,
		});
		// save user details in mongodb
		await user.save();
		res.status(200).send({
			user,
		});
	} catch (err) {
		console.log(err);
	}
});

// GET
router.get("/:id", async (req, res) => {
	try {
		let user = await User.findbyId(req.param.id);
		if (!user)
			res.status(404).send({
				message: "User not found!",
			});
		res.status(200).send(JSON(user));
	} catch (err) {
		console.log(err);
	}
});

// DELETE
router.delete("/:id", async (req, res) => {
	try {
		// Find user by id
		let user = await User.findById(req.params.id);
		// Delete image from cloudinary
		await cloudinary.uploader.destroy(user.cloudinary_id);
		// Delete user from db
		await user.remove();
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});

// PUT
router.put("/:id", upload.single("image"), async (req, res) => {
	try {
		let user = await User.findById(req.params.id);
		// Delete image from cloudinary
		await cloudinary.uploader.destroy(user.cloudinary_id);
		// Upload new image to cloudinary
		const result = await cloudinary.uploader.upload(req.file.path);
		const data = {
			name: req.body.name || user.name,
			profile_img: result.secure_url || user.profile_img,
			cloudinary_id: result.public_id || user.cloudinary_id,
		};
		user = await User.findByIdAndUpdate(req.params.id, data, {
			new: true,
		});
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});
module.exports = router;

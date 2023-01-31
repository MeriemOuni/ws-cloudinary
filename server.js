const express = require("express");

const app = express();

require("dotenv").config();

const connectDB = require("./config/connectDB");
connectDB();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use("/user", require("./routes/user"));

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
	error
		? console.error(`Faild to connect to the server !!!${error}`)
		: console.log(`Server running on port ${PORT} ...`);
});

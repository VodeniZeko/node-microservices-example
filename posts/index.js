const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const PORT = 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock data
const posts = {};

app.get("/posts", (req, res) => {
	res.send(posts);
});

app.post("/posts", async (req, res) => {
	const id = randomBytes(4).toString("hex");
	const { title } = req.body;

	posts[id] = { id, title };

	try {
		const response = await axios.post("http://localhost:4005/events", {
			type: "PostCreated",
			data: {
				id,
				title,
			},
		});

		console.log("Event sent successfully:", response.data);
	} catch (error) {
		console.error("Error sending event:", error);
		return res.status(500).send("Error creating post");
	}

	res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
	console.log("Received event", req.body.type);
	res.send({});
});

app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});

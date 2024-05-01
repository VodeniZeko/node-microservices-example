const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const PORT = 4002;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

handleEvent = (type, data) => {
	if (type === "PostCreated") {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}

	if (type === "CommentCreated") {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		post.comments.push({ id, content, status });
	}

	if (type === "CommentUpdated") {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		const comment = post.comments.find((comment) => {
			return comment.id === id;
		});
		comment.status = status;
		comment.content = content;
	}
};

app.get("/posts", async (req, res) => {
	res.send(posts);
});

app.post("/events", async (req, res) => {
	try {
		const { type, data } = req.body;

		handleEvent(type, data);

		res.send({});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal Server Error");
	}
});
app.listen(PORT, async () => {
	console.log(`Listening on port ${PORT}`);

	try {
		// Fetch all events, anytime the service starts and/or fails then goes back up
		const res = await axios.get("http://posts-clusterip-srv:4005/events");

		// Process all events to cath up
		for (let event of res.data) {
			console.log("Processing event:", event.type);
			handleEvent(event.type, event.data);
		}
	} catch (error) {
		console.error("Error:", error);
	}
});

const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const PORT = 4001;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock data
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
	const commentId = randomBytes(4).toString("hex");
	const { id } = req.params;
	const { content } = req.body;

	const comments = commentsByPostId[id] || [];

	comments.push({ id: commentId, content, status: "pending" });

	commentsByPostId[id] = comments;

	try {
		const response = await axios.post("http://localhost:4005/events", {
			type: "CommentCreated",
			data: {
				id: commentId,
				content,
				postId: id,
				status: "pending",
			},
		});

		console.log(response.data);
	} catch (error) {
		console.error("Error posting comment", error.message);
		res.status(500).send("Error posting comment");
	}

	res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
	try {
		const { type, data } = req.body;

		if (type === "CommentModerated") {
			const { postId, id, status, content } = data;
			const comments = commentsByPostId[postId];
			const comment = comments.find((comment) => {
				return comment.id === id;
			});
			comment.status = status;

			await axios.post("http://localhost:4005/events", {
				type: "CommentUpdated",
				data: {
					id,
					postId,
					status,
					content,
				},
			});
		}
		res.send({});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Error processing event");
	}
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

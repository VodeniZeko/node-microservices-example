const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 4002;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", async (req, res) => {
	res.send(posts);
});

app.post("/events", async (req, res) => {
	try {
		const { type, data } = req.body;

		if (type === "PostCreated") {
			const { id, title } = data;

			posts[id] = { id, title, comments: [] };
		}

		if (type === "CommentCreated") {
			const { id, content, postId, status } = data;

			const post = posts[postId];
			post.comments.push({ id, content, status });
		}

		res.send({});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal Server Error");
	}
});
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

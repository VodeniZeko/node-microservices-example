const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 4003;
const moderatedWords = [
	"abuse",
	"adult",
	"alcohol",
	"bully",
	"drugs",
	"hate",
	"kill",
	"racism",
	"sex",
	"violence",
];

function containsModeratedWord(comment, words) {
	const wordSet = new Set(words);
	const commentWords = comment.split(/\s+/);
	for (let word of commentWords) {
		if (wordSet.has(word)) {
			return true;
		}
	}
	return false;
}

app.post("/events", async (req, res) => {
	try {
		const { type, data } = req.body;

		if (type === "CommentCreated") {
			const status = containsModeratedWord(data.content, moderatedWords)
				? "rejected"
				: "approved";

			axios.post("http://posts-clusterip-srv:4005/events", {
				type: "CommentModerated",
				data: {
					id: data.id,
					postId: data.postId,
					status,
					content: data.content,
				},
			});
		}

		res.send({});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

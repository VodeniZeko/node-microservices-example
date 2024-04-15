const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const PORT = 4005;

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
	const event = req.body;

	try {
		await axios.post("http://localhost:4000/events", event);
		await axios.post("http://localhost:4001/events", event);
		//await axios.post("http://localhost:4002/events", event);

		res.send({ status: "OK" });
	} catch (error) {
		console.error("Error handling event:", error.message);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Event-bus listening on port ${PORT}`);
});

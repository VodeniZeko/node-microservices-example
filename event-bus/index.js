const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const PORT = 4005;

const app = express();
app.use(bodyParser.json());

const events = [];

app.get("/events", (req, res) => {
	// any failed services get back up and running can request all events
	// from the event-bus and re-process them
	res.send(events);
});

app.post("/events", async (req, res) => {
	const event = req.body;

	// Log/store the event in case any of the services fails
	events.push(event);

	try {
		await axios.post("http://posts-clusterip-srv:4000/events", event);
		// await axios.post("http://localhost:4001/events", event);
		// await axios.post("http://localhost:4002/events", event);
		// await axios.post("http://localhost:4003/events", event);

		res.send({ status: "OK" });
	} catch (error) {
		console.error("Error handling event:", error.message);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Event-bus listening on port ${PORT}`);
});

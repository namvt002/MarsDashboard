const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));


//get apod with axios
app.get("/apod", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    );

    res.send({ data: response.data }); //response.data
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "An error occurred" });
  }
});

//get rover with axios
app.get("/rovers/:name", async (req, res) => {
  try {
    const response = await axios.get(
      // `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/photos?sol=1000&api_key=${process.env.API_KEY}` not Perseverance if use
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`
      );

    res.send(response.data); //response.data
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "An error occurred" });
  }
});

app.listen(port, () => console.log(`App listening on port http://localhost:${port} `));

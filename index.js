const express = require("express");
const bodyParser = require("body-parser");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const path = require("path");
const app = express();
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
// const fetch = require('node-fetch'); // Remove this line

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkAuth = (req, res, next) => {
  const user = firebase.auth().currentUser;
  req.isAuthenticated = !!user;
  next();
};
app.use(checkAuth);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/schedule", async (req, res) => {
  try {
    const fetch = await import("node-fetch");
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
    const response = await fetch.default(
      `https://api.tvmaze.com/schedule?country=US&date=${currentDate}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch schedule data: ${response.statusText}`);
    }
    const data = await response.json();

    // Extracting the show objects and episode objects
    const shows = data.map((item) => item.show);
    const episodes = data.map((item) => item);

    // Zipping shows and episodes together
    const showEpisodePairs = shows.map((show, index) => ({
      show,
      episode: episodes[index],
    }));

    res.render("schedule", { showEpisodePairs, currentDate }); // Pass the showEpisodePairs array and currentDate to the template
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    res
      .status(500)
      .send(`An error occurred while fetching schedule data: ${error.message}`);
  }
});

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: "AIzaSyAMuymXKCQ3qdCc0OoFLAJocB7OJAuqgaA",
  authDomain: "express-auth-71381.firebaseapp.com",
  projectId: "express-auth-71381",
  storageBucket: "express-auth-71381.appspot.com",
  messagingSenderId: "361663031242",
  appId: "1:361663031242:web:3010b4e632f20be7719133",
};
firebase.initializeApp(firebaseConfig);

const firestore = firebaseAdmin.firestore();

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });
    await firestore.collection("users").doc(userRecord.uid).set({
      email,
      name,
    });
    res.status(201).json({ userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    res.redirect(`/dashboard?userId=${userId}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/dashboard", async (req, res) => {
  const userId = req.query.userId;
  try {
    const userDoc = await firestore.collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      res.status(200).json({ name: userData.name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route to handle TVMaze API request
app.get("/api/search/", async (req, res) => {
  const showName = req.query.q;
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${showName}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from TVMaze API:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.get("/episodes", async (req, res) => {
  try {
    const showName = req.query.showName;
    const searchResponse = await fetch(
      `https://api.tvmaze.com/search/shows?q=${showName}`
    );
    const searchData = await searchResponse.json();
    const showId = searchData[0].show.id; // Get the ID of the first search result
    const episodesResponse = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    const episodesData = await episodesResponse.json();
    res.render("episodelist", { episodes: episodesData });
  } catch (error) {
    console.error("Error fetching show episodes:", error);
    res.status(500).send("An error occurred while fetching show episodes");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env.local") });
require("dotenv").config({ path: require("path").resolve(__dirname, ".env.production") });

const decoded = Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString('utf-8')
const serviceAccount = JSON.parse(decoded)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tahmid-sarker.github.io"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
initializeApp({
  credential: cert(serviceAccount)
});

// Create Token (Create)
app.post("/jwt", (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.JWT_ACCESS_SECRET, {expiresIn: '10d'});
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });
  res.send({token});
})

// Verify Cookie Token:
const VerifyJWTToken = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).send({message: "Unauthorize Access"})
  }
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, decode) => {
    if(error) {
      return res.status(401).send({message: "Unauthorize Access"})
    }
    req.decode = decode;
    next();
  })
}

// Verify Firebase Token:
const VerifyFirebaseToken = async(req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader) {
    return res.status(401).send({message: "Unauthorize Access"})
  }
  const token = authHeader.split(" ")[1];
  const decode = await getAuth().verifyIdToken(token)
  req.decode = decode;
  next();
}

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${user}:${password}@main-cluster.dfwadon.mongodb.net/?retryWrites=true&w=majority&appName=main-cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("userDB").collection("users");
const jobCollection = client.db("jobDB").collection("jobs");
const savedJobsCollection = client.db("savedJobDB").collection("savedJobs");
const applicationCollection = client.db("applicationDB").collection("applications")
const messageCollection = client.db("messageDB").collection("messages");

// USER PART:
// Create a user (Create)
app.post("/users", VerifyFirebaseToken, async (req, res) => {
  const newUser = req.body;
  const result = await userCollection.insertOne(newUser);
  res.send(result);
});

// Get user logged info (Update)
app.patch("/users/login", VerifyFirebaseToken, async (req, res) => {
  const { email, lastSignInTime } = req.body;
  const filter = { email: email };
  const updateDoc = {
    $set: {
      lastSignInTime: lastSignInTime,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// Update partial user info (Update)
app.patch("/dashboard/update-profile", VerifyJWTToken, async (req, res) => {
  const { name, photo } = req.body;
  const filter = { photo: photo };
  const updateDoc = {
    $set: {
      name: name,
      photo: photo,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
});

//JOB PART:
// Get featured jobs (Read)
app.get("/featured-jobs", VerifyJWTToken, async (req, res) => {
  const cursor = jobCollection.find().limit(4);
  const result = await cursor.toArray();
  res.send(result);
});

// Get all jobs (Read)
app.get("/jobs", async (req, res) => {
  const cursor = jobCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// Add a new job (Create)
app.post("/jobs", VerifyJWTToken, async (req, res) => {
  const newJob = req.body;
  const result = await jobCollection.insertOne(newJob);
  res.send(result);
});

// Get job details by ID (Read)
app.get("/jobs/:id", VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const job = await jobCollection.findOne(query);
  res.send(job);
});

// Update job by ID (Update)
app.patch("/jobs/:id", VerifyJWTToken, async (req, res) => {  
  const id = req.params.id;
  const updatedJob = req.body;
  delete updatedJob._id; // Remove _id to prevent MongoDB error
  const result = await jobCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedJob });
  res.send(result);
});

// Delete job by ID (Delete)
app.delete("/jobs/:id", VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await jobCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Save a job (Create)
app.post("/jobs/:id/save", async (req, res) => {
  const { jobId } = req.body;
  const exists = await savedJobsCollection.findOne({ jobId });
  if (exists) {
    return res.send({ exists: true });
  }
  const result = await savedJobsCollection.insertOne(req.body);
  res.send(result);
});

// Check if a job is already saved (Read)
app.get("/saved-jobs/:id/exists", VerifyJWTToken, async (req, res) => {
  const { id } = req.params;
  const exists = await savedJobsCollection.findOne({ jobId: id });
  res.send({ exists: !!exists });
});

// Check if user has applied for a job (Read)
app.get("/applications/:jobId/exists", VerifyJWTToken, async (req, res) => {
  const jobId = req.params.jobId;
  const { email } = req.query;
  const exists = await applicationCollection.findOne({ jobId, email });
  res.send({ exists: !!exists });
});

// Get all saved jobs (Read)
app.get("/saved-jobs", VerifyJWTToken, async (req, res) => {
  const cursor = savedJobsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// Remove saved job by ID (Delete)
app.delete("/saved-jobs/:id", VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await savedJobsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Get 3 other jobs (excluding current job)
app.get("/jobs/other/:id", VerifyJWTToken, async (req, res) => {
  const currentId = req.params.id;
  const cursor = jobCollection.find({ _id: { $ne: new ObjectId(currentId) } }).limit(3);
  const result = await cursor.toArray();
  res.send(result);
});

// Post application for a specific job (Create)
app.post("/jobs/:id/apply", VerifyJWTToken, async (req, res) => {
  const application = { ...req.body, appliedAt: new Date() };
  const result = await applicationCollection.insertOne(application);
  res.send(result);
});

//USER DASHBOARD:
// Get all applications for a user (Read)
app.get("/my-applications", VerifyJWTToken, async (req, res) => {
  const email = req.query.email;
  const result = await applicationCollection.find({ email }).toArray();
  res.send(result);
});

// Get single application by ID (Read)
app.get("/my-applications-details/:id", VerifyJWTToken, async (req, res) => {
  const { id } = req.params;
  const result = await applicationCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Delete an application (Delete)
app.delete("/my-applications/:id", VerifyJWTToken, async (req, res) => {
  const { id } = req.params;
  const result = await applicationCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Update an application (Update)
app.patch("/my-applications/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const result = await applicationCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  res.send(result);
});

// CONTACT MESSAGE PART:
// Contact Messages (Create)
app.post('/contact-message', async (req, res) => {
  const message = req.body;
  const result = await messageCollection.insertOne(message);
  res.send(result);
});

// Get all contact messages (Read)
app.get('/contact-messages', VerifyJWTToken, async (req, res) => {
  const result = await messageCollection.find().sort({ date: -1 }).toArray();
  res.send(result);
});

// Delete a contact message (Delete)
app.delete('/contact-messages/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await messageCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

//ADMIN DASHBOARD:
// Get all users
app.get("/users", VerifyJWTToken, async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
});

// Promote user to admin (Update)
app.patch("/users/:id/promote", VerifyJWTToken, async (req, res) => {
  const { id } = req.params;
  const result = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: { role: "admin" } });
  res.send(result);
});

// Delete a user (Delete)
app.delete("/users/:id", VerifyJWTToken, async (req, res) => {
  const { id } = req.params;
  const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Get all applications (Read)
app.get("/applications", VerifyJWTToken, async (req, res) => {
  const applications = await applicationCollection.find().toArray();
  res.send(applications);
});

// Delete an application by ID (Delete)
app.delete("/applications/:id", VerifyJWTToken, async (req, res) => {
  const appId = req.params.id;
  const result = await applicationCollection.deleteOne({ _id: new ObjectId(appId) });
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Job Hunt API");
});

// Only start listening once DB is connected
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
const uri =
  "mongodb+srv://adelinechen13:U1MV61ZZQ8qxQBut@cluster0.wy3h92h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const app = express();
const PORT = 3000;

app.use(cors());

app.use(json());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.get("/login/:id", (req, res) => {
  const id = req.params.id;
  console.log("getting");
  client.connect();
  findUserByName(client, id).then((response) => {
    console.log(response);
    res.json({ data: response });
  });
});

app.post("/create", (req, res) => {
  console.log("creating");
  const { username, password, balance, items } = req.body;
  client.connect();
  createUser(client, {
    username,
    password,
    balance,
    items,
  });
  res.send("creating");
});

app.put("/login/:id", (req, res) => {
  const id = req.params.id;
  console.log("updating");
  const { username, password, balance, items } = req.body;
  client.connect();
  updateUserByName(client, id, {
    username,
    password,
    balance,
    items,
  });
  res.send("updating");
});

app.listen(PORT, () => {
  console.log("Server is running");
});

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

/**
 * Create a new Airbnb user
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the david_website database
 * @param {Object} newUser The new user to be added
 */
async function createUser(client, newUser) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
  console.log("hi");
  const exists = await findUserByName(client, newUser.username);
  if (!exists) {
    const result = await client
      .db("david_website")
      .collection("users")
      .insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
  } else {
    console.log(`The username ${newUser.username} is already in use.`);
  }
}

/**
 * Print an Airbnb user with the given name
 * Note: If more than one user has the same name, only the first user the database finds will be printed.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the david_website database
 * @param {String} nameOfUser The name of the user you want to find
 */
async function findUserByName(client, nameOfUser) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
  const result = await client
    .db("david_website")
    .collection("users")
    .findOne({ username: nameOfUser });

  if (result) {
    console.log(
      `Found a user in the collection with the name '${result.username}':`
    );
    console.log(result);
    return result;
  } else {
    console.log(`No users found with the name '${nameOfUser}'`);
    return false;
  }
}

async function passwordMatchesName(username, password) {
  const user = await findUserByName(client, username);

  if (!user) {
    console.log(`The username ${newUser.username} does not yet exist.`);
    return false;
  } else {
    if (password == user.username) {
      console.log("matches");
      return true;
    } else {
      console.log("no match");
      return false;
    }
  }
}

/**
 * Update an Airbnb user with the given name
 * Note: If more than one user has the same name, only the first user the database finds will be updated.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the david_website database
 * @param {string} nameOfUser The name of the user you want to update
 * @param {object} updatedUser An object containing all of the properties to be updated for the given user
 */
async function updateUserByName(client, nameOfUser, updatedUser) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
  const result = await client
    .db("david_website")
    .collection("users")
    .updateOne({ username: nameOfUser }, { $set: updatedUser });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/**
 * Delete an Airbnb user with the given name.
 * Note: If more than one user has the same name, only the first user the database finds will be deleted.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the david_website database
 * @param {string} nameOfUser The name of the user you want to delete
 */
async function deleteUserByName(client, nameOfUser) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteOne for the deleteOne() docs
  const result = await client
    .db("david_website")
    .collection("users")
    .deleteMany({ username: nameOfUser });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/**
 * Print information indicating if a user with the given name exists.
 * If a user has the 'last_scraped' field, print that as well.
 * Note: If more than one user has the same name, only the first user the database finds will be printed..
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {String} nameOfUser The name of the user you want to find
 */
async function printIfUserExists(client, nameOfUser) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
  const result = await client
    .db("david_website")
    .collection("users")
    .findOne({ username: nameOfUser });

  if (result) {
    if (result.last_scraped) {
      console.log(
        `Found a user in the collection with the name '${nameOfUser}'. User was last scraped ${result.last_scraped}.`
      );
    } else {
      console.log(
        `Found a user in the collection with the name '${nameOfUser}'`
      );
    }
  } else {
    console.log(`No users found with the name '${nameOfUser}'`);
  }
}

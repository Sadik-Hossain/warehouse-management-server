const express = require("express");
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5001;
const app = express();

//* middleware
app.use(cors());
app.use(express.json());

//* ======= MongoDB =================

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvgmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const inventoryCollection = client
      .db("furnituredb")
      .collection("inventory");


    //*=========== get all from db ================ */
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });

 //* ======== endpoint for get particular data from db ==========
 app.get("/inventory/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await inventoryCollection.findOne(query);
  res.send(result);
});



  } finally {
   
  }
}
run().catch(console.dir);
// client.connect((err) => {
//   const collection = client.db("furnituredb").collection("inventory");
// //   console.log('db connet');
//   // perform actions on the collection object
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("server is running", port);
});

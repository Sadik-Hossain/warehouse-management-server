const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5001;
const app = express();

//* middleware
app.use(cors());
app.use(express.json());

//* ======= MongoDB =================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvgmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

    //*=============== update quantity ========================
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updateQty = req.body;
      //? filter hocce jetake update korte chao seta khuza
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      //? $set er moddhe obj akare jeta boshaba seta seta set hbe
      const updateDoc = {
        $set: {
          quantity: updateQty.quantity,
        },
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //* =========== Post new item =====================
    app.post("/inventory", async (req, res) => {
      const newItem = req.body;
      const result = await inventoryCollection.insertOne(newItem);
      res.send(result);
    });
    //*============= delete item ========================
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
    //*================== search query ==================
    app.get("/myitem", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("server is running", port);
});

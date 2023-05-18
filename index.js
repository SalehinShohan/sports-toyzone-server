const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxsnyx4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("SportsToyZone");
    const toysCollection = db.collection("toys");


    app.post('/addToy', async(req, res) => {
        const body = req.body;
        console.log(body)
        const result = await toysCollection.insertOne(body);
        console.log(result);
        res.send(result);
    })

    app.get('/allToys/:text', async(req, res) => {
      console.log(req.params.text)

      if(req.params.text=='sports' || req.params.text=='truck' || req.params.text=='police'){
        const result = await toysCollection.find({status: req.params.text}).toArray();
        return res.send(result);
      }

        const result = await toysCollection.find({}).toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("sports Server running");
});

app.listen(port, () => {
  console.log(`Sports toyzone on port: ${port}`);
});

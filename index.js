
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors({
  origin:[" http://localhost:5173", "https://jobify-extend.web.app"]
  })
  );
  app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnqomnb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const jobsCollection = client.db('jobifyExtend').collection('jobs');
const appliedJobCollections = client.db('jobifyExtend').collection('appliedJob');

async function run() {


  try {
    // Connect the client to the server	(optional starting in v4.7)


    // app.get('/jobs', async(req,res)=>{
    //     const cursor = jobsCollection.find();
    //     const result = await cursor.toArray();
    //     res.send(result)
    // });
    
    app.get('/jobs/:id', async(req,res)=>{
        const id = req.params.id;
        const query={_id: new ObjectId(id)};
        const result =await jobsCollection.findOne(query);
        res.send(result);
    })

    app.post('/jobs', async(req,res)=>{
        const myJob = req.body;
        console.log(myJob);
        const result = await jobsCollection.insertOne(myJob);
        res.send(result);
      })
    
    app.post('/appliedJob', async(req,res)=>{
        const myJob = req.body;
        console.log(myJob);
        const result = await appliedJobCollections.insertOne(myJob);
        res.send(result);
      })
    app.get('/appliedJob', async(req,res)=>{
      console.log(req.query.email);
      let query={}
      if(req.query?.email){
        query={email: req.query.email}
      }
        const cursor = appliedJobCollections.find(query);
        const result = await cursor.toArray();
        res.send(result)
    });

    app.get('/jobs', async(req,res)=>{
      console.log(req.query.email);
      let query={}
      if(req.query?.email){
        query={userEmail: req.query.email}
      }
        const cursor =jobsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
  });
  // updating card 
  app.get('/jobs/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await jobsCollection.findOne(query)
    res.send(result)
});

  app.put('/jobs/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updateJob = req.body;
    const updateDoc = {
        $set: {
          image:updateJob.image,
          name:updateJob.name,
          author:updateJob.author,
          type:updateJob.type,
          quantity:updateJob.quantity,
          description:updateJob.description,
          deadline:updateJob.deadline,
          salary:updateJob.salary

        },
    };
    const result = await jobsCollection.updateOne(query, updateDoc,options)
    res.send(result)
});

// delete cards
  app.delete('/jobs/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await jobsCollection.deleteOne(query)
    res.send(result)
  });

    // Send a ping to confirm a successful connection
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send("Jobify Extend is running")
})

app.listen(port ,()=>{
    console.log(`Jobify extend running port is:${port}`)
})



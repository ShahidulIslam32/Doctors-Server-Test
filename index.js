const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json())

// conncet node server with mongoDB

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qafv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const serviceCollection = client.db('doctors_portal').collection('services')
        const bookingsCollection = client.db('doctors_portal').collection('bookings')

        app.get('/service', async(req , res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        // send data to DB

        app.post('/booking', async (req , res) => {
            const booking = req.body
            const query = {treatment : booking.treatment , date : booking.date , patient: booking.patient}
            const exists = await bookingsCollection.findOne(query)
            if(exists){
                return res.send({success : false, booking : exists})
            }
            const result = await bookingsCollection.insertOne(booking)
            return res.send({ success: true, result })           
        })

        
    }
    finally{

    }
}
run().catch(console.dir)

// basic setup code
app.get('/', (req, res) => {
    res.send('Hello From Doctors Portal Site')
})

app.listen(port, () => {
    console.log(`Doctors app Running on port ${port}`)
})
const app = require('./api/app.js');

const port =  process.env.PORT || 3000

app.listen(port, () => { 
    console.log(`Server has started on port ${port}`); 
}); 


// const { MongoClient } = require('mongodb')
// // or as an es module:
// // import { MongoClient } from 'mongodb'

// // Connection URL
// const url = ???
// const client = new MongoClient(url)

// // Database Name
// const dbName = 'sample_analytics'

// async function main() {
//   // Use connect method to connect to the server
//   await client.connect()
//   console.log('Connected successfully to server')
//   const db = client.db(dbName)
//   const collection = db.collection('customers')

//   const findResult = await collection.find({}).toArray()
//   console.log('Found documents =>', findResult)

//   return 'done.'
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close())

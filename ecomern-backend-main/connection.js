require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = 'mongodb+srv://ecom:qwertyqwerty@atlascluster.b2idd9c.mongodb.net/ecom?retryWrites=true&w=majority';


mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})

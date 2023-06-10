const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const connectionStr =
  'mongodb+srv://ecom:qwertyqwerty@atlascluster.b2idd9c.mongodb.net/ecom?retryWrites=true&w=majority';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connection to MongoDB
mongoose
  .connect(connectionStr, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

mongoose.connection.on('error', (err) => {
  console.log(err);
});

// Models and Routes
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);

// Stripe payment route
app.post('/create-payment', async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.status(200).json(paymentIntent);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});



const server = http.createServer(app);
const io = new Server(server, {
  cors: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

app.set('socketio', io);

server.listen(8080, () => {
  console.log('Server running at port', 8080);
});

const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const server = require('http').Server(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/truyou', { useNewUrlParser: true, useUnifiedTopology: true });

// Redis setup
const redisClient = redis.createClient();

// JWT secret
const JWT_SECRET = 'your_jwt_secret';

// User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// API Endpoints
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.send({ message: 'User created successfully' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send({ message: 'Invalid password' });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.send({ token });
});

app.get('/api/streams', async (req, res) => {
  redisClient.smembers('live_streams', (err, streams) => {
    if (err) return res.status(500).send(err);
    res.send(streams);
  });
});

app.get('/api/viewer-count/:streamId', async (req, res) => {
  const { streamId } = req.params;
  redisClient.get(`viewer_count_${streamId}`, (err, count) => {
    if (err) return res.status(500).send(err);
    res.send({ count: parseInt(count, 10) || 0 });
  });
});

// Socket.IO setup for chat
io.on('connection', (socket) => {
  socket.on('join', ({ streamId }) => {
    socket.join(streamId);
    redisClient.incr(`viewer_count_${streamId}`);
  });

  socket.on('leave', ({ streamId }) => {
    socket.leave(streamId);
    redisClient.decr(`viewer_count_${streamId}`);
  });

  socket.on('message', ({ streamId, message }) => {
    io.to(streamId).emit('message', message);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
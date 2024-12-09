const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('MongoDB connected.'));

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Seed a User (Run this once)
const seedUser = async () => {
  const hashedPassword = await bcrypt.hash('user', 10);
  const user = new User({ email: 'user@gmail.com', password: hashedPassword });
  await user.save();
  console.log('User seeded');
};
// Uncomment the next line to seed the user, then re-comment after running once.
// seedUser();

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(400).send({ message: 'Invalid email or password' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

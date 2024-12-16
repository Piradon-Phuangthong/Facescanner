require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // For sending emails
const crypto = require('crypto'); // For generating random codes

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, required: true }, // Store verification code
});

const User = mongoose.model('User', userSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Utility Function to Send Email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation Code',
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a random verification code
    const verificationCode = crypto.randomBytes(3).toString('hex'); // 6-character code
    console.log(verificationCode);
    // Create new user with unverified status
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
    });

    await newUser.save();

    // Send email with verification code
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Registration successful. Check your email for the verification code.' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

app.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log('Received email:', email);  // Log email
    console.log('Received code:', code);    // Log code

    // Validate input
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Find user by email and code
    const user = await User.findOne({ email, verificationCode: code });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code or email' });
    }

    // Update user status to verified
    user.isVerified = true;
    // user.verificationCode = ''; // Clear the code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verification error:', error.message);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// Request Password Reset Route
app.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset code
    const resetCode = crypto.randomBytes(3).toString('hex'); // 6-character code
    user.verificationCode = resetCode;
    await user.save();

    // Send reset email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset code sent to your email.' });
  } catch (error) {
    console.error('Password reset request error:', error.message);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

// Verify Reset Code Route
app.post('/verify-reset-code', async (req, res) => {
  const { email, newPassword, code } = req.body;

  try {
    const user = await User.findOne({ email, verificationCode: code });
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset code or email' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset code
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Code verified successfully.' });
  } catch (error) {
    console.error('Verification error:', error.message);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

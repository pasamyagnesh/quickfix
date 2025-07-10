import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')));
// ✅ START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Mongoose Schema
const requestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  serviceType: String,
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema);

// Serve Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/QuickFix.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/Admin.html'));
});

// ✅ API Endpoint to handle form POST
app.post('/api/submit-request', async (req, res) => {
  try {
    console.log('🟡 Data received:', req.body);  // Log to terminal
    const newRequest = new Request(req.body);
    await newRequest.save();
    console.log('✅ Data saved to MongoDB');

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



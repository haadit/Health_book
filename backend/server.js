const express = require('express');
const mongoose = require('mongoose');
const { Web3 } = require('web3');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web3 Configuration (replace with your actual contract details)
const contractAddress = '0x040c0E2B09f73a3EC5e02e72bb4fc120ACb40D3a';
const contractABI = [
    // Include the ABI from your deployed contract
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    // Add other function ABIs here
];

// Web3 Provider (e.g., Infura, Alchemy, or local blockchain)
const web3 = new Web3('https://sepolia.infura.io/v3/d6ddaf6d581d48049be608e5b26166d6');

// Contract Instance
const fundraisingContract = new web3.eth.Contract(contractABI, contractAddress);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contract-info', async (req, res) => {
    try {
        const goal = await fundraisingContract.methods.goal().call();
        const totalRaised = await fundraisingContract.methods.totalRaised().call();
        const balance = await fundraisingContract.methods.getBalance().call();

        res.json({
            goal: web3.utils.fromWei(goal, 'ether'),
            totalRaised: web3.utils.fromWei(totalRaised, 'ether'),
            balance: web3.utils.fromWei(balance, 'ether')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const poseRoutes = require('./routes/poses');
const progressRoutes = require('./routes/progress');
const statsRoutes = require('./routes/stats');
const poseValidationRoutes = require('./routes/poseValidation');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/poses', poseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/pose-validation', poseValidationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
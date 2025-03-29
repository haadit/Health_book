/* global BigInt */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  useTheme,
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Send, 
  AccountBalance,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import Web3 from 'web3';

// Contract ABI and Address
const CONTRACT_ADDRESS = "0x895CB3e355ea4C36fc42F1D15E913Ffa274F0d0A"; 
const CONTRACT_ABI = [  
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_goal",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Donated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "donations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "goal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRaised",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Add BigInt polyfill check
const toBigInt = (value) => {
  if (typeof BigInt !== 'undefined') {
    return BigInt(value);
  }
  // Fallback for environments without BigInt
  return value.toString();
};

function App() {
  const theme = useTheme();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [campaignInfo, setCampaignInfo] = useState({
    totalGoal: 0,
    currentAmount: 0,
    donorsCount: 0,
    daysLeft: 0,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [donorAmount, setDonorAmount] = useState('0');
  const [donationHistory, setDonationHistory] = useState([]);

  // Calculate progress percentage
  const progressPercentage = campaignInfo.totalGoal > 0 
    ? (campaignInfo.currentAmount / campaignInfo.totalGoal) * 100 
    : 0;

  // Fetch campaign data from blockchain
  const fetchCampaignData = async () => {
    if (!contract || !account) return;

    try {
      const [goal, totalRaised, balance, owner, userDonation] = await Promise.all([
        contract.methods.goal().call(),
        contract.methods.totalRaised().call(),
        contract.methods.getBalance().call(),
        contract.methods.owner().call(),
        contract.methods.donations(account).call()
      ]);

      setCampaignInfo(prev => ({
        ...prev,
        totalGoal: Number(goal), // Keep goal as is (in ETH)
        currentAmount: web3.utils.fromWei(totalRaised, 'ether'), // Convert raised amount to ETH
        donorsCount: prev.donorsCount,
      }));

      setDonorAmount(web3.utils.fromWei(userDonation, 'ether')); // Convert user donation to ETH
      setIsOwner(account.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      setError('Failed to fetch campaign data');
    }
  };

  // Fetch donation history
  const fetchDonationHistory = async () => {
    if (!contract) return;

    try {
      const events = await contract.getPastEvents('Donated', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      const history = await Promise.all(events.map(async (event) => {
        const donor = event.returnValues.donor;
        const amount = web3.utils.fromWei(event.returnValues.amount, 'ether'); // Convert Wei to ETH
        const block = await web3.eth.getBlock(event.blockNumber);
        const timestamp = block.timestamp * 1000; // Convert to milliseconds

        return {
          donor,
          amount,
          timestamp: new Date(timestamp).toLocaleString(),
        };
      }));

      setDonationHistory(history.reverse());
    } catch (error) {
      console.error('Error fetching donation history:', error);
    }
  };

  // Listen for blockchain events
  useEffect(() => {
    let subscription = null;

    const setupEventListeners = async () => {
      if (!contract || !web3) return;

      try {
        // First check if the contract has events
        if (contract.events && contract.events.Donated) {
          subscription = contract.events.Donated()
            .on('data', (event) => {
              fetchCampaignData();
              fetchDonationHistory();
            })
            .on('error', (error) => {
              console.error('Error in event subscription:', error);
            });
        }
      } catch (error) {
        console.error('Error setting up event listeners:', error);
      }
    };

    setupEventListeners();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [contract, web3]);

  // Fetch initial data when contract is initialized
  useEffect(() => {
    const fetchData = async () => {
      if (contract && web3) {
        try {
          await fetchCampaignData();
          await fetchDonationHistory();
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      }
    };

    fetchData();
  }, [contract, web3]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);

        // Initialize contract
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setContract(contractInstance);
      } else {
        setError('Please install MetaMask!');
      }
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!web3 || !contract) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const amount = web3.utils.toWei(donationAmount, 'ether'); // Convert ETH to Wei for transaction
      await contract.methods.donate().send({ 
        from: account, 
        value: amount
      });
      
      setSuccess('Donation successful!');
      setDonationAmount('');
    } catch (error) {
      setError('Failed to donate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!web3 || !contract) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await contract.methods.withdraw().send({ from: account });
      setSuccess('Withdrawal successful!');
    } catch (error) {
      setError('Failed to withdraw: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card 
      sx={{ 
        height: '100%', 
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h3" 
          component="div" 
          color={color}
          sx={{ 
            fontWeight: 700,
            mb: 1
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title === 'Goal' ? 'Target Amount' : 'Total Raised'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6, 
            color: 'text.primary',
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Fundraising Campaign
        </Typography>

        <Grid container spacing={4}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6}>
            <StatCard
              title="Goal"
              value={`${campaignInfo.totalGoal} ETH`}
              icon={<TrendingUp sx={{ color: 'primary.main', fontSize: 32 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatCard
              title="Raised"
              value={`${campaignInfo.currentAmount} ETH`}
              icon={<AttachMoney sx={{ color: 'success.main', fontSize: 32 }} />}
              color="success.main"
            />
          </Grid>

          {/* Progress Bar */}
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 4, 
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
                Campaign Progress
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                  }}
                />
              </Box>
              <Typography variant="h6" color="text.secondary" align="right" sx={{ fontWeight: 600 }}>
                {progressPercentage.toFixed(1)}% Complete
              </Typography>
            </Paper>
          </Grid>

          {/* Main Card */}
          <Grid item xs={12}>
            <Card 
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {!account ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AccountBalanceWallet />}
                      onClick={connectWallet}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        }
                      }}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                      Connected Account: {account.slice(0, 6)}...{account.slice(-4)}
                    </Typography>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                      {success}
                    </Alert>
                  )}

                  <Paper 
                    sx={{ 
                      p: 4, 
                      mt: 2, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
                      Make a Donation
                    </Typography>
                    <form onSubmit={handleDonate}>
                      <TextField
                        fullWidth
                        label="Amount (ETH)"
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        InputProps={{
                          startAdornment: <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />,
                        }}
                        disabled={!account}
                        sx={{ mb: 3 }}
                        inputProps={{
                          step: "0.000000000000000001", // Allow for precise ETH amounts
                          min: "0"
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Send />}
                        disabled={!account || loading}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Donate'}
                      </Button>
                    </form>
                  </Paper>

                  {isOwner && (
                    <Paper 
                      sx={{ 
                        p: 4, 
                        mt: 2, 
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
                        Campaign Owner Actions
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleWithdraw}
                        disabled={!account || loading}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Withdraw Funds'}
                      </Button>
                    </Paper>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App; 
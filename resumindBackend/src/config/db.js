const mongoose = require('mongoose');
const dns = require('dns');
const { config } = require('./env');

// Set reliable public DNS servers for Atlas SRV lookups (prevents querySrv ECONNREFUSED on some networks)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in environments where setting DNS servers is restricted
}

// Global cache for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!config.MONGODB_URI) {
    return {
      connected: false,
      message: 'MONGODB_URI not configured'
    };
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return {
      connected: true,
      message: 'Using existing database connection'
    };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: config.MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };

    cached.promise = mongoose.connect(config.MONGODB_URI, opts).then((m) => {
      console.log('Successfully connected to MongoDB Atlas');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return {
      connected: true,
      message: 'MongoDB Atlas connected'
    };
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

function getDatabaseStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
}

module.exports = { connectDB, getDatabaseStatus };

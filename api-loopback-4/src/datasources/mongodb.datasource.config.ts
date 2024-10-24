// src/datasources/mongodb.datasource.config.ts
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: 'mongodb://localhost:27017/mydatabase', // Replace with your MongoDB URL
  useUnifiedTopology: true, // Use the new topology engine
  writeConcern: {
    w: 'majority', // Wait for majority of nodes to acknowledge
    j: true, // Journal writes
    wtimeout: 5000, // Timeout for write concern
  },
};

export default config;

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let isConnected;

// Build the connection string
const dbURI = process.env.MONGO_URI;

if (app.get('env') === 'development') {
  mongoose.set('debug', true);
}
module.exports = () => {
  if (isConnected) {
    return Promise.resolve();
  }
  return mongoose
    .connect(dbURI, { useNewUrlParser: true })
    .then(db => {
      console.log(dbURI);
      console.log('MongoDB Connected');
      isConnected = db.connections[0].readyState;
      return isConnected;
    })
    .catch(error => {
      console.log('DB Error: ', error);
      throw error;
    });
};

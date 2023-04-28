import mongoose from 'mongoose';

export default () => {
  const connect = () => {
    mongoose
      .connect('mongodb://127.0.0.1:27017/MyTchat-backend')
      .then(() => {
        console.log('Successfully connected to database.');
      })
      .catch((err) => {
        console.log('Error connecting to database', err);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};

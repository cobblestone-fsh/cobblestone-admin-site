
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const conn = mongoose.createConnection(`mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?connectTimeoutMS=30000`,
  { useNewUrlParser: true });

const Predictor = conn.model(`predictor`, new mongoose.Schema({
  name: { type: String, index: true, required: true, unique: true },
  currentScore: Number,
  imgUrl: String,
  description: String,
  notes: String
}));

const Prediction = conn.model(`prediction`, new mongoose.Schema({
  name: String,
  summary: { type: String, required: true },
  predictor: mongoose.ObjectId,
  details: String,
  notes: String,
  imgUrl: String,
  link: String,
  estimatedSignificance: Number,
  estimatedConfidence: Number,
  estimatedSpecificity: Number,
  estimatedResolution: Date,
  isResolved: Boolean
}));

const Resolution = conn.model(`resolution`, new mongoose.Schema({
  prediction: mongoose.ObjectId,
  timeResolved: Date,
  actualSignificance: Number,
  actualConfidence: Number,
  actualSpecificity: Number,
  bonusAdjustment: Number,
  notes: String
}));

module.exports = {
  Predictor,
  Prediction,
  Resolution
};

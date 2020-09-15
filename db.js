
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
  predictor: { type: mongoose.ObjectId, ref: 'predictor' },
  details: String,
  imgUrl: String,
  link: String,
  qualifiedCategory: String, // like 2020.president.trump
  estimatedSignificance: { type: Number, default: 2 },
  estimatedConfidence: { type: Number, default: 0 },
  estimatedSpecificity: { type: Number, default: 0 },
  estimatedResolution: Date,
  actualSignficance: { type: Number, default: 2 },
  actualConfidence: { type: Number, default: 0 },
  actualSpecificity: { type: Number, default: 0 },
  bonusAdjustment: { type: Number, default: 0 },
  resolutionNotes: String,
  isPublished: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  isResolvedTrue: Boolean,
  timeResolved: Date,
  creditGiven: { type: Boolean, default: false }
}));

// have to do this to avoid Twitter API application
const Tweet = conn.model('tweet', new mongoose.Schema({
  text: String
}));

module.exports = {
  Predictor,
  Prediction, 
  Tweet
};


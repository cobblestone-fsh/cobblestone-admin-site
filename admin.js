
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const { Predictor, Prediction, Tweet } = require('./db');

async function resolvePrediction(req, res, ctx, isTrue) {

  let record = ctx.record;

  const Predictor = await ctx._admin.findResource('predictor');
  let predictorRecord = await Predictor.findOne(ctx.record.param('predictor'));
  
  
  let value = record.param('actualSignficance') + record.param('actualConfidence') +
    record.param('actualSpecificity');

  if (!isTrue) {
    value = 0 - value;
  }

  let newScore = predictorRecord.param('currentScore') + value + record.param('bonusAdjustment');

  predictorRecord = await predictorRecord.update({
    currentScore: newScore
  });
  predictorRecord = await predictorRecord.save();

  record = await record.update({
    isResolved: true,
    isResolvedTrue: isTrue,
    timeResolved: new Date(),
    creditGiven: true
  });
  record = await record.save();
  return {
    record: record.toJSON(ctx.currentAdmin),
    redirectUrl: './show'
  };
}

async function resolvePredictionTrue(req, res, ctx) {
  let result = await resolvePrediction(req, res, ctx, true);
  return result;
}

async function resolvePredictionFalse(req, res, ctx) {
  let result = await resolvePrediction(req, res, ctx, true);
  return result;
}

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  rootPath: '/admin', 
  resources: [
    { resource: Predictor, options: {
      listProperties: ['name', 'currentScore'],
      properties: {
        description: { type: 'textarea' },
        notes: { type: 'textarea' }
      }
    }},
    { resource: Prediction, options: {
      listProperties: ['name', 'predictor', 'qualifiedCategory', 'isResolved'],
      properties: {
        details: { type: 'textarea' },
        notes: { type: 'textarea' },
        resolutionNotes: { type: 'textarea' },
        isResolved: { show: true, edit: false }
      },
      actions: {
        resolveTrue: {
          actionType: 'record',
          icon: 'Checkmark',
          isVisible: true,
          handler: resolvePredictionTrue
        },
        resolveFalse: {
          actionType: 'record',
          icon: 'X',
          isVisible: true,
          handler: resolvePredictionFalse
        }
      }
    }},
    { resource: Tweet, options: {
      properties: {
        text: { type: 'textarea' }
      }
    }}
  ]
});

console.log("Building admin site...");
const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
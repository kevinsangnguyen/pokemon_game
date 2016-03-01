var mongoose = require('mongoose');
// create our friendSchema
var Any = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, { strict : false });

// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('Pokemon', Any);
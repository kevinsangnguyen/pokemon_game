var mongoose = require('mongoose');

var Any = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, { strict : false });

mongoose.model('Pokemon', Any);

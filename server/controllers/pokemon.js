var mongoose = require('mongoose');
var Pokemon = mongoose.model('Pokemon');
module.exports = (function() {
 return {
  index: function(req, res) {
     Pokemon.findOne({index: parseInt(req.params.id)}, function(err, results) {
       if(err) {
        console.log("error");
       } else {
         res.json(results);
       }
   })
  },

  create: function(req,res) {
    req.body.index = req.body.id;
  	var newPokemon = new Pokemon(req.body);
  		newPokemon.save(function(err,newPokemon){
  			if (err){
  				console.log("Error.");
  			}
  			else {
  				res.json(newPokemon);
  			}
  		})
  },

  remove: function(req,res){
  	Pokemon.remove({ _id : req.params.id },function(err){
  		if(err){
  			console.log(err);
  		}
  		else {
  			res.json("works");
  		}
  	})
  }

 }
})();
var pokemon = require('./../controllers/pokemon.js');

module.exports = function(app) {

    app.get('/pokemon/:id', function(req, res) {
      pokemon.index(req, res);
    });

    app.post('/create_pokemon', function(req,res){
      pokemon.create(req,res);
    });

    app.delete('/remove_pokemon/:id',function(req,res){
      pokemon.remove(req,res);
    });



  };
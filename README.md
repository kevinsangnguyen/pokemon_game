# Pokemon Socket Simulation  #
Technologies: MongoDB,Express.js, AngularJS, Node.js, Sockets.io, ui-bootstrap

[Demo](https://www.pokemon.kevinsangnguyen.com)

*A multiplayer(2) javascript built game that mimics the functionality of the original Pokemon game while utilizing sockets.*

- - - - 

####Functions:####
- *More than two players not yet implemented. 
- Pokemon API(pokeapi.co) used to gather original 151 pokemon for pictures, moves lists and pokemon data. 
- Pokemon health, attacks, attack power manipulated by own algorithms.
- User is equipped with three random pokemon at the start.
- Refresh button to retrieve a different set of pokemon.
- Game map with active controls to move a character's sprite.
- Functional sockets to allow user-to-user interaction on game map.
  - Users positions are updated, users can see each other move real-time. 
  - At close enough range, a battle modal will pop up and battle sequence will be engaged.
- **Battle Sequence**
  - Users each pick a pokemon, waiting screen occurs if opponent is still choosing.
  - Randomly select user for first turn, waiting screen occurs if it is opponent's turn.
  - User chooses which attack to use and the damage is shown (Special effects, weaknesses and power-up moves not implemented).
  - Once a pokemon has fallen, choose another to be placed in battle.
  - Battle finishes once a user has no more pokemon to choose from. 


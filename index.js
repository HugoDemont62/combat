function updateHealthDisplay(player) {
  const healthDisplay = document.getElementById('player-health');
  healthDisplay.textContent = `Santé: ${player.health}`;
}

function updateManaDisplay(player) {
  const manaDisplay = document.getElementById('player-mana');
  manaDisplay.textContent = `Mana: ${player.mana}`;
}

class Character {
  constructor(name, health, damage, experience = 0) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.experience = experience;
  }

  attack() {
    return this.damage * (0.8 + Math.random() * 0.4);
  }



  takeDamage(damage) {
    this.health -= damage;
  }

  isAlive() {
    return this.health > 0;
  }
}

// Classe Player
class Player extends Character {
  constructor(name, health, damage, mana, specialDamage) {
    super(name, health, damage);
    this.mana = mana;
    this.specialDamage = specialDamage;
    this.level = 1;
    this.experience = 0;
  }

  takeDamage(damage) {
    super.takeDamage(damage);
    updateHealthDisplay(this);
  }

  useSpecial() {
    if (this.mana >= 10) {
      this.mana -= 10;
      alert(`${this.name} utilise son attaque spéciale!`);
      return this.specialDamage * (0.8 + Math.random() * 0.4);
    } else {
      console.log(`${this.name} n'a pas ou plus mana!`);
      return this.attack();
    }
  }

  gainExperience(exp) {
    this.experience += exp;
    if (this.experience >= this.level * 50) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.health += 20;
    this.damage += 5;
    this.specialDamage += 5;
    console.log(`${this.name} monte au niveau ${this.level}!`);
  }
}

// Classe Monster
class Monster extends Character {
  constructor(name, health, damage, experience) {
    super(name, health, damage, experience);
  }
}

// Classe Game
class Game {
  constructor(players, monsters) {
    this.players = players;
    this.monsters = monsters;
    this.currentPlayer = players[0];
    this.currentMonster = this.getRandomMonster();
    this.monstersKilled = 0;
  }

  getRandomMonster() {
    const randomIndex = Math.floor(Math.random() * this.monsters.length);
    return new Monster(
      this.monsters[randomIndex].name,
      this.monsters[randomIndex].health,
      this.monsters[randomIndex].damage,
      this.monsters[randomIndex].experience,
    );
  }

  playerTurn(action) {
    if (Math.random() < 0.1) {
      console.log(`${this.currentPlayer.name} a fait un échec critique!`);
      return;
    }

    let damage;
    if (action === 'attack') {
      damage = this.currentPlayer.attack();
    } else if (action === 'special') {
      damage = this.currentPlayer.useSpecial();
    }

    this.currentMonster.takeDamage(damage);
    console.log(`${this.currentPlayer.name} inflige ${damage.toFixed(
      2)} dégâts à ${this.currentMonster.name}.`);

    if (!this.currentMonster.isAlive()) {
      console.log(`${this.currentMonster.name} est mort!`);
      this.currentPlayer.gainExperience(this.currentMonster.experience);
      this.monstersKilled++;
      this.currentMonster = this.getRandomMonster();
    } else {
      this.monsterTurn();
    }
  }

  monsterTurn() {
    if (Math.random() < 0.1) {
      console.log(`${this.currentMonster.name} a fait un échec critique!`);
      return;
    }

    const damage = this.currentMonster.attack();
    this.currentPlayer.takeDamage(damage);
    console.log(`${this.currentMonster.name} inflige ${damage.toFixed(
      2)} dégâts à ${this.currentPlayer.name}.`);

    if (!this.currentPlayer.isAlive()) {
      console.log(`${this.currentPlayer.name} est mort! Fin du jeu.`);
      process.exit();
    }
  }

  start() {
    console.log(
      `Le jeu commence avec ${this.currentPlayer.name} contre ${this.currentMonster.name}.`);
    while (this.currentPlayer.isAlive()) {
      const action = Math.random() < 0.5 ? 'attack' : 'special';
      this.playerTurn(action);
    }
  }
}

document.getElementById('start-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const pseudo = document.getElementById('pseudo').value;
  const characterType = document.getElementById('character').value;

  let selectedPlayer;
  if (characterType === 'Guerrier') {
    selectedPlayer = new Player(pseudo, 100, 15, 0, 0);
  } else if (characterType === 'Magicien') {
    selectedPlayer = new Player(pseudo, 80, 10, 50, 55);
  }

  updateHealthDisplay(selectedPlayer);
  updateManaDisplay(selectedPlayer);

  const monsters = [
    {name: 'Gobelin', health: 30, damage: 5, experience: 20},
    {name: 'Orc', health: 50, damage: 10, experience: 30},
    {name: 'Dragon', health: 100, damage: 20, experience: 50},
  ];

  const game = new Game([selectedPlayer], monsters);
  game.start();
});
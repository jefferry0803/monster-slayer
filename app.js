function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      isFighting: false,
      playerIsAnimated: false,
      monsterIsAnimated: false,
      specialAttackIsAnimated: false,
      healingIsAnimated: false,
      isSurrender: false,
      playerIsHit: false,
      monsterIsHit: false,
      isMute: false,
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    playerImgSrc() {
      if (this.playerHealth <= 0) {
        return "./pics/playerDeath.png";
      } else if (this.isSurrender) {
        return "./pics/surrender.png";
      }
      return "./pics/player.png";
    },
    monsterImgSrc() {
      if (this.monsterHealth <= 0) {
        return "./pics/monsterDeath.png";
      }
      return "./pics/monster.png";
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //Player lost
        this.winner = "monster";
        this.playerHealth = 0;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //Monster lost
        this.winner = "player";
        this.monsterHealth = 0;
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
      this.isSurrender = false;
    },
    attackMonster() {
      if (this.isFighting) {
        return;
      }
      this.isFighting = true;
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      const attackAudio = document.querySelector(".playerAttackAudio");
      this.monsterIsHit = true;
      attackAudio.play();
      setTimeout(() => {
        this.monsterIsHit = false;
      }, 700);
      this.monsterHealth -= attackValue;
      this.animatePlayer();
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
      setTimeout(() => {
        this.isFighting = false;
      }, 1500);
    },
    attackPlayer() {
      if (this.monsterHealth <= 0) {
        return;
      }
      const attackValue = getRandomValue(8, 15);
      const attackAudio = document.querySelector(".monsterAttackAudio");
      setTimeout(() => {
        this.playerIsHit = true;
        attackAudio.play();
        this.playerHealth -= attackValue;
        this.animateMonster();
        this.addLogMessage("monster", "attack", attackValue);
      }, 1000);
      setTimeout(() => {
        this.playerIsHit = false;
      }, 1700);
    },
    specialAttackMonster() {
      if (this.isFighting) {
        return;
      }
      this.isFighting = true;
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      const attackAudio = document.querySelector(".specialAttackAudio");
      this.monsterIsHit = true;
      setTimeout(() => {
        this.monsterIsHit = false;
      }, 700);
      attackAudio.play();
      this.monsterHealth -= attackValue;
      this.animateSpecialAttack();
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
      setTimeout(() => {
        this.isFighting = false;
      }, 1500);
    },
    healPlayer() {
      if (this.isFighting) {
        return;
      }
      this.isFighting = true;
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      const healAudio = document.querySelector(".healingAudio");
      healAudio.play();
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.animateHealing();
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
      setTimeout(() => {
        this.isFighting = false;
      }, 1500);
    },
    surrender() {
      this.winner = "monster";
      this.isSurrender = true;
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    animatePlayer() {
      this.playerIsAnimated = true;
      setTimeout(() => {
        this.playerIsAnimated = false;
      }, 1000);
    },
    animateMonster() {
      this.monsterIsAnimated = true;
      setTimeout(() => {
        this.monsterIsAnimated = false;
      }, 500);
    },
    animateSpecialAttack() {
      this.specialAttackIsAnimated = true;
      setTimeout(() => {
        this.specialAttackIsAnimated = false;
      }, 1000);
    },
    animateHealing() {
      this.healingIsAnimated = true;
      setTimeout(() => {
        this.healingIsAnimated = false;
      }, 1000);
    },
    audioControl() {
      this.isMute = !this.isMute;
      const audio = document.querySelectorAll("audio");
      audio.forEach((item) => {
        item.muted = !item.muted;
      });
    },
  },
});

app.mount("#game");

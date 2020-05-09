export default {
  methods: {
    transmute_score(yourScore, totalItems, base) {
      yourScore = +yourScore;
      totalItems = +totalItems;
      base = +base;
      let tScore;
      let divScore = yourScore / totalItems;
      if (base === 65) {
        tScore = (yourScore * 100) / totalItems;
        if (tScore > 2) {
          if (tScore <= 6) {
            tScore = tScore + 1;
          } else if (tScore <= 10) {
            tScore = tScore + 2;
          } else if (tScore <= 14) {
            tScore = tScore + 3;
          } else if (tScore <= 18) {
            tScore = tScore + 4;
          } else if (tScore <= 27) {
            tScore = tScore + 5;
          } else if (tScore <= 36) {
            tScore = tScore + 6;
          } else if (tScore <= 47) {
            tScore = tScore + 7;
          } else if (tScore <= 54) {
            tScore = tScore + 8;
          } else if (tScore <= 63) {
            tScore = tScore + 9;
          } else if (tScore <= 66) {
            tScore = tScore + 10;
          } else if (tScore <= 69) {
            tScore = tScore + 9;
          } else if (tScore <= 72) {
            tScore = tScore + 8;
          } else if (tScore <= 76) {
            tScore = tScore + 7;
          } else if (tScore <= 80) {
            tScore = tScore + 6;
          } else if (tScore <= 83) {
            tScore = tScore + 5;
          } else if (tScore <= 87) {
            tScore = tScore + 4;
          } else if (tScore <= 90) {
            tScore = tScore + 3;
          } else if (tScore <= 94) {
            tScore = tScore + 2;
          } else if (tScore <= 97) {
            tScore = tScore + 1;
          }
        }
        tScore = Math.round(tScore);
      } else if (base === 60) {
        tScore = divScore * 62.5 + 37.5;
        tScore = Math.round(tScore);
      } else if (base === 50) {
        tScore = divScore * 50 + 50;
        tScore = Math.round(tScore);
      }
      return tScore;
    },
    transmute_syllabus(syllabus, base) {
      let yourScore = 0;
      let totalItems = 0;
      syllabus.scores.forEach((score) => {
        yourScore += +score.yourScore;
        totalItems += +score.totalItems;
      });
      syllabus.transmutedGrade = this.transmute_score(
        yourScore,
        totalItems,
        base
      );
      // set transmuted grade to 0 if not a number
      isNaN(syllabus.transmutedGrade) && (syllabus.transmutedGrade = 0);
      return syllabus;
    },
  },
};

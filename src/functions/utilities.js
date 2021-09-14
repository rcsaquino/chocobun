function transmute_score(yourScore, totalItems, base) {
	// Force convert variables to integers
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
}

function content_transmute_score(scores, base) {
	const sum = { yourScore: 0, totalItems: 0 };
	scores.forEach(score => {
		sum.yourScore += +score.yourScore;
		sum.totalItems += +score.totalItems;
	});
	return transmute_score(sum.yourScore, sum.totalItems, base);
}

function deep_clone(data) {
	return data && JSON.parse(JSON.stringify(data));
}

export { transmute_score, content_transmute_score, deep_clone };

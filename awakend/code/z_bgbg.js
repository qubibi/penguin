class Z_bgbg {
	constructor() {
		this.vt_test;
		this.vt_test2;
		

	}
	f_posset() {
		this.posbgbg = [
			// {x: -180, y: 100, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -65 },
			// {x: 0, y: -100, ctr1x: -55, ctr1y: 0, ctr2x: 55, ctr2y: 0 },
			// {x: 180, y: 100, ctr1x: 0, ctr1y: -65, ctr2x: 0, ctr2y: 0 }
			{ x: winxy7.x, y: winxy7.y+14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -25  },
			{ x: winxy9.x, y: winxy9.y+14, ctr1x: 0, ctr1y: -25, ctr2x: 0, ctr2y: 0  },
			{ x: winxy3.x, y: winxy3.y-14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 25  },
			{ x: winxy1.x, y: winxy1.y-14, ctr1x: 0, ctr1y: 25, ctr2x: 0, ctr2y: 0  },
			{ x: winxy7.x, y: winxy7.y+14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];
		this.posbgbg2 = [
			// {x: -180, y: 100, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -65 },
			// {x: 0, y: -100, ctr1x: -55, ctr1y: 0, ctr2x: 55, ctr2y: 0 },
			// {x: 180, y: 100, ctr1x: 0, ctr1y: -65, ctr2x: 0, ctr2y: 0 }
			{ x: winxy7.x, y: winxy7.y-14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -25  },
			{ x: winxy9.x, y: winxy9.y-14, ctr1x: 0, ctr1y: -25, ctr2x: 0, ctr2y: 0  },
			{ x: winxy3.x, y: winxy3.y+14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 25  },
			{ x: winxy1.x, y: winxy1.y+14, ctr1x: 0, ctr1y: 25, ctr2x: 0, ctr2y: 0  },
			{ x: winxy7.x, y: winxy7.y-14, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];
	}

	f_ef() {``
		this.f_posset();	
		this.vt_test = qvert.beje_allvertices(  this.posbgbg, 28)
		this.vt_test2= qvert.beje_allvertices(  this.posbgbg2, 23)
	}

	f_efdraw(_g) {
		// qline.drawline(g_room, this.vt_test, 10, 2, true, "#000")
		// console.log(this.vt_test[0]);

		let _angle1 = qb.rndmint(7,9);
		let _angle2 = qb.rndmint(6,8);
		let _angle3 = qb.rndmint(6,8);
		let _angle4 = 9;

		qfill.drawfillv2(_g, this.vt_test, "#000000bb", 35, _angle1, 26, [0, 1], 0.09)
		qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.56), qb.rndmint(30,60), _angle2, 19, [-0.2, 1.2], 1, .4)
		qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.66), qb.rndmint(30,60), _angle3, 19, [-0.2, 1.2], 1, .4)
		// if (nnyu.is_awakend) qfill.drawfillv2(_g, this.vt_test2, "#8f5f52af", 54, _angle4, 12, [0, 1], 0.03)
		// else qfill.drawfillv2(_g, this.vt_test2, "#8f5f52a9", 34, _angle4, 12, [0, 1], 0.04)
		// 
		
		if (nnyu.kyouseilock) qfill.drawfillv2(_g, this.vt_test2, "#333344a9", 34, _angle4, 12, [0, 1], 0.04)
		else qfill.drawfillv2(_g, this.vt_test2, "#8f5f52a9", 34, _angle4, 12, [0, 1], 0.04)


		// qfill.drawfillv2(_g, this.vt_test, "#000000bb", 35, qb.rndmint(7,9), 26, [0, 1], 0.09)
		// qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.5), qb.rndmint(20,60), qb.rndmint(6,8), 19, [-0.2, 1.2], 1, .4)
		// qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.5), qb.rndmint(20,60), qb.rndmint(6,8), 19, [-0.2, 1.2], 1, .4)
		// qfill.drawfillv2(_g, this.vt_test2, "#8f5f52af", 34, 9, 12, [0, 1], 0.03)


		// qfill.drawfillv2(_g, this.vt_test2, "#8f5f52af", 34, 9, 12, [0, 1], 0.03)
		

		// qfill.drawfillv2(_g, this.vt_test, "#000000bb", 35, qb.rndmint(7,9), 26, [0, 1], 0.09)
		// qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.75), qb.rndmint(30,60), 7, 19, [-0.2, 1.2], 1, .4)
		// qfill.drawfillv2(_g, this.vt_test, qb.colrndm(0.65), qb.rndmint(30,60), 7, 19, [-0.2, 1.2], 1, .4)
		// qfill.drawfillv2(_g, this.vt_test2, "#8f4662bf", 34, 9, 9, [0, 1], 0.03)
		// // qfill.drawfillv2(_g, this.vt_test2, "#8f5652bf", 34, 9, 9, [0, 1], 0.03)


		// qfill.drawfillv2(g_room, this.vt_test, "#ff0000aa", 15)
		// qline.drawControlPoints(g_room, this.posbgbg)
		// qline.drawdot(g_room, this.vt_test)
	}
}


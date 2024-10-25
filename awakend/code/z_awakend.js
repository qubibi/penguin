class Z_awakend {
	constructor() {
		this.vt_hole;
		this.vt_holetgt;
		this.vt_hole_fortynyn;
		this.vt_medama;
		this.vt_haue;
		this.vt_hasita;
		this.tweset_insidecolor = [
			{ frm:0,    col:"#ffffff2f" },
			{ frm:100,    col:"#ffffff2f" },
			{ frm:300,  col:"#0000ff00" },
			{ frm:340, col:"#ffcc0066" },
			{ frm:600, col:"#4f1a1200" },
			{ frm:640, col:"#4f1a1230" },
			{ frm:1000, col:"#462220a1" }
		]
		this.tw_insidecolor = qt.generateTweenArrays(this.tweset_insidecolor)

		this.tweset_medamacolor = [
			{ frm:0,    col:"#00000035" },
			{ frm:380,  col:"#00000035" },
			{ frm:550,  col:"#6060c025" },
			{ frm:700, col:"#cc330035" },
			{ frm:1000, col:"#cc330035" }
		]
		this.tw_medamacolor = qt.generateTweenArrays(this.tweset_medamacolor)
		this.mabutanokatati = [0,0,0,0,0,0,0,0]



		this.apeyeopen = [
			{ x: -132, y:0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: 0, y: -90+this.mabutanokatati[0], ctr1x: -122, ctr1y: 0, ctr2x: 122, ctr2y: 0  },
			{ x: 132, y: 11, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 20  },
			{ x: 0, y: 95, ctr1x: 142, ctr1y: 0, ctr2x: -142, ctr2y: 0  },
			{ x: -132, y:0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];
		this.vt_holetgt = qvert.beje_allverticesv2(  this.apeyeopen, 40, [0.61,-0.61,0.61, -0.61])
		this.vt_hole = structuredClone(this.vt_holetgt);
		this.vt_hole_fortynyn = structuredClone(this.vt_hole);
	}

	f_mabutanokatati() {
		this.mabutanokatati[0] = qb.rndm(-15,25)
		if ( Math.random()< 0.7 ) this.mabutanokatati[0] = 0;
	}

	f_posset() {
let wave1 = (sin(frameCount/(20 + sin(frameCount/19)*1)) + sin(frameCount/(50 + sin(frameCount/71)*1.6))) * 0.5;
let wave2 = (sin(frameCount/(20 + sin(frameCount/28)*2)) + sin(frameCount/(50 + sin(frameCount/89)*3))) * 0.5;


		this.apeyeopen = [
			{ x: -132, y:0+10*wave2, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: 0, y: -90+this.mabutanokatati[0], ctr1x: -122, ctr1y: 0, ctr2x: 122, ctr2y: 0  },
			{ x: 132, y: 11+15*wave1, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 20  },
			{ x: 0, y: 95, ctr1x: 142, ctr1y: 0, ctr2x: -142, ctr2y: 0  },
			{ x: -132, y:0+10*wave2, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];
		let aaaaa = 0//nnyu.dragmx/23
		let bbbbb = 0//nnyu.dragmx/23
		let ccccc = 0//nnyu.dragmy/-10

		let aww = 0//0.2+awakendv*0.8
		let close_y = 0//qb.mppng3(nnyu.dragmy, -200, 0, 200, -350*aww, 0, 150*aww, 0 )
		let close_x = 0//qb.mppng3(Math.abs(nnyu.dragmy), -200, 0, 200, 77*aww, 0, 77*aww, 0 )
		
		
		this.apclose = [
			{ x: -132+close_x, y:0+10*wave2, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: nnyu.dragmx/3, y: 80+close_y, ctr1x: -121, ctr1y: 0, ctr2x: 121, ctr2y: 0  },
			{ x: 132+-close_x, y: 15*wave1, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: nnyu.dragmx/3, y: 80+close_y, ctr1x: 122, ctr1y: 0, ctr2x: -122, ctr2y: 0  },
			{ x: -132+close_x, y:0+10*wave2, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];
		this.apmuu = [
			{ x: -80+close_x, y:0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: nnyu.dragmx/3, y: -30, ctr1x: -70, ctr1y: 0, ctr2x: 70, ctr2y: 0  },
			{ x: 80+-close_x, y: 0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
			{ x: nnyu.dragmx/3, y: -30, ctr1x: 75, ctr1y: 0, ctr2x: -75, ctr2y: 0  },
			{ x: -80+close_x, y:0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		];


		this.apkutiopen = [
			{ x: -99, y:-20, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -48  },
			{ x: 30.3+nnyu.dragmx/-5, y: -120, ctr1x: -91, ctr1y: -20, ctr2x: 71, ctr2y: -0  },
			// { x: nnyu.dragmx/-5, y: -55, ctr1x: -91, ctr1y: -20, ctr2x: 71, ctr2y: -0  },
			{ x: 140, y: 16, ctr1x: 0, ctr1y: -88, ctr2x: 0, ctr2y: 11  },
			{ x: -13.3+nnyu.dragmx/13, y: 131, ctr1x: 133, ctr1y: 0, ctr2x: -133, ctr2y: 0  },
			{ x: -99, y:-20, ctr1x: 0, ctr1y: 28, ctr2x: 0, ctr2y: 0  }
		];


let wave3 = (sin(frameCount/(15 + sin(frameCount/65)*1.5)) + sin(frameCount/(38 + sin(frameCount/95)*1.5)) + sin(frameCount/64)) * 0.33;
let wave4 = (sin(frameCount/(15 + sin(frameCount/33)*1.5)) + sin(frameCount/(38 + sin(frameCount/48)*1.5)) + sin(frameCount/28)) * 0.33;
let wave5 = (sin(frameCount/(15 + sin(frameCount/71)*1.5)) + sin(frameCount/(38 + sin(frameCount/43)*1.5)) + sin(frameCount/45)) * 0.33;
		this.apmedama = [
			{ x: -69+(wave5+wave4)/2*10, y:0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -44  },
			{ x: 0+10*wave4, y:-69+10*wave3, ctr1x: -44, ctr1y: 0, ctr2x: 44, ctr2y: 0  },
			{ x: 69+10*wave4, y:0, ctr1x: 0, ctr1y: -44, ctr2x: 0, ctr2y: 22  },
			{ x: 0+10*wave5, y:69, ctr1x: 44, ctr1y: 0, ctr2x: -44, ctr2y: 0  },
			{ x: -69+(wave5+wave4)/2*10, y:0, ctr1x: 0, ctr1y: 44, ctr2x: 0, ctr2y: 0  }
		]
		
		this.apbero = [
			{ x: -50, y:65, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -13  },
			{ x: 30+20*wave1, y:40, ctr1x: -33, ctr1y: 0, ctr2x: 33, ctr2y: 0  },
			{ x: 100, y:65, ctr1x: 0, ctr1y: -33, ctr2x: 0, ctr2y: 33  },
			{ x: 0, y:50+65, ctr1x: 74, ctr1y: 0, ctr2x: -74, ctr2y: 0  },
			{ x: -50, y:65, ctr1x: 0, ctr1y: 13, ctr2x: 0, ctr2y: 0  }
		]
		// this.ap_haue = [
		// 	{ x: -120, y:-70, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: -60  },
		// 	{ x: 0, y: -100, ctr1x: -31, ctr1y: 0, ctr2x: 141, ctr2y: 0  },
		// 	{ x: 120, y: 50, ctr1x: 0, ctr1y: -60, ctr2x: 0, ctr2y: 0  }
		// ];
		

	}

	f_ef() {
		this.f_posset();	



		let _ue123 = qb.tweenArrays([this.apeyeopen, this.apclose, this.apmuu, this.apkutiopen ], nnyu.openclosev)
		let _naka = qb.tweenArrays([this.apmedama, this.apbero  ], nnyu.openclosev)
		this.vt_holetgt = qvert.beje_allverticesv2(  _ue123, 40, [0.61,-0.61, 0.61, -0.61])


		this.vt_hole.forEach((_me, i) => {

			// _me.x += this.vt_hole_fortynyn.x = ( this.vt_hole_fortynyn.x + ( this.vt_holetgt.x - _me.x ) * .8 )* .9; 

   //  const distance = Math.abs(i - 13);
   //  const factor = Math.max(0, 1 - (distance * distance) / 16);
	// _me.y -= 50 * factor;


   //  const distance = Math.abs(i - 11);
   //  const factor = Math.exp(-distance * 0.8); // 指数関数で急な減衰を作る
    



			_me.x += this.vt_hole_fortynyn[i].x = ( this.vt_hole_fortynyn[i].x + ( this.vt_holetgt[i].x - _me.x ) * 0.8 )* (0.5+i*0.01); 
			_me.y += this.vt_hole_fortynyn[i].y = ( this.vt_hole_fortynyn[i].y + ( this.vt_holetgt[i].y - _me.y ) * (0.45+i*0.018) )* .7; 
	
	// _me.y -= 60 * factor;
	
	
	
			// _me.y += this.vt_hole_fortynyn[i].y = ( this.vt_hole_fortynyn[i].y + ( this.vt_holetgt[i].y - _me.y ) * 0.77 )* (0.4+i*0.015); 

			// _me.x += (this.vt_holetgt[i].x - _me.x) / (1+i/3);
			// _me.y += this.vt_hole_fortynyn.y = ( this.vt_hole_fortynyn.y + ( this.vt_holetgt.y - _me.y ) * .8 )* .9; 
			// _me.y += (this.vt_holetgt[i].y - _me.y) / (1+i/3);
		});



		this.vt_medama = qvert.beje_allvertices(  _naka, 13)
		// this.vt_medama = qvert.beje_allvertices(  this.apmedama, 13)
		// this.vt_haue = qvert.beje_allvertices(  this.ap_haue, 11)
		
// /		this.vt_haue = this.vt_hole.slice(7, 15)
		// this.vt_hasita = this.vt_hole.slice(23, 35)
		
 
	}

	f_efdraw_inside(_g) {
		g_inside.clear()
		// g_inside.background("#ffffff2f")
		g_inside.background(this.tw_insidecolor[ nnyu.openclosev1000 ].col)

					// _g.push()
					// _g.translate(0, nnyu.openclosev*44);
					// _g.translate(24, 20+nnyu.pressv*-25);

		
		qfill.drawfillv2(_g, this.vt_medama, this.tw_medamacolor[ nnyu.openclosev1000 ].col, 21, -8, 7, [0, 1],  0.05)

		// qline.f_vertdegreeline(_g, qvert.shiftScaleXY(this.vt_haue, 1, 0, 36 ), 80, 11, "#665544cc", 20, [0.2, 0.6])
		// qline.f_vertdegreeline(_g, qvert.shiftScaleXY(this.vt_hasita, 1, 0, -36 ), 80, 11, "#665544cc", 20, [0.5, 0.9])


		// let _mag2 = qb.mppng(nnyu.openclosev,0.65 ,0.8,0,1)

		// let _haue = qvert.shiftScaleXY(this.vt_haue, 0.9, 0.85, 0, -1, -4 )
		// qline.drawline2(_g, _haue, 14*_mag2, 2, "#867a7441","y", 2, 3, [0.3, 0.6])
		// let _hasita = qvert.shiftScaleXY(this.vt_hasita, 0.91,0.87, 20, 20, 10 )
		// qline.drawline2(_g, _hasita, 14*_mag2, 3, "#867a74a1","y", Math.round(6*_mag2), 1, [0.6, 0.9])
	}

	f_efdraw_mask(_g) {
		// ここが目など全体のアルファでもある
		// 口の背景でもある
		qfill.drawfillv2(_g, this.vt_hole, "#ffffffd1", 26, 0, 5, [0.06, .94], 0.03)
		// qfill.drawfillv2(_g, this.vt_hole, "#ffffffd1", 26, 0, 5, [0.02, .95], 0.03)



		
	}
}


class Z_seniroiro {
	constructor() {
		this.vt_futae_or_uwakutibiru;
		this.vt_sitamabuta;
		this.vt_matugeroot;
		this.vt_kumasita;
		this.vt_kumaue;
	}
	f_posset() {
		this.tweset_slicefutaeuwakuti = [
			{ frm:0, a:2, b:18 },			{ frm:333, a:2, b:18 },
			{ frm:666, a:1, b:20 },			{ frm:1000, a:1, b:21 }
		]
		this.tw_slicefutaeuwakuti = qt.generateTweenArrays(this.tweset_slicefutaeuwakuti)
		this.tweset_futaeuwakuti = [
			{ frm:0, scx:1.1, scy:1.1, r:3, x:-5, y:-20 },
			{ frm:330, scx:1.1, scy:1.1, r:3, x:-5, y:-20 },
			{ frm:666,    scx:1.1, scy:2.25, r:2, x:0, y:-5 },
			{ frm:900,    scx:1.07, scy:1.4, r:-5, x:3, y:-0 },
			{ frm:1000,    scx:1.07, scy:1.4, r:-5, x:3, y:-0 }
		]
		this.tw_futaeuwakuti = qt.generateTweenArrays(this.tweset_futaeuwakuti)
		this.tweset_kumasitakuti = [
			{ frm:0, scx:0.95, scy:0.8, r:5, x:-9, y:21 },
			{ frm:330, scx:0.95, scy:0.8, r:5, x:-9, y:21 },
			{ frm:666,    scx:0.9, scy:-0.2, r:0, x:0, y:8 },
			{ frm:750,    scx:0.9, scy:0.6, r:0, x:0, y:53 },
			{ frm:800,    scx:1.12, scy:1.5, r:-8, x:-6, y:23 },
			{ frm:1000,    scx:1.12, scy:1.5, r:-8, x:-6, y:-18 }
		]
		this.tw_kumasitakuti = qt.generateTweenArrays(this.tweset_kumasitakuti)



		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, 1.1, 1.5, -5, -2, -10)
		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, 0.9, -0.2, 0, 0, 8)
		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, .95, .7, 5, -9, 30)


		this.tweset_senmedamacolor = [
			{ frm:0,    col:"#000000a1" },
			{ frm:300,  col:"#000000a1" },
			{ frm:333,  col:"#00000000" },
			{ frm:1000, col:"#000000a1" }
		]
		this.tw_senmedamacolor = qt.generateTweenArrays(this.tweset_senmedamacolor)
		this.tweset_namidayodare = [
			{ frm:0,    col:"#ffffff54" },
			{ frm:400,  col:"#ffffff54" },
			{ frm:500,  col:"#ffffff00" },
			{ frm:666, col:"#ffffff00" },
			{ frm:1000, col:"#ffffff41" }
		]
		this.tw_namidayodare = qt.generateTweenArrays(this.tweset_namidayodare)

		// this.ap_kumasita = [
		// 	{ x: 68, y:20+122, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  },
		// 	{ x: 0, y: 163+22, ctr1x: 33, ctr1y: 0, ctr2x: -33, ctr2y: 0  },
		// 	{ x: -68, y: 20+122, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0  }
		// ];

	}



	f_ef() {
		this.f_posset()
		let _oc1000 = nnyu.openclosev1000;
		this.vt_futae_or_uwakutibiru = zawakend.vt_hole.slice(Math.round(this.tw_slicefutaeuwakuti[_oc1000].a), Math.round(this.tw_slicefutaeuwakuti[_oc1000].b))
		// this.vt_futae_or_uwakutibiru = zawakend.vt_hole.slice(2, 18)
		// this.vt_sitamabuta = zawakend.vt_hole.slice(0, 21)
		this.vt_kumasita = zawakend.vt_hole.slice(23,37)

		this.vt_matugeroot = zawakend.vt_hole.slice(3, 18)
	}


	f_efdrawoutside(_g) {
		let _mag = qb.mppng(nnyu.openclosev,0,0.5,1,-1)
		let _mag2 = qb.mppng(nnyu.openclosev,0.5 ,0.6,1,0)
		let _mag4 = qb.mppng(nnyu.openclosev,0.5 ,0.6, 0,1)
		let _mag5 = qb.mppng(nnyu.openclosev,0.33 ,0.66,  0,1)

		// mabuta
		let _oc1000 = nnyu.openclosev1000;
		// let _futaeuwakuti = qvert.shiftScaleXY(this.vt_futae_or_uwakutibiru, 1.1, 1.1, 3, -5, -20);
		let _futaeuwakuti = qvert.shiftScaleXY(this.vt_futae_or_uwakutibiru, 
		this.tw_futaeuwakuti[_oc1000].scx, this.tw_futaeuwakuti[_oc1000].scy,
		this.tw_futaeuwakuti[_oc1000].r, this.tw_futaeuwakuti[_oc1000].x, this.tw_futaeuwakuti[_oc1000].y);

		_futaeuwakuti.forEach((_me, i) => {
			const distance = Math.abs(i - 9);
			const factor = Math.exp(-distance * 0.7); // 指数関数で急な減衰を作る
			_futaeuwakuti[i].y -= (-10 * factor)*(_mag5);
		})
		qline.drawline(_g, _futaeuwakuti, 1.89, 2.5, true, "#00000099")



		// let rrr = qvert.shiftScaleXY(this.vt_sitamabuta, 1, 0, -10);
		// qfill.drawfill(_g, ttt, rrr, 0, 2, 0, "#33f26611", 50)
		// qline.drawline_interp(_g, ttt,rrr,"#447755ff", 1,  25,   -3, 2)

		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, 1.1, 1.5, -5, -2, -10)
		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, 0.9, -0.2, 0, 0, 8)
		// let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, .95, .7, 5, -9, 30)
		let _kumasita = qvert.shiftScaleXY(this.vt_kumasita, 
		this.tw_kumasitakuti[_oc1000].scx, this.tw_kumasitakuti[_oc1000].scy,
		this.tw_kumasitakuti[_oc1000].r, this.tw_kumasitakuti[_oc1000].x, this.tw_kumasitakuti[_oc1000].y);
		qline.drawline(_g, _kumasita, 2.1-_mag4*0.8, 2.5, true, "#000000bb")
		// qline.drawline(_g, _kumasita, 1, 2, true, "#00000099")






		// matuge
let wave = (sin(frameCount/(10 + sin(frameCount/50)*1)) + sin(frameCount/(25 + sin(frameCount/60)*1.3))) * 0.5;
		  

		let aaa = qvert.shiftScaleXY(this.vt_matugeroot, 1.4,1.4,0, -30+(20*wave), -12*_mag )
		let bbb = this.vt_matugeroot;
		qfill.drawfill(_g, aaa, bbb, .1, 2, 0, "#00000099", 1.66*_mag2, 1, .3)



		// kuma
		// let _kumaue = this.vt_kumaue;
		// let _kumasita = this.vt_kumasita;
		// qline.drawline(_g, _kumaue, 30, 2, true, "#000000ff")
		// qline.drawline_interp(_g, _kumaue,_kumasita,"#ffffff11", 10,   6,   -1,  2)

		// let cccc = qvert.shiftScaleXY(zawakend.vt_hole, 1.1, 1.35, -5, 0, 0 )
		// qline.drawline(_g, cccc, 1.2, 2, true, "#00ff00ff")


		// yodare namida
		let mmm = qvert.shiftScaleXY(zawakend.vt_hole, 1, 1, 0, 0, 0 )
		qline.drawline(_g, mmm, 10+20*_mag4, 10, true, this.tw_namidayodare[nnyu.openclosev1000].col)
		// sen me
		qline.drawline(_g, mmm, 2.5+-1.5*_mag4, 2, true, "#000000ff")
	}

	f_efdrawinside(_g) {
		// sen medama
		let _mag3 = qb.mppng(nnyu.openclosev,0.5 ,0.6,1,.0)
		qline.drawline(_g, zawakend.vt_medama, 1.67*_mag3, 2, true, this.tw_senmedamacolor[nnyu.openclosev1000].col)
	}

}


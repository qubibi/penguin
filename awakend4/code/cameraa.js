class Cameraa {
	constructor() {
		this.ani1 = new Animeta();
		this.ani2 = new Animeta();
		this.ani3 = new Animeta();
		this.ani4 = new Animeta();
		this.ani5 = new Animeta();
		this.ani6 = new Animeta();
		this._r = 0;
		this._x = 0;
		this._y = 0;
		this._sc = 0;
		this._r2 = 0;
		this._x2 = 0;
		this.kutiscroll = 0;
		this.kutiscroll_spd = 0;
		this.kutiscrollmagtgt = 1;
		this.kutiscrollmag = 1;
		this.kutiscrollmagynyn = 0;
		this.tweset_zoom = [
			{ frm:0,    zzz: 0 },
			{ frm:700,  zzz: 0 },
			{ frm:1000, zzz:0 }
		]
		this.tw_zoom = qt.generateTweenArrays(this.tweset_zoom)

	}

	f_ini() {
		
	}

	f_ef() {
		if (iscamera) {

			if (cc4 && !nnyu.is_press) {
			this._r = this.ani1.aupdate(0.002, 0.0055, -0.2, 0.2,  67);
			this._x = this.ani2.aupdate(0.1, 1, 66, -66,  67);
			this._y = this.ani3.aupdate(0.1, 1, 0, -100,  67);
			this._sc = this.ani4.aupdate(0.003, 0.008, 1.2, 1.7, 67);
			this._r2 = this.ani1.aupdate(0.005, 0.03, -0.1, 0.1,200);
			this._x2 = this.ani5.aupdate(5, 30, -30, 30, 200);
			// this._r = this.ani1.aupdate(0.002, 0.005, -0.2, 0.2,  67)  *(1-nnyu.pressv);
			// this._x = this.ani2.aupdate(0.1, 1, 66, -66,  67)  *(1-nnyu.pressv);
			// this._y = this.ani3.aupdate(0.1, 1, 0, -100,  67)  *(1-nnyu.pressv);
			// this._sc = this.ani4.aupdate(0.003, 0.006, 1.2, 1.7, 67)  *(1-nnyu.pressv) + 0.75*nnyu.pressv;
			// this._r2 = this.ani1.aupdate(0.005, 0.03, -0.1, 0.1,200)  *(1-nnyu.pressv);
			// this._x2 = this.ani5.aupdate(5, 30, -30, 30, 2N00)  *(1-nnyu.pressv);
			}
			let _mag = qb.mppng(nnyu.openclosev,0.33,0.66,-0.11,1.5)
			g_room.rotate( (this._r + this._r2 +-0.1*_mag ))
			// g_room.rotate( (this._r + this._r2)*(1-awakendv) +  0 )
			// if (nnyu.is_awakend) this.kutiscroll_spd = Math.abs(-qb.clamp(nnyu.kutiboyonv, -2, 2)*-15)

			// console.log(nnyu.is_awakend);
			// if (nnyu.is_awakend) {
			// 	this.kutiscroll_spd = qb.mppng(nnyu.ballhazumu, 30, 91, -1, -25)
			// 	this.kutiscrollmagtgt = 1;
			// } else {
			// 	this.kutiscroll_spd = 0
			// 	if (this.kutiscroll < -210 || 210 < this.kutiscroll) {
			// 			this.kutiscrollmagtgt = 0.5; 
			// 	}

			// }
			
			// this.kutiscroll += this.kutiscroll_spd
			// if (this.kutiscroll < -480) this.kutiscroll = 480
		
			// this.kutiscrollmag += this.kutiscrollmagynyn = ( this.kutiscrollmagynyn + ( this.kutiscrollmagtgt  - this.kutiscrollmag ) * 0.8 )* 0.5; 

			
			g_room.translate((this._x+this._x2)+-20*_mag   , this._y+80*_mag+nnyu.dragmy/30);



			// g_room.translate((this._x+this._x2)*(1-awakendv)+0   , (this._y)*(1-awakendv)+0);
			// g_room.scale((this._sc + this.tw_zoom[nnyu.openclosev1000].zzz)*(1-awakendv)+1*awakendv)


			g_room.scale((this._sc + this.tw_zoom[nnyu.openclosev1000].zzz -0*_mag   ))
			// g_room.scale((this._sc + this.tw_zoom[nnyu.openclosev1000].zzz)*(1-awakendv)+1*awakendv)
			
		}
	}
	
}

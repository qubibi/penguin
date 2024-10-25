class Nyu {
	constructor() {

		this.is_press = false;
		this.pressv = 0;
		this.pressspd = 0;
		this.kasanmy = 0;
		this.openclosev = 0;
		this.openclosev1000 = 0;
		this.openclosev_tgt = 0;
		this.openclosev_yunyun = 0;
		this.openclosev_yunyunfor = 0;
		this.is_awakend =  false;
		this.isDragging = false;
		this.dragStartX = this.dragStartY = 0;
		this.dragmx = this.dragmy = 0;
		this.samx = 0;
		this.samy = 0;
		this.yunyunrndm = qb.rndm(0.33, 0.59)
		this.tojitaaitastats = {};
		this.previousMoveY = 0;	this.reverseCount = 0;	this.threshold = 6; 	this.consecutiveFrames = 0; 	this.requiredFrames = 3; 
		this.awakendv_tgt = 0;
		this.awakendv_yunyunfor = 0;

		this.kutiboyonv = 0
		this.kutiboyonvre = 0
		this.kutiboyonvrere = 0
		this.kutiboyonv_for = 0
		this.ballhazumu = 0;
		this.ballhazumu_velo = 0;
		this.ballhazumu_bounce = 0.9;

		this.kyouseilock = true
	}

	f_ini() {
		
	}

	f_mousemove() {
		mmxx = (mouseX-canwh.w/2)/scaleFactor;
		mmyy = (mouseY-canwh.h/2)/scaleFactor;
		this.dragmx = mouseX - this.dragStartX;
		this.dragmy = mouseY - this.dragStartY;
	}

	f_mousedown() {
		cc_forslow = 0;
		is_slow = false;
		if (!is_tenjipre) {
			this.is_press = true;
			this.pressspd = qb.rndm(0.7, 1.2);
			this.isDragging = true;
			this.dragStartX = mouseX;
			this.dragStartY = mouseY;
			ootoa.f_mousedown()
			this.is_awakend = false;
			this.kutiboyonvre = 0
		}
	}

	f_mouseup() {
		if (!is_tenjipre) {
		if (awakendv>=1) {
			this.is_awakend = true
			this.ballhazumu_velo = 25
			this.kaihoumag = 1;
		}
		this.is_press = false;
		// this.pressspd = -0.1;
		this.pressspd = qb.rndm(-0.18,-0.88);
		// this.pressspd = qb.rndm(-0.2,-1.05);
		this.isDragging = false;
		this.dragmx = 0;
		this.dragmy = 0;
		// this.awakendv_tgt  = 0;
		this.yunyunrndm = qb.rndm(0.33, 0.51)
		zawakend.f_mabutanokatati()
		ootoa.f_mouseup()
		ootoa.megaaitasyunkandayo()
		this.kyouseilock = false
		}
	}



	
	f_awakend() {
		this.kasanmy = this.dragmy;
		this.kasanmy *= this.pressv;
		if (this.is_press && !this.is_awakend) {
			this.awakendv_tgt = qb.mppng3(this.dragmy, -200, 0 , 200, 1, 0, 1, 0)
		}
		if (this.awakendv_tgt>1) this.awakendv_tgt = 1;
		if (this.awakendv_tgt<0) this.awakendv_tgt = 0;
		awakendv += this.awakendv_yunyunfor = ( this.awakendv_yunyunfor + ( this.awakendv_tgt - awakendv ) * 1.3 )* 0.47; 
		if (awakendv>=1) {
			awakendv = 1;	
		}
		if (awakendv<0) awakendv = 0;
	}
	f_ball() {
		this.ballhazumu_velo += -1.2;
		this.ballhazumu += this.ballhazumu_velo;
		if (this.ballhazumu <= 0) {
			this.ballhazumu = 0;  
			this.ballhazumu_velo = -this.ballhazumu_velo * this.ballhazumu_bounce; 
		}
	}


	f_ef() {
		
		this.f_ball()

		this.samx = movedX2;
		this.samy = movedY2;
		if (this.isDragging) {
			this.dragmx = mouseX - this.dragStartX;
			this.dragmy = mouseY - this.dragStartY;
		}
		this.pressv += this.pressspd;
		if (this.pressv>1)this.pressv=1;
		else if (this.pressv< 0) this.pressv= 0;

		this.f_awakend()


		if (this.is_press) this.kutiboyonv_for  = this.kutiboyonv = awakendv;
		this.kutiboyonv += this.kutiboyonv_for = ( this.kutiboyonv_for + ( 0  - this.kutiboyonv ) * 0.07 )* 0.99; 
		// this.kutiboyonvre = qb.mppng3(this.kutiboyonv, -1,0,1, 1,1,0)
		// if (this.is_awakend) {
		// 	this.kutiboyonvre += this.kutiboyonv
		// 	this.kutiboyonvrere = qb.mppng(this.kutiboyonvre, 5, 15,  0,1)

		// 	this.kutiboyonvrere = this.ballhazumu
			
		// 	this.openclosev_tgt = 0.5+qb.mppng(this.kutiboyonvrere, 30, 112, 0, 0.5);
		// }
		// else this.openclosev_tgt = 0.5*this.pressv// + qb.mppng(this.kasanmy, 0, 100, 0, 0.5);
		// if (this.is_awakend) this.openclosev_tgt = 0.5*this.pressv + qb.mppng(this.kasanmy*1.37, 0, 100, 0, 0.5);


this.openclosev_tgt = 0.33*this.pressv+qb.mppng(this.kasanmy, 0, 150, 0, 0.66);



		// this.openclosev = this.openclosev_tgt
		this.openclosev_yunyun += this.openclosev_yunyunfor = ( this.openclosev_yunyunfor + ( this.openclosev_tgt - this.openclosev_yunyun ) * 2.8 )* this.yunyunrndm; 
		if (this.is_press) this.openclosev = this.openclosev_tgt;
		else this.openclosev = qb.clamp(this.openclosev_yunyun, 0, 1.33)


		// updateDebugClear()
		// updateDebug("awakendv "+awakendv)
		// updateDebug("kutiboyon "+this.kutiboyonv)
		// updateDebug("kutiboyonvre "+this.kutiboyonvre)


		if (this.kyouseilock) {
			this.openclosev = .33;
		}
		// this.openclosev = 1;
		globalOpenclosev = this.openclosev;
		
		this.openclosev1000 =  Math.round(qb.clamp( this.openclosev*1000,  0, 1000))

		// this.janenv = this.f_janenmapping(this.openclosev, 0.33, 0.66);


		// if (!this.is_awakend) {
		// 	this.awakendv100 += this.samy*this.pressv;
		// 	let resistance = 0;
		// 	resistance = this.calculateResistance(this.awakendv100);
		// 	this.awakendv100 -= resistance;
		// 	this.awakendv100 -= this.awakendv100 * 0.1;
		// 	if (this.awakendv100 > 99) {
		// 		this.is_awakend = true;
		// 		this.awakendv100 = 100;
		// 	}
		// }

		// this.awakendv100 = Math.max(0, Math.min(this.awakendv100, 100));


		

		// this.awakendv = this.awakendv100*0.01






		// this.awakendv += (this.samy/10*this.pressv - this.awakendv)/2;
		// this.awakendv100 = this.awakendv*100



		// updateDebugClear()
		// updateDebug("openclosev "+this.openclosev)
		// updateDebug("janenv "+this.janenv)
		// updateDebug("samx "+this.samx)
		// updateDebug("samy "+this.samy)
		// updateDebug("dragmx "+this.dragmx)
		
		// updateDebug("kasanmy "+this.kasanmy)


		this.f_check_megatojita(this.openclosev);
		this.f_check_kutigahiraita(this.openclosev);
		
	}


   tojitaaitacheck(v, t, cb) {
        const s = this.tojitaaitastats[t] ??= { p: 0, f: 0 };
        if (s.p <= t && v >= t && !s.f) {
            s.f = 1;            cb();            s.p = v;
            return true;
        }
        s.f = v >= t;        s.p = v;
        return false;
    }

	f_check_megatojita(v) {
	return this.tojitaaitacheck(v, 0.33, () => this.f_megatojita());
	}
	f_check_kutigahiraita(v) {
	return this.tojitaaitacheck(v, 0.67, () => this.f_kutigahiraita());
	}
	f_megatojita() {
		ootoa.megatojitasyunkandayo()
		
	}
	f_kutigahiraita() {
		ootoa.kutigaaitasyunkandayo()
	}
		
		

}




class Butai {
	constructor() {
		this.direction = 1;
		this.randomSpeed = 0;
		this.randomSpeedtgt = 0;
		this.randomRadius = 0;
		this.randomRadiustgt = 0;
		this.angle = 0;

		this.rndm = 0
		this.rndmb = 0

		background(0,0,255);
		noFill();
		stroke(255,0,0); 
		strokeCap(SQUARE);
		strokeWeight(1);

		
		// g_inside.fill("#000")
		// g_inside.circle(50, 50, 188)
		g_mask.background("#000000")
	}




	f_ef() {
		zbgbg.f_ef()
		zawakend.f_ef()
		zseniroiro.f_ef()




		if (tf) {
			g_room.background("#ffffff91")
			zbgbg.f_efdraw(g_room)
		}
		ccam.f_ef();


		g_mask.clear()
		zawakend.f_efdraw_inside(g_inside)
		zawakend.f_efdraw_mask(g_mask)

		zseniroiro.f_efdrawinside(g_inside)
		zseniroiro.f_efdrawoutside(g_room)


		g_hole.clear()
		g_hole.shader(shd_mask)
		shd_mask.setUniform('uMainTex', g_inside)
		shd_mask.setUniform('uMaskTex', g_mask)
		g_hole.rect(0,0,gw, gh)
		g_room.image(g_hole, 0, 0)


	}

}
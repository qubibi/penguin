
let c_door;

function but_setup() {
	c_door = new DoorSet();
	
}

let doorhasinuruxA = 500;
let doorhasinuruxB = 500;
let zawazawa_mul = 1;
let zawazawa_mul_tgt = 1;
function but_ef() {	

	let _cx = cnvs_wh/2 - c_door.myw/2;
	let _cy = cnvs_wh/2 - c_door.myh/2;

	c_door.f_mypos(_cx, _cy);
	c_door.f_ef();
	g_room.background(arr_keycol[4]);
	// g_room.background("#f80064ff");
	
	let _weight = g_room.strokeWeight( qb.rndmr(22, 3) );
	// g_room.scale(.5)
	// g_room.translate(500, 500)
	
	// g_room.strokeCap(PROJECT)
	
	zawazawa_mul += (zawazawa_mul_tgt - zawazawa_mul) / 4;

	let _gap = 6;
	scrbl.bowing    = .3;
	scrbl.roughness = 6+door_openclose_v*1;
	scrbl.maxOffset = 1.5*zawazawa_mul;
	

	let _ifholexhasi = c_door.arr_door_px[0];
	if (c_door.arr_door_px[0] > c_door.arr_door_px[1])_ifholexhasi = c_door.arr_door_px[1];
	let _ifholexhasi2 = c_door.arr_door_px[0];
	if (c_door.arr_door_px[1] > c_door.arr_door_px[0])_ifholexhasi2 = c_door.arr_door_px[1];
	let _ifholexhasi3 = c_door.arr_door_px[2];
	if (c_door.arr_door_px[2] < c_door.arr_hole_px[3]) _ifholexhasi3 = c_door.arr_hole_px[3];
	doorhasinuruxA += (_ifholexhasi-doorhasinuruxA)/1.5
	doorhasinuruxB += (_ifholexhasi2 - doorhasinuruxB)/2
	let _suityoku = 16
	let _skmy  = -17
	let _skmx  = 22
	let _angle = 90;
	g_room.stroke( arr_keycol[0] );
	let bg1_px = [0,                      c_door.arr_door_px[1]-16, c_door.arr_door_px[1]-16 , doorhasinuruxA-_skmx, doorhasinuruxA-_skmx,    0]
	let bg1_py = [0,                       0,                     c_door.arr_door_py[1]+_skmy,  c_door.arr_door_py[0]+_skmy,  c_door.arr_door_py[3]-3,  c_door.arr_door_py[3]-3]
	scrbl.scribbleFilling( bg1_px, bg1_py , _gap, _angle,  arr_keycol[0] );
	let bg2_px = [c_door.arr_door_px[1],   cnvs_wh,              cnvs_wh ,                c_door.arr_hole_px[2]+_skmx, c_door.arr_hole_px[1]+_skmx,  doorhasinuruxB,  c_door.arr_door_px[1]]
	let bg2_py = [0,                       0,                    c_door.arr_hole_py[2]-3,  c_door.arr_hole_py[2]-3,  c_door.arr_hole_py[1]+_skmy,  c_door.arr_hole_py[0]+_skmy,  c_door.arr_door_py[1]+_skmy]
	scrbl.scribbleFilling( bg2_px, bg2_py , _gap, _angle,  arr_keycol[0] );
	_angle = 90;
	let bg3_px = [0,                      _ifholexhasi-_skmx, c_door.arr_door_px[1]-_skmx-10 , c_door.arr_door_px[1]-10,  0]
	let bg3_py = [c_door.arr_hole_py[3]+_suityoku,  c_door.arr_hole_py[3]+_suityoku,  c_door.arr_door_py[2]+_suityoku,  cnvs_wh,          cnvs_wh]
	scrbl.scribbleFilling( bg3_px, bg3_py , _gap, _angle,  arr_keycol[0] );
	let bg4_px = [_ifholexhasi3,            cnvs_wh,     cnvs_wh , c_door.arr_door_px[2],  c_door.arr_door_px[2]-10]
	let bg4_py = [c_door.arr_hole_py[3]+_suityoku,  c_door.arr_hole_py[3]+_suityoku,  cnvs_wh,  cnvs_wh,  c_door.arr_door_py[2]+_suityoku]
	scrbl.scribbleFilling( bg4_px, bg4_py , _gap, _angle,  arr_keycol[0] );
	
	scrbl.bowing    = .3+ nyu.door_mspd_amari/25;
	scrbl.roughness = 4+door_openclose_v*1+ nyu.door_mspd_amari/12;
	scrbl.maxOffset = (1.5+ nyu.door_mspd_amari/10 )*zawazawa_mul;

	g_room.stroke( arr_keycol[1] );
	scrbl.scribbleFilling( c_door.arr_hole_px, c_door.arr_hole_py , _gap, _angle, arr_keycol[1] );

	if (door_openclose_v>.01) {
		scrbl.bowing    = 0.1;
		// scrbl.roughness = 3.8;
		scrbl.maxOffset = 1*zawazawa_mul;
		_angle = qb.rndmr(90, 1);
		g_room.stroke( arr_keycol[1] );
		scrbl.scribbleFilling2( c_door.arr_akari_px, c_door.arr_akari_py , _gap, _angle, arr_keycol[1] );
	}

	scrbl.bowing    = .3+ nyu.door_mspd_amari/10;
	scrbl.roughness = 3+door_openclose_v*1+ nyu.door_mspd_amari/15;
	scrbl.maxOffset = (1+ nyu.door_mspd_amari/15)*zawazawa_mul;

	
	// g_room.strokeWeight( qb.rndmr(12, 2) );
	if (door_openclose_v>=.5) {
		g_room.stroke( arr_keycol[3] );
		scrbl.scribbleFilling( c_door.arr_nob_px, c_door.arr_nob_py , _gap, _angle, arr_keycol[3] );
	}
	g_room.strokeWeight( qb.rndmr(22, 3)*.78 );
	g_room.stroke( arr_keycol[2] );
	scrbl.scribbleFilling( c_door.arr_door_px, c_door.arr_door_py , _gap, _angle, arr_keycol[2] );
	g_room.strokeWeight( _weight );
	if (door_openclose_v<.5) {
		g_room.stroke( arr_keycol[3] );
		scrbl.scribbleFilling( c_door.arr_nob_px, c_door.arr_nob_py , _gap, _angle, arr_keycol[3] );
	}

	g_room.resetMatrix()
}



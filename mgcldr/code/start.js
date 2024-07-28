'use strict'
let cnvs_wh = 1000;
let cnvs_rectx = [  0,  1000,  1000,  0  ];
let cnvs_recty = [  0,  0,  1000,  1000  ];
// let arr_keycol = [];
// let arr_keycol = ["#d85919bc","#afff19ff","#a33390bd","#2c3137cc","#fff"];
// let arr_keycol = ["#df61a8c8", "#43fab5ff", "#051b58b1", "#dc0d04c8","#fff"]; //c1
// let arr_keycol = ["#f3c682ff", "#dafcbbff", "#e49161b1", "#034fa6c8", "#a26123ff"]; //c2
// let arr_keycol = ["#43f3b0b8", "#ff0f", "#d44a34b8", "#289f81c8", "#0c2347c8"]; //c3

let arr_keycol = ["#000000af", "#c7e364ef", "#249693ff", "#ed9a9cff", "#ed9a9cff"]


let zoomtype = [1.0,  1.0];
let is_user_started = false;
let is_sound = false;
let cc_user_started = 0;

let scrbl;
let reverb;
let is_press = false;
let g_cover;
let g_all;
let g_room;
let tf = true;
let tm = 0;

let door_openclose_v = 0;

let bm_grid;
let bm_sample;
let au_dooropen;
let au_doorclose;
let au_doorclose_strong;
let au_doorclose_light;
let au_door1;
let au_door2;
let au_music;
let au_musicgroup;
let eff_noise1;

let is_autoclose = false;
let autoclosetime = 1100; //rndm ni naru

let is_goreload = false;
let fadeinout = 256;
let savemodetime = 1388
let is_kyoseiakanai = false;
let cc_is_kyoseiakanai = 0;
let is_savemode = false;
let cc_no_savemode = 0;
let is_forcc_effstart = false;
let cc_effstart = 0;
function preload() {
	bm_grid = loadImage("imp/grid.png");

	au_dooropen = new Pizzicato.Sound('imp/door_open.mp3');
	au_door1 = new Pizzicato.Sound('imp/door1.mp3');
	au_door2 = new Pizzicato.Sound('imp/door2.mp3');
	au_doorclose = new Pizzicato.Sound('imp/door_close.mp3');
	au_doorclose_strong = new Pizzicato.Sound('imp/door_close_strong.mp3');
	au_doorclose_light = new Pizzicato.Sound('imp/door_close_light.mp3');
	au_music = new Pizzicato.Sound({ 
		source: 'file',
		options: { 
			path: ['imp/schumann3.mp3'],
			loop:true
		}
	}, function() {
		au_musicgroup = new Pizzicato.Group([au_music]);
		oto_setup();
	});

}


function setup() {

	if (ososos=="pc") pixelDensity(0.7);
	else pixelDensity(0.575);
	frameRate(27)
	textureMode(NORMAL);
	angleMode(DEGREES);
	// qb.f_irokime(arr_keycol, "c8", 5);
	// arr_keycol[4] =  qb.f_cRndmHX(); // bg1
	// arr_keycol[0] =  qb.f_cRndmHX(); // bg2
	// arr_keycol[2] =  qb.f_cRndmHX(); // door
	// arr_keycol[3] =  qb.f_cRndmHX(); // knob
	// arr_keycol[1] = qb.f_cRndmHX(); // hikari
	// console.log(arr_keycol);
	createCanvas(cnvs_wh, cnvs_wh);
	g_cover = createGraphics(cnvs_wh, cnvs_wh);
	g_all = createGraphics(cnvs_wh, cnvs_wh, WEBGL);
	g_room = createGraphics(cnvs_wh, cnvs_wh);
	scrbl = new Scribble(g_room);
	nyu_setup();
	but_setup();
	
	eff_noise1 = g_all.createShader(vvvsss, vvvfff);
	g_all.shader(eff_noise1);
	if (is_forhicetnunc) {
		resizeCanvas(windowHeight, windowHeight)
	}
}

function windowResized() {
	if (is_forhicetnunc) {
		resizeCanvas(windowHeight, windowHeight)
	}
}

let testx = 0;
let testy = 0;
let for_sineha_spd = 0;
let sineha = 0;
let timecc = 0;
function f_draw() {
	for_sineha_spd += .03
	sineha = 0 + (Math.cos(for_sineha_spd) * 1);
	
	tf = !tf;
	tm += .009;
	tm %= 1;
	let _framecount = frameCount*.01;
	if (Math.random()<.33) _framecount = Math.random()
	_framecount %= 100;
	if (is_user_started) cc_user_started+=1;

	nyu_ef();
	but_ef();
	oto_ef();
	// ten_ef();
	eff_noise1.setUniform('noisetuyosa', 0.1);
	eff_noise1.setUniform('radius', 0.001);
	eff_noise1.setUniform('u_tex', g_room);
	eff_noise1.setUniform('time', _framecount);	
	g_all.rect(-500, -500, 1000, 1000);
	if (is_forhicetnunc) image(g_all,0,0,windowHeight, windowHeight);
	else image(g_all,0,0);


}

function draw() {
	f_draw();
	if (is_forcc_effstart) {
		cc_effstart += 1;
		if (cc_effstart==23) {
			f_savemode_kaijo_karano_eff();
		}
	}
	// if (!is_savemode) cc_no_savemode+=1;
	if (is_kyoseiakanai) {
		cc_is_kyoseiakanai+=1;
		if (cc_is_kyoseiakanai==13) is_kyoseiakanai = false;
	}
	if (is_goreload) {
		g_cover.clear()
		g_cover.fill(0, fadeinout);
		g_cover.rect(0,0,cnvs_wh, cnvs_wh)
		image(g_cover,0,0);
		fadeinout += 20;
		if (fadeinout > 275) location.href='pagejump.html'
	} else {
		if (fadeinout > 0) {
			g_cover.clear()
			g_cover.fill(0, fadeinout);
			g_cover.rect(0,0,cnvs_wh, cnvs_wh)
			image(g_cover,0,0);
			fadeinout += -20;
		}	
	}
}


function f_savemode( _is) { // only for nyuryoku
	// console.log("f_savemode");
	if (_is) {
		// if (cc_no_savemode > 4141) { //3131 ga kyosei hatudo
			// is_kyoseiakanai = true;
			// cc_is_kyoseiakanai = 0;
		// }
		cc_no_savemode = 0;
		// console.log("f_savemode_true");
		pixelDensity(0.28);
		frameRate(15)
		f_oto_reset()
		is_savemode = true;
		is_forcc_effstart = false;
	} else {
		// console.log("f_savemode_false");
		frameRate(27)
		if (ososos=="pc") pixelDensity(0.7);
		else pixelDensity(0.575);
		f_savemode_kaijo_karano_otostart()
		is_savemode = false;
		is_forcc_effstart = true;
		
	}
}



function f_usertouchstart() {
	if (!is_user_started) {
		// userStartAudio();
		// Tone.context.resume()
		// Wad.audioContext.resume()

    let context = Pizzicato.context
    let source = context.createBufferSource()
    source.buffer = context.createBuffer(1, 1, 22050)
    source.connect(context.destination)
    source.start()

		is_user_started = true;
		is_sound = true;
		if (!is_forhicetnunc) f_usertouchstart_soundbtn_on();	
	}
}

let arr_timecheck = [0,15,30,45]
let arr_timecheck_min = 4
setInterval(f_timecheck, 200);
function f_timecheck() {
	
		const _date1 = new Date();
		for (var ii =0; ii<6; ii++) {
			if (arr_timecheck[ii] == _date1.getMinutes()) {
				if (_date1.getSeconds()==arr_timecheck_min) {
					is_goreload = true;
					is_autoclose = true
					is_kyoseiakanai = true
					frameRate(27)
				}
			}
		}
}




function setup() {
	f_canvassizeset();
	f_gobjsizeset();

	canvas1 = createCanvas(canwh.w, canwh.h, WEBGL);
	frameRate(30);
	if (ismobile) pixelDensity(1.2);
	else pixelDensity(1.8);
	ortho();	
	canvas1.parent('wr_myCanvas');
	g_room = createGraphics(gw, gh, WEBGL);
	g_room.pixelDensity(.8);
	g_mask = createGraphics(gw, gh, WEBGL);
	g_mask.pixelDensity(.2);
	g_inside = createGraphics(gw, gh, WEBGL);
	
	g_output = createGraphics(gw, gh, WEBGL);
	g_hole = createGraphics(gw, gh, WEBGL);
	g_hole.pixelDensity(.75);

	g_mask.noStroke()
	g_inside.noStroke()
	g_hole.noStroke()
	// noSmooth();
	// g_room.noSmooth();
	// g_output.noSmooth();
	imageMode(CENTER)
	g_output.imageMode(CENTER)
	g_room.imageMode(CENTER)


	zbgbg = new Z_bgbg();
	zawakend = new Z_awakend();
	zseniroiro = new Z_seniroiro();
	ggam = new Gamen();
	bbut = new Butai();
	ccam = new Cameraa();
	nnyu = new Nyu();
	// ooto = new Snoto();


	document.addEventListener('click', startAudioContextFornakaokasan);
	document.addEventListener('touchstart', startAudioContextFornakaokasan);
	f_windowsize_iroiro()

}
function startAudioContextFornakaokasan() {
  if (!isSetupComplete) {
    userStartAudio().then(() => {
      ootoa.setup(); isSetupComplete = true;
		// is_tenjipre = true
    });
    // イベントリスナーを削除
   //  document.removeEventListener('click', startAudioContextFornakaokasan);
   //  document.removeEventListener('touchstart', startAudioContextFornakaokasan);
  }
}

function f_slowcheck() {
	cc_forslow++;
	if (cc_forslow==1888) is_slow = true
	if (is_slow) {
		slowtime++;
		slowtime %= slowtime_tgt;
		if (slowtime==0 && slowtime_tgt<9) slowtime_tgt++
		slowmusicmag += (0.075 - slowmusicmag)/9
	} else {
		slowtime = 0; slowtime_tgt = 1;
	}
}

function draw() {
	f_slowcheck()
	tf2= !tf2;
	if (ismobile) {
		// if (tf2)	pixelDensity(1.2);
		// else 	pixelDensity(.6);
	}
	if( slowtime == 0) {
		if (!is_slow)slowmusicmag += (1-slowmusicmag)/3

		tf = !tf;

		cc++;
		cc100++;
		cc100 %= 100;
		cc4++;
		cc4 %= 4;
		
		
			
		g_room.push();
		g_mask.push()
		nnyu.f_ef();
		// camera > butai gawa
		bbut.f_ef();

		if (isSetupComplete) {
			getAudioContext().resume();
			ootoa.f_ef();
		}

		
		ggam.f_ef();
		image(g_output, 0,0, gw * scaleFactor, gh * scaleFactor);
		g_mask.pop()
		g_room.pop();

	}

	// fill("#f0f")
	// rect(width/-2.1, globalOpenclosev *200, 20, 10)
	// noFill()
	// rect(width/-2.1, 0, 20, 210)

	// fill("#f0f")
	// rect(width/-2.5, 100+nnyu.kutiboyonv*100, 20, 10)
	// noFill()
	// rect(width/-2.5, 0, 20, 210)

	// fill("#f0f")
	// rect(width/-3, nnyu.kutiboyonvrere*1, 20, 10)
	// noFill()
	// rect(width/-3, 0, 20, 210)

	// fill("#00f")
	// rect(width/-3.6+nnyu.ballhazumu, 0, 10, 20)
	// noFill()
	// rect(width/-3.6, 0, 210, 20)
}








// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // 

function windowResized() {
	f_canvassizeset();
	f_gobjsizeset();
	resizeCanvas(canwh.w, canwh.h);
	f_windowsize_iroiro()
	g_room.resizeCanvas(gw, gh);
	g_output.resizeCanvas(gw, gh);
	ortho();	
}


// function mouseMoved(){
	// console.log(1);
	  

// }
function mousePressed() {
	if (getAudioContext().state !== 'running') {
		userStartAudio();
	}	
  prevX2 = mouseX;
  prevY2 = mouseY;
	handleInteraction()
	// points.push(createVector((mouseX - windowWidth/2)/scaleFactor, (mouseY - windowHeight/2)/scaleFactor ));
	nnyu.f_mousedown();//startDrag();
	
}
function touchStarted() {
	if (getAudioContext().state !== 'running') {
		userStartAudio();
	}
// console.log(touchX);	
// if (touchX)    prevX2 = touchX;
  if (touches.length > 0) {
    prevX2 = touches[0].x;
    prevY2 = touches[0].y;
  }
	handleInteraction()
	nnyu.f_mousedown();//startDrag();
	return false;
}
function mouseReleased() {
  nnyu.f_mouseup();//endDrag();
}
function touchEnded() {
	nnyu.f_mouseup();//endDrag();
	return false;
}
//////////////
function mouseDragged() {
	updateMovement(mouseX, mouseY);
  nnyu.f_mousemove();
}
function touchMoved() {
  if (touches.length > 0) {
    updateMovement(touches[0].x, touches[0].y);
  }
  nnyu.f_mousemove();
  return false;  // タッチイベントのデフォルト動作を防ぐ
}
function updateMovement(x, y) {
  movedX2 = x - prevX2;
  movedY2 = y - prevY2;
  prevX2 = x;
  prevY2 = y;
}


function keyPressed() {
	// if (key === 'c') points = [];
	// if (key === 't') isClosed = !isClosed; // 't'キーで開いた/閉じた曲線を切り替え
}








function handleInteraction() {
	if (!canPlaySound) { // AudioContextを開始
		userStartAudio().then(() => {
		ootoa.f_audiocontext_start()
		canPlaySound = true;
	});
	} 
	return false;
}

function f_canvassizeset() {
	const _wh = calculateAspectRatio(windowWidth, windowHeight, hiritu)
	canwh.w = _wh.width
	canwh.h = _wh.height
}

function f_gobjsizeset() {
	const _wh = calculateDimensionsFromArea(allpixels, hiritu)
	gw = _wh.width
	gh = _wh.height
}




function f_windowsize_iroiro() {
	scaleFactor = Math.max(canwh.w / gw, canwh.h / gh);
	winxy7.x = (-canwh.w/2)/scaleFactor;
	winxy7.y = (-canwh.h/2)/scaleFactor;
	winxy9.x = (canwh.w/2)/scaleFactor;
	winxy9.y = (-canwh.h/2)/scaleFactor;
	winxy3.x = (canwh.w/2)/scaleFactor;
	winxy3.y = (canwh.h/2)/scaleFactor;
	winxy1.x = (-canwh.w/2)/scaleFactor;
	winxy1.y = (canwh.h/2)/scaleFactor;
	winxy4.x = (-canwh.w/2)/scaleFactor;
	winxy4.y = 0
	winxy6.x = (canwh.w/2)/scaleFactor;
	winxy6.y = 0

	rmw = 40*(canwh.w/800)/scaleFactor;
}



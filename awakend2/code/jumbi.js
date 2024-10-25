let isgamen = true;
let iscamera = true;
let ismobile = false;
let is_slow = false;
let isSetupComplete = false;
let is_tenjipre  = false;
let ismusic = true; 
let cc_forslow = 0;
let slowmusicmag = 1;
let ooto;
let bbut;
let ccam;
let nnyu;
let ggam;
let zbgbg;
let zawakend;
let zseniroiro;
// let zosens;
// let zokaobg;
// let zomedama;
// let ooto;

// let shd_invert; 
let shd_su; 
let shd_diffuse; 
let shd_blur; 
let shd_colormap; 
let shd_insfil; 
let shd_kuwabara; 
let shd_threshold; 
let shd_mask; 

let ocv_mag1 = 0;


let canvas1;
let g_output;
let g_room;
let g_mask;
let g_hole;
let g_inside;
let g_debug;

let globalOpenclosev = 0;
let awakendv = 0;



// let hiritu = [16,9]
let hiritu = [9, 16]
let allpixels = 250000;
let canwh = {w:0,h:0}
let gw = 0; // atode hairu
let gh = 0; // atode hairu
let winxy7 = {};
let winxy9 = {};
let winxy1 = {};
let winxy3 = {};
let winxy4 = {};
let winxy6 = {};
let rmw = 0;
let scaleFactor = 1;

let tf = false
let cc = 0;
let cc4 = 0;
let cc100 = 0;
let ccslow = 0;

let mmxx = 0;
let mmyy = 0;
let prevX2 = 0, prevY2 = 0, movedX2 = 0, movedY2 = 0;


let _prevValue = 0;
let _amplitude = 0;
let _isIncreasing = true;


const colorpalette = [
  { original: [255, 0, 0],     mapped: [0, 233, 50] },    // Red
  { original: [0, 255, 0],     mapped: [100, 200, 0] },   // Green
  { original: [0, 0, 255],     mapped: [0, 150, 255] },    // Blue
  { original: [255, 255, 0],   mapped: [255, 200, 0] },   // Yellow
  { original: [0, 255, 255],   mapped: [0, 255, 200] },   // Cyan
  { original: [255, 0, 255],   mapped: [0, 0, 200] },   // Purple
  { original: [255, 255, 255], mapped: [230, 230, 230] }, // White
  { original: [0, 0, 0],       mapped: [150, 50, 50] }     // Black
];











let ootoa = {}
let canPlaySound = false;
function preload() {
  ootoa = new SnMusic();
  if (ismusic) ootoa.fileyomikomi()



	console.log("p5js_preload()");
	// shd_invert = loadShader('./shd/p5img.vert', './shd/invert.frag');
	// shd_contrast = loadShader('./shd/p5img.vert', './shd/contrast.frag');
	// shd_diffuse = loadShader('./shd/p5img.vert', './shd/diffuse.frag');
	// shd_colormap = loadShader('./shd/p5img.vert', './shd/colormap.frag');
	// shd_insfil = loadShader('./shd/p5img.vert', './shd/insfil.frag');
	shd_su = loadShader('./shd/p5img.vert', './shd/su.frag');
	// shd_kuwabara = loadShader('./shd/p5img.vert', './shd/kuwabara.frag');
	shd_threshold = loadShader('./shd/p5img.vert', './shd/thresholdandinsfillv3.frag');
	shd_blur = loadShader('./shd/p5img.vert', './shd/blurv2.frag');
	// shd_threshold = loadShader('./shd/p5img.vert', './shd/threshold.frag');
  
  shd_mask = loadShader('./shd/p5img.vert', './shd/mmask.frag');
	// shd_noise = loadShader('./shd/p5img.vert', './shd/noise.frag');
	// shd_toon = loadShader('./shd/p5img.vert', './shd/toon.frag');
}




function calculateAspectRatio(windowWidth, windowHeight, targetRatio) {
  const [widthRatio, heightRatio] = targetRatio;
  const windowAspectRatio = windowWidth / windowHeight;
  const targetAspectRatio = widthRatio / heightRatio;
  let width, height;
  if (windowAspectRatio > targetAspectRatio) {
    height = windowHeight;    width = height * targetAspectRatio;
  } else {
    width = windowWidth;    height = width / targetAspectRatio;
  }
  return {
    width: Math.round(width),height: Math.round(height)
  };
}

function calculateDimensionsFromArea(totalArea, aspectRatio) {
  const [widthRatio, heightRatio] = aspectRatio;
  // 面積 = 幅 * 高さ = (r * y) * y = r * y^2 （rは縦横比）
  const r = widthRatio / heightRatio;
  const height = Math.sqrt(totalArea / r);
  const width = r * height;
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}

function isMobile() {
  if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
    return true;
  }
  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }
  return false;
}
ismobile = isMobile();


let debugContent = '';
function updateDebug(text) {
  debugContent += text + '<br>';
  let debugElement = select('#debugdom');
  if (debugElement) {
    debugElement.html(debugContent);
  } else {
    console.warn('Debug element not found');
  }
}

function updateDebugClear() {
  debugContent = '';
  let debugElement = select('#debugdom');
  if (debugElement) {
    debugElement.html('');
  }
}


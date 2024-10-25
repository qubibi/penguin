class Gamen {
	constructor() {
		this.for_time = 0;
		this.colorMapImage = createImage(3, 3);
		this.generateColorMap();
	}
	f_ef() {
		this.for_time += Math.random()*0.1
		this.for_time %= 360;


		// g_output.shader(shd_diffuse);
		// shd_diffuse.setUniform('tex0', g_room);
		// shd_diffuse.setUniform('tuyosa', .003	);
		// shd_diffuse.setUniform('time',  millis() / 1000.0);
		// g_output.rect(0, 0, gw, gh);

		

		// g_output.shader(shd_blur);
		// shd_blur.setUniform('tex0', g_room);
		// shd_blur.setUniform('texelSize', [1.0 / gw, 1.0 / gh]);
		// shd_blur.setUniform('blurAmount', 2.0);
		// g_output.rect(0, 0, gw, gh);


		// // if (cc100>50) {

		// g_output.shader(shd_contrast);
		// shd_contrast.setUniform('tex0', g_output);
		// g_output.rect(0, 0, gw, gh);


		if (isgamen ) {
			// g_output.shader(shd_kuwabara);
			// shd_kuwabara.setUniform('uTexture', g_room);
			// shd_kuwabara.setUniform('_fade', .7);
			// shd_kuwabara.setUniform('_blur1x', 71.0+qb.rndm(0,80));
			// let _mag = qb.mppng(nnyu.openclosev,0.5, 0.8,0, 1)	
			// shd_kuwabara.setUniform('_blur1y', -(51.0+qb.rndm(0,20)+40*_mag ));
			// shd_kuwabara.setUniform('_radius', 3.1+qb.rndm(0,.06));
			// g_output.rect(0, 0, gw, gh);


			// g_output.shader(shd_colormap);
			// shd_colormap.setUniform('tex0', g_output);
			// shd_colormap.setUniform('colorMap', this.colorMapImage);
			// shd_colormap.setUniform('colorMapSize', [3, 3]);
			// g_output.rect(0, 0, gw, gh);



			g_output.shader(shd_threshold);
			shd_threshold.setUniform('uTexture', g_room);
			shd_threshold.setUniform('_fade', .7);
			shd_threshold.setUniform('_randomRange', qb.rndm(0.4, 0.6));
			shd_threshold.setUniform('_blur1x', 71.0+qb.rndm(0,80));
			// let _mag = qb.mppng(nnyu.openclosev,0.5, 0.8,0, 1)	
			shd_threshold.setUniform('_blur1y', -(57.0+qb.rndm(0,20)));
			shd_threshold.setUniform('_radius', 3.0+qb.rndm(0,.1));

			shd_threshold.setUniform('_threshold', .44);
			shd_threshold.setUniform('_time', this.for_time);
			shd_threshold.setUniform('_noiserange', 0.23);
			shd_threshold.setUniform('_mixfade', .65);
			g_output.rect(0, 0, gw, gh);



			g_output.shader(shd_blur);
			shd_blur.setUniform('tex0', g_output);
			shd_blur.setUniform('texelSize', [1.0 / gw, 1.0 / gh]);
			shd_blur.setUniform('blurAmount', +qb.rndm(1.4, 2.0));
			g_output.rect(0, 0, gw, gh);

		} else {
			
			g_output.shader(shd_su);
			shd_su.setUniform('tex0', g_room);
			g_output.rect(0, 0, gw, gh);

		}


		
			// g_output.shader(shd_insfil);
			// shd_insfil.setUniform('tex0', g_output);
			// g_output.rect(0, 0, gw, gh);

		// } else {

		// }
		
	}

generateColorMap() {
    this.colorMapImage = createImage(3, 3);
    this.colorMapImage.loadPixels();
    let colors = [
        [0, 0, 0],      // 黒
        [0, 100, 255],    // 青
        [255, 0, 0],    // 緑
        [0, 255, 255],  // シアン
        [255, 50, 0],    // 赤
        [255, 0, 200],  // マゼンタ
        [255, 230, 0],  // 黄
        [255, 255, 255],// 白
        [255, 255, 0] // グレー
    ];

    for (let i = 0; i < 9; i++) {
        let x = i % 3;
        let y = Math.floor(i / 3);
        let index = (y * 3 + x) * 4;
        this.colorMapImage.pixels[index] = colors[i][0];
        this.colorMapImage.pixels[index + 1] = colors[i][1];
        this.colorMapImage.pixels[index + 2] = colors[i][2];
        this.colorMapImage.pixels[index + 3] = 255; // Alpha
    }
    this.colorMapImage.updatePixels();
}

}

class qb {
	static f_cRndmRGB() {
		let _randomColor = "rgb(" + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ")" ;
		return _randomColor;
	}
	static f_cRndmHX() {
		let _randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
		return "#"+_randomColor;
	}

	static f_irokime(_arr, _alpha, _len) {
		for (let ii=0; ii<_len; ii++) {
			_arr[ii] = this.f_cRndmHX()+_alpha;
		}
	}
	static rndmmm(_min,_max) {
		return _min+(_max-_min)/2 + (Math.random()-.5)*(_max-_min);
	}
	static rndmr(_center,_range) {
		let _rnd = (  Math.random()+Math.random())/2.0;
		return _center + (_rnd-.5)  * (_range*2);
	}


	//tm += .02; tm %= 1;
	static mSin(_tm) {
		return Math.sin( 2 * Math.PI * _tm );
	}
	static mSquare(_tm) {
		return Math.sign( Math.sin( 2 * Math.PI * _tm ) )
	}
	static mTriangle(_tm) {
		return 1-4*Math.abs( Math.round(_tm-0.25)-(_tm-0.25) );
	}
	static mSawtooth(_tm) {
		return 2 * ( _tm - Math.floor( _tm + .5 ) );
	}







	// curveは正の値側で大きくなるほど、はじめがじっくり（遅い）
	// 逆側は負の値側、大きくなるほど、はじめから早くに上がる
	static mppng(x, x0, x1, y0, y1, curve = 0) {
		if (x0 > x1) {
			return mppng(x, x1, x0, y1, y0, curve);
		}
		if (x <= x0) {
			return y0;
		} else if (x >= x1) {
			return y1;
		} else {
			if (curve >= 0) {
				return Math.pow((x - x0) / (x1 - x0), 1 + curve) * (y1 - y0) + y0;
			} else {
				return Math.pow((x - x1) / (x0 - x1), 1 - curve) * (y0 - y1) + y1;
			}
		}
	}





	

	/**
	 * 上に凸関数
	 *
	 * x0 < x1 < x2 かつ y0 < y1 かつ y1 > y2 である設定値と変動値 x を受け取り、
	 * x == x1 の際には y1 が返り、
	 * x <= x0 の際には y0 が返り、
	 * x >= x2 の際には y2 が返り、
	 * その間をなだらかに補間する上に凸な関数
	 *
	 * @param smooth 丸め具合。0だと線形補間、1だと f(x) = -x^2 のカーブ
	 */
	static mppng_cu(x,  x0, x1, x2, y0, y1, y2, smooth=0.5) {
	// static convexUpward(x,  x0, x1, x2, y0, y1, y2, smooth=0.5) {
		var rangeX, rangeY;
		if (x < x1) {
			rangeX = x1 - x0;
			rangeY = y1 - y0;
		} else {
			rangeX = x2 - x1;
			rangeY = y1 - y2;
		}
		x = Math.abs((x - x1) / rangeX);
		return y1 - Math.min(Math.pow(x, 1 + smooth), 1) * rangeY;
	}





}




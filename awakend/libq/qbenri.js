
class qb {
  static colrndm(alpha = 1) {
    const rgb = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return '#' + rgb + alphaHex;
  }
  
  static rndm(_a, _b) {
    return (_a < _b ? _a : _b) + Math.random() * Math.abs(_b - _a);
  }
  static rndmint(_a, _b) {
    return Math.floor((_a < _b ? _a : _b) + Math.random() * Math.abs(_b - _a));
  }

  static rndmc(_v) {
    return ((Math.random()-.5)*2)*_v;
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
	 * x0 < x1 < x2 かつ y0 < y1 かつ y1 > y2 である設定値と変動値 x を受け取り、
	 * x == x1 の際には y1 が返り、
	 * x <= x0 の際には y0 が返り、
	 * x >= x2 の際には y2 が返り、
	 * その間をなだらかに補間する上に凸な関数
	 * param smooth 丸め具合。0だと線形補間、1だと f(x) = -x^2 のカーブ
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

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

static deepCopyTwoLevels(obj) {
    const copy = { ...obj };
    for (let key in copy) {
    if (typeof copy[key] === 'object' && copy[key] !== null) {
        copy[key] = { ...copy[key] };
    }
    }
    return copy;
}

    static mppng3(_value, x1, x2, x3, y1, y2, y3, smooth = 0.5, clamp = true) {
        // クランプ処理
        if (clamp) {
            if (_value <= x1) return y1;
            if (_value >= x3) return y3;
        }

        let rangeX, rangeY;
        if (_value < x2) {
            rangeX = x2 - x1;
            rangeY = y2 - y1;
        } else {
            rangeX = x3 - x2;
            rangeY = y2 - y3;
        }

        const x = Math.abs((_value - x2) / rangeX);
        return y2 - Math.min(Math.pow(x, 1 + smooth), 1) * rangeY;
    }
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////

// let _aue = qb.tweenArrays([this.asenue1, this.asenue2], qb.clamp(mmyy/100,0,      .98))
static tweenArrays(arrays, progress) {
    if (arrays.length < 2) {
        throw new Error("少なくとも2つの配列が必要です");
    }
    const allSameLength = arrays.every(arr => arr.length === arrays[0].length);
    if (!allSameLength) {
        throw new Error("すべての配列の長さが一致していません");
    }

    const result = [];
    for (let i = 0; i < arrays[0].length; i++) {
        const tweenedObject = this.tweenObjects(arrays.map(arr => arr[i]), progress);
        result.push(tweenedObject);
    }
    return result;
}

static tweenObjects(objects, progress) {
    const result = {};
    for (const key in objects[0]) {
        if (typeof objects[0][key] === 'object' && objects[0][key] !== null) {
            result[key] = this.tweenObjects(objects.map(obj => obj[key]), progress);
        } else if (typeof objects[0][key] === 'number') {
            result[key] = this.tweenValue(objects.map(obj => obj[key]), progress);
        } else if (typeof objects[0][key] === 'string' && this.isHexColor(objects[0][key])) {
            result[key] = this.tweenHexColor(objects.map(obj => obj[key]), progress);
        } else {
            result[key] = objects[0][key]; // 数値でないプロパティはそのままコピー
        }
    }
    return result;
}

static tweenValue(values, progress) {
    const segmentCount = values.length - 1;
    const segmentIndex = Math.min(Math.floor(progress * segmentCount), segmentCount - 1);
    const segmentProgress = (progress * segmentCount) - segmentIndex;
    const start = values[segmentIndex];
    const end = values[segmentIndex + 1];
    return start + (end - start) * segmentProgress;
}

static lerp(start, end, amt) {
    amt = amt < 0 ? 0 : amt > 1 ? 1 : amt;
    return typeof start === 'number'
    ? start + (end - start) * amt
    : {
        x: start.x + (end.x - start.x) * amt,
        y: start.y + (end.y - start.y) * amt
        };
}

static isHexColor(color) {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

static tweenHexColor(colors, progress) {
    const rgbColors = colors.map(this.hexToRgb);
    const tweenedRgb = this.tweenObjects(rgbColors, progress);
    return this.rgbToHex(tweenedRgb);
}

static hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

static rgbToHex(rgb) {
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
}


}

  





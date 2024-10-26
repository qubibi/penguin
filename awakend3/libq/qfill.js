class qfill { // for p5

	static biasedRandom() {
		const power = 3;
		return Math.random() < 0.5 ? Math.pow(Math.random(), power) : 1 - Math.pow(Math.random(), power);
	}


  static drawfillv2(_g, _vtarray, _col = "#ffffff", _futosa = 1, shiftAmount = 0, _rndmmagA = 0, _zurashi = [0,1], _zurashirndm = 0, _bornmag = 1) {
    const len = _vtarray.length;
    if (len < 2) return; // 少なくとも2点必要

    _g.stroke(_col);
    _g.strokeWeight(_futosa);
    _g.noFill();

    // シフト量を正規化
    const normalizedShift = ((shiftAmount % len) + len) % len;

    _g.beginShape(LINES);
    const halfLen = Math.floor(len / 2);
    for (let i = 0; i < halfLen; i++) {
		if (Math.random()< _bornmag) {
      const startIndex = (i + normalizedShift) % len;
      const endIndex = (len - 1 - i + normalizedShift) % len;

      const startPoint = _vtarray[startIndex];
      const endPoint = _vtarray[endIndex];
		let sp = qb.lerp(startPoint, endPoint, _zurashi[0]+ qb.rndm(0, _zurashirndm))
		let ep = qb.lerp(startPoint, endPoint, _zurashi[1] - qb.rndm(0, _zurashirndm))
		sp.x += qb.rndm(-_rndmmagA, _rndmmagA)
		sp.y += qb.rndm(-_rndmmagA, _rndmmagA)
		ep.x += qb.rndm(-_rndmmagA, _rndmmagA)
		ep.y += qb.rndm(-_rndmmagA, _rndmmagA)

      _g.vertex(sp.x, sp.y);  
      _g.vertex(ep.x, ep.y);
		}
    }
    _g.endShape();
  }

	// static drawfillv2 ( _g, _vtarray, _col = "#ffffff", _futosa = 1) {
	// 	if (_vtarray.length < 2) return; // 少なくとも2点必要
	// 	_g.stroke(_col);
	// 	_g.strokeWeight(_futosa);
	// 	_g.noFill();

	// 	_g.beginShape(LINES);
	// 	for (let i = 0; i < Math.floor(_vtarray.length / 2); i++) {
	// 		const startPoint = _vtarray[i];
	// 		const endPoint = _vtarray[_vtarray.length - 1 - i];

	// 		_g.vertex(startPoint.x, startPoint.y);	
	// 		_g.vertex(endPoint.x, endPoint.y);
	// 	}
	// 	_g.endShape();
	// }






	static drawfill(_g, _startv, _endv, _rndmmagA = 0, _rndmmagB = 0, _mabiki = 0, _col = "#ffffff", _futosa = 1, _iscurvemag = 0, _curve = 0, _curverndm = 0) {
		_g.stroke(_col); 
		// _g.strokeCap(ROUND)
		// _g.strokeJoin(ROUND);
		// _g.strokeCap(PROJECT)
		// _g.strokeCap(PROJECT)
		// _g.strokeJoin(MITER);
		_g.strokeWeight(_futosa);
		_g.noFill();
		// if (!_zigzag) _g.beginShape(LINES);
		// else _g.beginShape();

		// _g.beginShape();

		let iscurve = true;


		// for (let i = 0; i < _startv.length; i++) {
		// 	if (random()< (1-_mabiki)) {

		// 		let start = _startv[i];
		// 		let end = _endv[i];

		// 		let t1, t2;
		// 		let _range = 1 - _rndmmagA*(.9+Math.random()*0.1)
		// 		t1 =  (1-_range)*this.biasedRandom()
		// 		t2 = t1+_range


		// 		let x1 = _g.lerp(start.x, end.x, t1)+qb.rndm(-100,100)*_rndmmagB;
		// 		let y1 = _g.lerp(start.y, end.y, t1)+qb.rndm(-100,100)*_rndmmagB;
		// 		let x2 = _g.lerp(start.x, end.x, t2)+qb.rndm(-100,100)*_rndmmagB;
		// 		let y2 = _g.lerp(start.y, end.y, t2)+qb.rndm(-100,100)*_rndmmagB;


		// 		_g.vertex(x1, y1);
		// 		_g.vertex(x2, y2);
		// 	}
		// }
		// _g.endShape();






		const invMabiki = 1 - _mabiki;
		
		for (let i = 0; i < _startv.length; i++) {
			if (Math.random() < invMabiki) {
				const inistart = _startv[i];
				const iniend = _endv[i];
				const range = 1 - _rndmmagA //* (0.9 + Math.random() * 0.1);
				const t1 = (1 - range) * this.biasedRandom();
				const t2 = t1 + range;

				const start = {
					x: _g.lerp(inistart.x, iniend.x, t1) + qb.rndm(-_rndmmagB, _rndmmagB),
					y: _g.lerp(inistart.y, iniend.y, t1) + qb.rndm(-_rndmmagB, _rndmmagB)
				};
				const end = {
					x: _g.lerp(inistart.x, iniend.x, t2) + qb.rndm(-_rndmmagB, _rndmmagB),
					y: _g.lerp(inistart.y, iniend.y, t2) + qb.rndm(-_rndmmagB, _rndmmagB)
				};
				if (Math.random() < _iscurvemag) {

					const midX = (start.x + end.x) * 0.5;
					const midY = (start.y + end.y) * 0.5;

					const dx = end.x - start.x;
					const dy = end.y - start.y;
					const distance = Math.hypot(dx, dy);
					const invDistance = 1 / distance;
					const perpX = -dy * invDistance;
					const perpY = dx * invDistance;

					const curveStrength = distance * (_curve + qb.rndm(-_curverndm, _curverndm));

					const controlPoint = {
						x: midX + perpX * curveStrength,
						y: midY + perpY * curveStrength
					};

					_g.beginShape();
					const steps = 7;
					for (let j = 0; j <= steps; j++) {
						const t = j / steps;
						const t1 = 1 - t;
						const t2 = t * t;
						const x = t1 * t1 * start.x + 2 * t1 * t * controlPoint.x + t2 * end.x;
						const y = t1 * t1 * start.y + 2 * t1 * t * controlPoint.y + t2 * end.y;
						_g.vertex(x, y);
					}
					_g.endShape();
				} else {
					_g.beginShape();
					_g.vertex(start.x, start.y);
					_g.vertex(end.x, end.y);

					_g.endShape();
				}
			}
		}
	}

	// 2次ベジエ曲線上の点を計算（最適化版）
	static quadraticPoint(p0, p1, p2, t) {
		let t1 = 1 - t;
		let t2 = t * t;
		let x = t1 * t1 * p0.x + 2 * t1 * t * p1.x + t2 * p2.x;
		let y = t1 * t1 * p0.y + 2 * t1 * t * p1.y + t2 * p2.y;
		return createVector(x, y);
	}

	static shiftArray(arr, shiftAmount) {
		const len = arr.length;
		// 配列の長さで割った余りを取ることで、
		// シフト量が配列の長さを超える場合も適切に処理します
		shiftAmount = ((shiftAmount % len) + len) % len;
		// 配列を2つの部分に分割し、順序を入れ替えて結合します
		return arr.slice(-shiftAmount).concat(arr.slice(0, -shiftAmount));
	}

}
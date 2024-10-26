class qline { // for p5
//v.0.1 多少頂点がずれる、とくにベジェの場合。均等にならなかったりする

	static drawline( _g, _allVertices, _futosa = 2, _rndm = 0, _stroke = true, _strokecolor="#ffffff", _fill = false, _fillcolor="#000000") {
		if (!_stroke) _g.noStroke();
		else _g.stroke(_strokecolor);
		_g.strokeWeight(_futosa);
		if (!_fill) _g.noFill();
		else _g.fill(_fillcolor);
		_g.beginShape();
		for (let v of _allVertices) {
			_g.vertex(v.x+qb.rndm(-_rndm,_rndm), v.y+qb.rndm(-_rndm,_rndm));
		}
		_g.endShape();
	}

	static drawdot( _g, _allVertices) {
		_g.fill(255, 0, 255);
		_g.noStroke();
		for (let point of _allVertices) {
			_g.circle(point.x, point.y, 7);
			
		}
	}

  

static maasugu_allvertices_dynamic(shape, totalSegments) {
    let allVertices = [];
    const totalLength = this.calculateTotalLength(shape);
    let usedSegments = 0;

    for (let i = 0; i < shape.length - 1; i++) {
        let start = shape[i];
        let end = shape[i + 1];
        let edgeLength = this.calculateDistance(start, end);
        let edgeSegments = Math.floor((edgeLength / totalLength) * totalSegments);

        if (i === shape.length - 2) {
            edgeSegments = totalSegments - usedSegments;
        } else {
            usedSegments += edgeSegments;
        }

        for (let j = 0; j < edgeSegments; j++) {
            let t = j / edgeSegments;
            let x = start.x + t * (end.x - start.x);
            let y = start.y + t * (end.y - start.y);
            allVertices.push({ x, y });
        }
    }

    // 最後の点を追加
    allVertices.push(shape[shape.length - 1]);

    return allVertices;
}
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


  

  static drawline_interp(_g, line1, line2, color, futosa, divisions = 10, bias = 0, _rndm = 0) {
    const length1 = line1.length;
    const length2 = line2.length;
    const shortLength = Math.min(length1, length2);
    const longLength = Math.max(length1, length2);

    _g.push();
    _g.stroke(color);
    _g.strokeWeight(futosa);
    _g.noFill();

    _g.beginShape(LINES);
   //  _g.beginShape(POINTS);

    for (let d = 0; d <= divisions; d++) {
      let t = d / divisions;
      
      // バイアスの適用
      if (bias !== 0) {
        const k = Math.exp(bias);
        t = (Math.pow(k, t) - 1) / (k - 1);
      }

      for (let i = 0; i < shortLength - 1; i++) {
        const index1 = this.mapIndex(i, shortLength, length1);
        const index2 = this.mapIndex(i, shortLength, length2);
        const nextIndex1 = this.mapIndex(i + 1, shortLength, length1);
        const nextIndex2 = this.mapIndex(i + 1, shortLength, length2);

        // 現在の点を補間
        const x1 = this.lerp(line1[index1].x, line2[index2].x, t);
        const y1 = this.lerp(line1[index1].y, line2[index2].y, t);
        
        // 次の点を補間
        const x2 = this.lerp(line1[nextIndex1].x, line2[nextIndex2].x, t);
        const y2 = this.lerp(line1[nextIndex1].y, line2[nextIndex2].y, t);

        // 線分を描画
        _g.vertex(x1+qb.rndm(-_rndm,_rndm), y1+qb.rndm(-_rndm,_rndm));
        _g.vertex(x2+qb.rndm(-_rndm,_rndm), y2+qb.rndm(-_rndm,_rndm));
      }
    }

    _g.endShape();
    _g.pop();
  }

  static lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  static mapIndex(index, fromLength, toLength) {
    return Math.round((index / (fromLength - 1)) * (toLength - 1));
  }  
  


static f_vertdegreeline(_g, A, angle, nagasa, color, futosa, lengthVariation = null) {
  _g.push();
  _g.stroke(color);
  _g.strokeWeight(futosa);

  const angleRad = radians(angle);
  const cosAngle = cos(angleRad);
  const sinAngle = sin(angleRad);

  _g.beginShape(LINES);
  for (let i = 0; i < A.length; i++) {
    const x = A[i].x;
    const y = A[i].y;
    
    let currentNagasa = nagasa;
    
    if (lengthVariation) {
      const [start, end] = lengthVariation;
      const normalizedPosition = i / (A.length - 1);
      let scaleFactor = 1;
      
      if (normalizedPosition < start) {
        scaleFactor = 0.01 + 0.99 * (normalizedPosition / start);
      } else if (normalizedPosition > end) {
        scaleFactor = 0.01 + 0.99 * (1 - (normalizedPosition - end) / (1 - end));
      }
      
      currentNagasa *= scaleFactor;
    }
    
    const halfLength = currentNagasa / 2;
    const x1 = x - cosAngle * halfLength;
    const y1 = y - sinAngle * halfLength;
    const x2 = x + cosAngle * halfLength;
    const y2 = y + sinAngle * halfLength;
    
    _g.vertex(x1, y1);
    _g.vertex(x2, y2);
  }
  _g.endShape();
  
  _g.pop();
}

static drawline2(_g, _allVertices, _futosa = 2, _rndm = 0, _strokecolor = "#ffffff", _axis = null, _spread = 0, _lines = 0, _spreadRange = [0, 1]) {
  _g.stroke(_strokecolor);
  _g.strokeWeight(_futosa);
  _g.noFill();

  const isYAxis = _axis && _axis.toLowerCase() === 'y';
  const spreadStep = _spread / _lines;
  const [startSpread, endSpread] = _spreadRange;

  _g.beginShape(LINES);

  // すべての線を一度に描画
  for (let i = -_lines; i <= _lines; i++) {
    const modifiedVertices = _allVertices.map((v, index) => {
      const t = index / (_allVertices.length - 1);
      let spreadFactor;
      
      if (t < startSpread) {
        spreadFactor = Math.sin((t / startSpread) * Math.PI / 2);
      } else if (t > endSpread) {
        spreadFactor = Math.cos(((t - endSpread) / (1 - endSpread)) * Math.PI / 2);
      } else {
        spreadFactor = 1;
      }

      const currentSpread = i * spreadStep * spreadFactor;
      return {
        x: isYAxis ? v.x : v.x + currentSpread,
        y: isYAxis ? v.y + currentSpread : v.y
      };
    });

    // 各線分を個別に描画
    for (let j = 0; j < modifiedVertices.length - 1; j++) {
      const v1 = modifiedVertices[j];
      const v2 = modifiedVertices[j + 1];
      _g.vertex(v1.x + qb.rndm(-_rndm, _rndm), v1.y + qb.rndm(-_rndm, _rndm));
      _g.vertex(v2.x + qb.rndm(-_rndm, _rndm), v2.y + qb.rndm(-_rndm, _rndm));
    }
  }

  _g.endShape();
}

}

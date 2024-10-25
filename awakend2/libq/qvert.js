class qvert { // for p5




  static beje_allverticesv2(shape, divisions, omomiarrayOrNull = null) {
    if (shape.length < 2 || divisions < shape.length) return shape;

    const vertices = [];
    const totalSegments = shape.length - 1;
    const pointsPerSegment = new Array(totalSegments).fill(Math.floor((divisions - 1) / totalSegments));
    let remainingPoints = (divisions - 1) % totalSegments;

    // 残りの点を均等に配分
    for (let i = 0; i < remainingPoints; i++) {
      pointsPerSegment[i % totalSegments]++;
    }

    // omomiarrayの検証
    const omomiarrayToUse = Array.isArray(omomiarrayOrNull) && omomiarrayOrNull.length === totalSegments
      ? omomiarrayOrNull
      : new Array(totalSegments).fill(0);

    for (let i = 0; i < totalSegments; i++) {
      const start = shape[i];
      const end = shape[i + 1];
      const segmentPoints = pointsPerSegment[i];
      const omomiValue = omomiarrayToUse[i];

      for (let j = 0; j <= segmentPoints; j++) {
        if (i > 0 && j === 0) continue; // 最初のセグメント以外の始点をスキップ
        
        let t = j / segmentPoints;
        if (omomiValue !== 0) {
          // Math.abs()とMath.sign()の呼び出しを1回に統合
          const exp = omomiValue > 0 ? omomiValue : -omomiValue;
          // 三項演算子を使用して条件分岐を減らす
          t *= 1 + (omomiValue > 0 ? exp * (1 - t) : -exp * (1 - t));
        }

        vertices.push(this.calculateCubicBezierPoint(start, end, t));
      }
    }

    return vertices;
  }



	static beje_allvertices(shape, targetDistance) {
		if (shape.length < 2 || targetDistance <= 0) return shape;

		const vertices = [shape[0]];  // Start with the first point
		const lastIndex = shape.length - 1;

		for (let i = 0; i < lastIndex; i++) {
			const start = shape[i];
			const end = shape[i + 1];
			let currentPoint = start;
			let t = 0;

			while (t < 1) {
				let nextT = Math.min(1, t + 0.04);  // Ensure nextT doesn't exceed 1
				let nextPoint = this.calculateCubicBezierPoint(start, end, nextT);
				let distance = this.calculateDistance(currentPoint, nextPoint);

				if (distance >= targetDistance) {
					const adjustFactor = targetDistance / distance;
					nextT = t + (nextT - t) * adjustFactor;
					nextPoint = this.calculateCubicBezierPoint(start, end, nextT);
					vertices.push(nextPoint);
					currentPoint = nextPoint;
					t = nextT;
				} else {
					t = nextT;
				}
			}
		}
		// Add the last point if it's far enough from the previous point
		const lastPoint = shape[lastIndex];
		const lastVertex = vertices[vertices.length - 1];
		if (this.calculateDistance(lastVertex, lastPoint) > targetDistance / 2) {
			vertices.push(lastPoint);
		}

		return vertices;
	}

	static calculateCubicBezierPoint(start, end, t) {
		const t1 = 1 - t;
		const t13 = t1 * t1 * t1;
		const t12 = 3 * t * t1 * t1;
		const t2 = 3 * t * t * t1;
		const t3 = t * t * t;

		const x = t13 * start.x + t12 * (start.x + start.ctr2x) + t2 * (end.x + end.ctr1x) + t3 * end.x;
		const y = t13 * start.y + t12 * (start.y + start.ctr2y) + t2 * (end.y + end.ctr1y) + t3 * end.y;

		return { x, y };
	}


	static drawControlPoints(_g, _shape) {
		_g.push(); // 現在の描画設定を保存
		_g.noStroke();

		for (let i = 0; i < _shape.length; i++) {
			let point = _shape[i];

			// アンカーポイント
			_g.fill(255, 255, 255);
			_g.circle(point.x, point.y, 15);

			// 制御点1
			_g.fill(255, 0, 0);
			_g.circle(point.x + point.ctr1x, point.y + point.ctr1y, 15);

			// 制御点2
			_g.fill(0, 0, 255);
			_g.circle(point.x + point.ctr2x, point.y + point.ctr2y, 15);

			// 制御線
			_g.strokeWeight(2);

			// 制御点1への線
			_g.stroke(255, 0, 0);
			_g.line(point.x, point.y, point.x + point.ctr1x, point.y + point.ctr1y);

			// 制御点2への線（最後の点以外）
			if (i < _shape.length - 1) {
				_g.stroke(0, 0, 255);
				_g.line(point.x, point.y, point.x + point.ctr2x, point.y + point.ctr2y);
			}
		}

		_g.pop(); // 描画設定を元に戻す
	}



static shiftScaleXY(objects, scaleX, scaleY, rotation, shiftX, shiftY) {
    const rad = rotation * Math.PI / 180; // 度数法からラジアンに変換
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return objects.map(obj => {
        // 1. スケーリング
        const scaledX = obj.x * scaleX;
        const scaledY = obj.y * scaleY;

        // 2. 回転
        const rotatedX = scaledX * cos - scaledY * sin;
        const rotatedY = scaledX * sin + scaledY * cos;

        // 3. 平行移動
        return {
            ...obj,
            x: rotatedX + shiftX,
            y: rotatedY + shiftY
        };
    });
}

	static calculateDistance(point1, point2) {
		const dx = point2.x - point1.x;
		const dy = point2.y - point1.y;
		return Math.hypot(dx, dy);
	}

	static calculateTotalLength(shape) {
		let totalLength = 0;
		for (let i = 0; i < shape.length - 1; i++) {
			totalLength += this.calculateDistance(shape[i], shape[i + 1]);
		}
		return totalLength;
	}
}
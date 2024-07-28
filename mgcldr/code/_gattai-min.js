/*
This file contains functions for drawing 2d primitives with a handy sketchy look in p5.js.

Author: Janneck Wullschleger in 07/2016
Web: http://itsjw.de
Mail: jw@itsjw.de

Updated: 24.02.2017 to use with a reference to the p5 instance.
Just put it in as param to the constructor.

Much of the source code is taken from the handy library for processing,
written by Jo Wood, giCentre, City University London based on an idea by Nikolaus Gradwohl.
The handy library is licensed under the GNU Lesser General Public License: http://www.gnu.org/licenses/.
*/

function Scribble(p) {
  this.sketch = p || window;
  this.bowing = 1;
  this.roughness = 1;
  this.maxOffset = 2;
  this.numEllipseSteps = 9;
  this.ellipseInc = (Math.PI*2)/this.numEllipseSteps;

  this.getOffset = function( minVal, maxVal ) {
    return this.roughness*(this.sketch.random()*(maxVal-minVal)+minVal);
  }

  this.buildEllipse = function( cx, cy, rx, ry, offset, overlap ) {
    var radialOffset = this.getOffset( -0.5, 0.5 )-Math.PI/2;

    this.sketch.beginShape();
    this.sketch.curveVertex( this.getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset-this.ellipseInc ),
        this.getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset-this.ellipseInc ) );

    for ( var theta = radialOffset; theta < Math.PI*2+radialOffset-0.01; theta+=this.ellipseInc ) {
      this.sketch.curveVertex( this.getOffset( -offset, offset )+cx+rx*Math.cos( theta ),
          this.getOffset( -offset, offset )+cy+ry*Math.sin( theta ) );
    }

    this.sketch.curveVertex( this.getOffset( -offset, offset )+cx+rx*Math.cos( radialOffset+Math.PI*2+overlap*0.5 ),
        this.getOffset( -offset, offset )+cy+ry*Math.sin( radialOffset+Math.PI*2+overlap*0.5 ) );

    this.sketch.curveVertex( this.getOffset( -offset, offset )+cx+0.98*rx*Math.cos( radialOffset+overlap ),
        this.getOffset( -offset, offset )+cy+0.98*ry*Math.sin( radialOffset+overlap ) );

    this.sketch.curveVertex( this.getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset+overlap*0.5 ),
        this.getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset+overlap*0.5 ) );
    this.sketch.endShape();
  }

  this.getIntersectingLines = function( lineCoords, xCoords, yCoords ) {
    var intersections = [];
    var s1 = new Segment( lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3] );

    for ( var i = 0; i < xCoords.length; i++ ) {
      var s2 = new Segment( xCoords[i], yCoords[i], xCoords[(i+1)%xCoords.length], yCoords[(i+1)%xCoords.length] );

      if ( s1.compare(s2) == Relation.INTERSECTS ) {
        intersections.push( [s1.getIntersectionX(), s1.getIntersectionY()] );
      }
    }
    return intersections;
  }

  this.scribbleLine = function( x1, y1, x2, y2 ) {
    var lenSq = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
    var offset = this.maxOffset;

    if ( this.maxOffset*this.maxOffset*100 > lenSq ) {
      offset = Math.sqrt( lenSq )/10;
    }

    var halfOffset = offset/2;
    var divergePoint = 0.2 + this.sketch.random()*0.2;
    var midDispX = this.bowing*this.maxOffset*(y2-y1)/200;
    var midDispY = this.bowing*this.maxOffset*(x1-x2)/200;
    midDispX = this.getOffset( -midDispX, midDispX );
    midDispY = this.getOffset( -midDispY, midDispY );

    this.sketch.noFill();

    this.sketch.beginShape();
    this.sketch.vertex(     x1 + this.getOffset( -offset, offset ), y1 + this.getOffset( -offset, offset ) );
    this.sketch.curveVertex(x1 + this.getOffset( -offset, offset ), y1 + this.getOffset( -offset, offset ) );
    this.sketch.curveVertex(midDispX+x1+(x2 -x1)*divergePoint + this.getOffset( -offset, offset ), midDispY+y1 + (y2-y1)*divergePoint + this.getOffset( -offset, offset ) );
    this.sketch.curveVertex(midDispX+x1+2*(x2-x1)*divergePoint + this.getOffset( -offset, offset ), midDispY+y1+ 2*(y2-y1)*divergePoint + this.getOffset( -offset,offset ) );
    this.sketch.curveVertex(x2 + this.getOffset( -offset, offset ), y2 + this.getOffset( -offset, offset ) );
    this.sketch.vertex(     x2 + this.getOffset( -offset, offset ), y2 + this.getOffset( -offset, offset ) );
    this.sketch.endShape();

    // this.sketch.beginShape();
    // this.sketch.vertex(     x1 + this.getOffset( -halfOffset, halfOffset ), y1 + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.curveVertex(x1 + this.getOffset( -halfOffset, halfOffset ), y1 + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.curveVertex(midDispX+x1+(x2 -x1)*divergePoint + this.getOffset( -halfOffset, halfOffset ), midDispY+y1 + (y2-y1)*divergePoint + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.curveVertex(midDispX+x1+2*(x2-x1)*divergePoint + this.getOffset( -halfOffset, halfOffset ), midDispY+y1+ 2*(y2-y1)*divergePoint + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.curveVertex(x2 + this.getOffset( -halfOffset, halfOffset ), y2 + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.vertex(     x2 + this.getOffset( -halfOffset, halfOffset ), y2 + this.getOffset( -halfOffset, halfOffset ) );
    // this.sketch.endShape();
  }

  this.scribbleCurve = function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    this.sketch.bezier(  x1+this.getOffset( -2, 2 ), y1+this.getOffset( -2, 2 ),
             x3+this.getOffset( -4, 4 ), y3+this.getOffset( -3, 3 ),
             x4+this.getOffset( -3, 3 ), y4+this.getOffset( -3, 3 ),
             x2+this.getOffset( -1, 1 ), y2+this.getOffset( -1, 1 ) );

    this.sketch.bezier(  x1+this.getOffset( -2, 2 ), y1+this.getOffset( -2, 2 ),
             x3+this.getOffset( -3, 3 ), y3+this.getOffset( -3, 3 ),
             x4+this.getOffset( -3, 3 ), y4+this.getOffset( -4, 4 ),
             x2+this.getOffset( -2, 2 ), y2+this.getOffset( -2, 2 ) );
  }

  this.scribbleRect = function( x, y, w, h ) {
    var halfWidth = w/2;
    var halfHeight = h/2;
    var left   = Math.min( x-halfWidth, x+halfWidth );
    var right  = Math.max( x-halfWidth, x+halfWidth );
    var top    = Math.min( y-halfHeight, y+halfHeight );
    var bottom = Math.max( y-halfHeight, y+halfHeight );

      this.scribbleLine( left, top, right, top );
      this.scribbleLine( right, top, right, bottom );
      this.scribbleLine( right, bottom, left, bottom );
      this.scribbleLine( left, bottom, left, top );
  }

  this.scribbleRoundedRect = function( x, y, w, h, radius ) {
    var halfWidth = w/2;
    var halfHeight = h/2;

    if ( radius == 0 || radius > halfWidth || radius > halfHeight ) {
      this.scribbleRect( x, y, w, h );
      return;
    }

    var left   = Math.min( x-halfWidth, x+halfWidth );
    var right  = Math.max( x-halfWidth, x+halfWidth );
    var top    = Math.min( y-halfHeight, y+halfHeight );
    var bottom = Math.max( y-halfHeight, y+halfHeight );

    this.scribbleLine( left+radius, top, right-radius, top, 1.5 );
    this.scribbleLine( right, top+radius, right, bottom-radius, 1.5 );
    this.scribbleLine( right-radius, bottom, left+radius, bottom, 1.5 );
    this.scribbleLine( left, bottom-radius, left, top+radius, 1.5 );

    this.scribbleCurve( left+radius, top, left, top+radius, left+radius*0.1, top+radius*0.1, left+radius*0.1, top+radius*0.1 );
    this.scribbleCurve( right-radius, top, right, top+radius, right-radius*0.1, top+radius*0.1, right-radius*0.1, top+radius*0.1 );
    this.scribbleCurve( left+radius, bottom, left, bottom-radius, left+radius*0.1, bottom-radius*0.1, left+radius*0.1, bottom-radius*0.1 );
    this.scribbleCurve( right-radius, bottom, right, bottom-radius, right-radius*0.1, bottom-radius*0.1, right-radius*0.1, bottom-radius*0.1 );
  }

  this.scribbleEllipse = function( x, y, w, h ) {
    var rx = Math.abs(w/2);
    var ry = Math.abs(h/2);

    rx += this.getOffset( -rx*0.05, rx*0.05 );
    ry += this.getOffset( -ry*0.05, ry*0.05 );

    this.buildEllipse( x, y, rx, ry, 1, this.ellipseInc*this.getOffset( 0.1, this.getOffset( 0.4, 1 ) ) );
    this.buildEllipse( x, y, rx, ry, 1.5, 0 );
  }

  this.scribbleFilling = function( xCoords, yCoords, gap, angle ) {
    if ((xCoords == null) || (yCoords == null) || (xCoords.length == 0) || (yCoords.length == 0)) {
        return;
      }

    var hachureAngle = this.sketch.radians( angle%180 );
    var cosAngle = Math.cos( hachureAngle );
    var sinAngle = Math.sin( hachureAngle );
    var tanAngle = Math.tan( hachureAngle );

    var left   = xCoords[0];
    var right  = xCoords[0];
    var top    = yCoords[0];
    var bottom = yCoords[0];

    for ( var i = 1; i < xCoords.length; i++ ) {
      left   = Math.min( left, xCoords[i] );
      right  = Math.max( right, xCoords[i] );
      top    = Math.min( top, yCoords[i] );
      bottom = Math.max( bottom, yCoords[i] );
    }

    var it = new HachureIterator( top-1, bottom+1, left-1, right+1, gap, sinAngle, cosAngle, tanAngle );
    var rectCoords = null;

    while ( (rectCoords = it.getNextLine()) != null ) {
      var lines = this.getIntersectingLines( rectCoords, xCoords, yCoords );

      for ( var i = 0; i < lines.length; i+=2 ) {
        if ( i < lines.length-1 ) {
          var p1 = lines[i];
          var p2 = lines[i+1];
          
          this.scribbleLine( p1[0], p1[1], p2[0], p2[1], 2 );
        }
      }
    }
  }
  this.scribbleFilling2 = function( xCoords, yCoords, gap, angle ) {
    if ((xCoords == null) || (yCoords == null) || (xCoords.length == 0) || (yCoords.length == 0)) {
        return;
      }

    var hachureAngle = this.sketch.radians( angle%180 );
    var cosAngle = Math.cos( hachureAngle );
    var sinAngle = Math.sin( hachureAngle );
    var tanAngle = Math.tan( hachureAngle );

    var left   = xCoords[0];
    var right  = xCoords[0];
    var top    = yCoords[0];
    var bottom = yCoords[0];

    for ( var i = 1; i < xCoords.length; i++ ) {
      left   = Math.min( left, xCoords[i] );
      right  = Math.max( right, xCoords[i] );
      top    = Math.min( top, yCoords[i] );
      bottom = Math.max( bottom, yCoords[i] );
    }

    var it = new HachureIterator( top-1, bottom+1, left-1, right+1, gap, sinAngle, cosAngle, tanAngle );
    var rectCoords = null;
    let aaa = 0;
    let bbb = 0;
    while ( (rectCoords = it.getNextLine()) != null ) {
      aaa += 1;
      if (bbb <= 0) bbb = Math.round((aaa*aaa*aaa)/2000);
      else bbb += -1;
      
      if (bbb<=0) {
      var lines = this.getIntersectingLines( rectCoords, xCoords, yCoords );

      for ( var i = 0; i < lines.length; i+=2 ) {
        if ( i < lines.length-1 ) {
          var p1 = lines[i];
          var p2 = lines[i+1];
          
          // let testttt = 400-p2[1];
          let drowok = true;

          if(drowok) this.scribbleLine( p1[0], p1[1], p2[0], p2[1], 2 );
          // if(Math.random()<(400-p2[1])/300) this.scribbleLine( p1[0], p1[1], p2[0], p2[1], 2 );
        }
      }
      }
    }
  }

}



function HachureIterator( _top, _bottom, _left, _right, _gap, _sinAngle, _cosAngle, _tanAngle ) {
  var sinAngle = _sinAngle;
  var tanAngle = _tanAngle;
  var top = _top;
  var bottom = _bottom;
  var left = _left;
  var right = _right;
  var gap = _gap;

  var pos;
  var deltaX, hGap;
  var sLeft, sRight;

  if (Math.abs(sinAngle) < 0.0001)  {
    pos = left+gap;
  } else if (Math.abs(sinAngle) > 0.9999) {
    pos = top+gap;
  } else {
    deltaX = (bottom-top)*Math.abs(tanAngle);
    pos = left-Math.abs(deltaX);
    hGap = Math.abs(gap / _cosAngle);
    sLeft = new Segment(left, bottom, left, top);
    sRight = new Segment(right, bottom, right, top);
  }

  this.getNextLine = function() {
  	if (Math.abs(sinAngle) < 0.0001) {
  		if (pos < right) {
  			var line = [pos, top, pos, bottom];
  			pos += gap;
  			return line;
  		}
  	}	else if (Math.abs(sinAngle) > 0.9999) {
  		if (pos<bottom)	{
  			var line = [left, pos, right, pos];
  			pos += gap;
  			return line;
  		}
  	}	else {
  		var xLower = pos-deltaX/2;
  		var xUpper = pos+deltaX/2;
  		var yLower = bottom;
  		var yUpper = top;

  		if (pos < right+deltaX)	{
  			while (((xLower < left) && (xUpper < left)) || ((xLower > right) && (xUpper > right)))	{
  				pos += hGap;
  				xLower = pos-deltaX/2;
  				xUpper = pos+deltaX/2;

  				if (pos > right+deltaX)	{
  					return null;
  				}
  			}

  			var s = new Segment(xLower, yLower, xUpper, yUpper);

  			if (s.compare(sLeft) == Relation.INTERSECTS) {
  				xLower = s.getIntersectionX();
  				yLower = s.getIntersectionY();
  			}
  			if (s.compare(sRight) == Relation.INTERSECTS)	{
  				xUpper = s.getIntersectionX();
  				yUpper = s.getIntersectionY();
  			}
  			if (tanAngle > 0)	{
  				xLower = right-(xLower-left);
  				xUpper = right-(xUpper-left);
  			}

  			var line = [xLower, yLower, xUpper, yUpper];
  			pos += hGap;
  			return line;
  		}
  	}
  	return null;
  }
}

function Segment( _x1, _y1, _x2, _y2 ) {
  var x1 = _x1;
  var y1 =_y1;
  var x2 = _x2;
  var y2 = _y2;
  var a, b, c;
  var undef;
  var xi = Number.MAX_VALUE;
  var yi = Number.MAX_VALUE;

  a=y2-y1;
  b=x1-x2;
  c=x2*y1-x1*y2;

  if ((a==0) && (b==0) && (c==0)) {
    undef = true;
  } else {
    undef = false;
  }

  this.compare = function( otherSegment ) {
    if ((this.isUndefined()) || (otherSegment.isUndefined())) {
      return Relation.UNDEFINED;
    }

    var grad1 = Number.MAX_VALUE;
    var grad2 = Number.MAX_VALUE;
    var int1 = 0;
    var int2 = 0;

    if (Math.abs(b) > 0.00001) {
      grad1 = -a/b;
      int1  = -c/b;
    }

    if (Math.abs(otherSegment.getB()) > 0.00001) {
      grad2 = -otherSegment.getA()/otherSegment.getB();
      int2  = -otherSegment.getC()/otherSegment.getB();
    }

    if (grad1 == Number.MAX_VALUE) {
      if (grad2 == Number.MAX_VALUE)  {
        if (-c/a != -otherSegment.getC()/otherSegment.getA()) {
          return Relation.SEPARATE;
        }

        if ((y1 >= Math.min(otherSegment.getPy1(),otherSegment.getPy2())) &&
            (y1 <= Math.max(otherSegment.getPy1(),otherSegment.getPy2()))) {
          xi = x1;
          yi = y1;
          return Relation.INTERSECTS;
        }

        if ((y2 >= Math.min(otherSegment.getPy1(),otherSegment.getPy2())) &&
            (y2 <= Math.max(otherSegment.getPy1(),otherSegment.getPy2()))) {
          xi = x2;
          yi = y2;
          return Relation.INTERSECTS;
        }

        return Relation.SEPARATE;
      }

      xi = x1;
      yi = grad2*xi+int2;

      if (((y1-yi)*(yi-y2) < -0.00001) || ((otherSegment.getPy1()-yi)*(yi-otherSegment.getPy2()) < -0.00001)) {
        return Relation.SEPARATE;
      }

      if (Math.abs(otherSegment.getA()) < 0.00001) {
        if ((otherSegment.getPx1()-xi)*(xi-otherSegment.getPx2()) < -0.00001) {
          return Relation.SEPARATE;
        }
        return Relation.INTERSECTS;
      }
      return Relation.INTERSECTS;
    }

    if (grad2 == Number.MAX_VALUE) {
      xi = otherSegment.getPx1();
      yi = grad1*xi+int1;

      if (((otherSegment.getPy1()-yi)*(yi-otherSegment.getPy2()) < -0.00001) || ((y1-yi)*(yi-y2) < -0.00001)) {
        return Relation.SEPARATE;
      }

      if (Math.abs(a) < 0.00001) {
        if ((x1-xi)*(xi-x2) < -0.00001) {
          return Relation.SEPARATE;
        }
        return Relation.INTERSECTS;
      }
      return Relation.INTERSECTS;
    }

    if (grad1 == grad2) {
      if (int1 != int2) {
        return Relation.SEPARATE;
      }

      if ((x1 >= Math.min(otherSegment.getPx1(),otherSegment.getPx2())) &&
        (x1 <= Math.max(otherSegment.getPy1(),otherSegment.getPy2()))) {
        xi = x1;
        yi = y1;
        return Relation.INTERSECTS;
      }

      if ((x2 >= Math.min(otherSegment.getPx1(),otherSegment.getPx2())) &&
        (x2 <= Math.max(otherSegment.getPx1(),otherSegment.getPx2()))) {
        xi = x2;
        yi = y2;
        return Relation.INTERSECTS;
      }

      return Relation.SEPARATE;
    }

    xi = (int2-int1)/(grad1-grad2);
    yi = grad1*xi + int1;

    if (((x1-xi)*(xi-x2) < -0.00001) || ((otherSegment.getPx1()-xi)*(xi-otherSegment.getPx2()) < -0.00001)) {
      return Relation.SEPARATE;
    }
    return Relation.INTERSECTS;
  }

  this.getPx1 = function() {
  	return x1;
  }

  this.getPy1 = function()	{
  	return y1;
  }

  this.getPx2 = function() {
  	return x2;
  }

  this.getPy2 = function() {
  	return y2;
  }

  this.isUndefined = function() {
  	return undef;
  }

  this.getA = function() {
  	return a;
  }

  this.getB = function() {
  	return b;
  }

  this.getC = function() {
  	return c;
  }

  this.getIntersectionX = function() {
  	return xi;
  }

  this.getIntersectionY = function() {
  	return yi;
  }

  this.getLength = function( tx1, ty1, tx2, ty2 ) {
    var dx = tx2 - tx1;
    var dy = ty2 - ty1;
  	return Math.sqrt(dx*dx + dy*dy);
  }

}

var Relation = { LEFT:1, RIGHT:2, INTERSECTS:3, AHEAD:4, BEHIND:5, SEPARATE:6, UNDEFINED:7 };


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





let vvvsss = `
	precision highp float;
	precision highp int;
	attribute vec3 aPosition;
	attribute vec2 aTexCoord;
	varying vec2 vTexCoord;
	uniform mat4 uProjectionMatrix;
	uniform mat4 uModelViewMatrix;
	void main() {
		vec4 positionVec4 = vec4(aPosition, 1.0);
		gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
		vTexCoord = aTexCoord;
	}
`;



let vvvfff = `
	precision highp float;
	precision highp int;

	varying vec2 vTexCoord;

	uniform sampler2D u_tex;
	uniform float time;
	uniform float radius;
	uniform float noisetuyosa;
	float pi = 3.14159265358979;

	float rand(vec2 co) {
		float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
		float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
		float t = fract(s * 43758.5453);
		return t;
	}
	vec3 brightnessContrast(vec3 value, float brightness, float contrast) {
		return (value - 0.5) * contrast + 0.5 + brightness;
	}
	vec3 Gamma(vec3 value, float param) {
		return vec3(pow(abs(value.r), param),pow(abs(value.g), param),pow(abs(value.b), param));
	}

	void main() {
		vec2 uvnoise = vTexCoord;
		float n1 = rand((uvnoise * time) * 10.0);
		float n2 = rand((uvnoise * (time*.66)) * 10.0);
		float n3 = rand((uvnoise * (time*.33)) * 10.0);
		vec3 eff1 = Gamma(vec3(n1,n2,n3), 36.6);
		vec4 noisetex = vec4(eff1, 1.0);

		vec2 uv = vTexCoord;

		uv.x = uv.x + rand(uv*time)*radius;
		uv.y = uv.y + rand(uv*time)*radius;
		
		vec4 tex = texture2D(u_tex, uv) + (noisetex*noisetuyosa);

		gl_FragColor = vec4( brightnessContrast( tex.rgb , 0.0, 1.2), 1.0);
	}
`;



nyu = {}
function nyu_setup() {
	nyu.now_oa = 0;
	nyu.now_ob = 0;
	nyu.now_og = 0;
	nyu.now_mx = 0;
	nyu.now_my = 0;
	nyu.now_mz = 0;
	nyu.now_hx = 0;
	nyu.now_hy = 0;
	nyu.now_edhy = 0;

	nyu.now_tx = 0;
	nyu.now_ty = 0;
	nyu.bef_tx = 0;
	nyu.bef_ty = 0;
	nyu.diff_tx = 0;
	nyu.diff_ty = 0;
	nyu.sta_tx = 0;
	nyu.sta_ty = 0;
	nyu.end_tx = 0;
	nyu.end_ty = 0;
	nyu.tdir4 = 0;

	nyu.puramai = 1;
	nyu.door_mspd = 0;
	nyu.is_door_open = false;	
	nyu.door_mspd_amari = 0;
	nyu.door_mspd_amari2 = 0;
}


function nyu_ef() {
	nyu_kihon();

	if (is_press) {
		nyu.tdir4 = (nyu.bef_ty < nyu.now_ty) ? true : false;
		nyu.door_mspd = nyu.diff_ty;
	}

	nyu.door_mspd *= 0.98;
	let _door_mspd_edit = nyu.door_mspd / 355 * nyu.puramai;
	// // openclosev = qb.mTriangle(tm)/2+.5;
	door_openclose_v += _door_mspd_edit;

	if (door_openclose_v<0) {
		door_openclose_v = 0;
		nyu.puramai = 1;
		nyu.door_mspd_amari = Math.abs(nyu.door_mspd/3);
		nyu.door_mspd_amari2 = Math.abs(nyu.door_mspd*5.33);
		nyu.door_mspd = 0;
	}
	if (door_openclose_v>1) {
		door_openclose_v = 1;
		if (!is_press) {
			nyu.puramai = -1;
			nyu.door_mspd *= .6;
		}
	}
	if (is_press && nyu.tdir4 && door_openclose_v <= .3) {
		if (!nyu.is_door_open) {
			nyu.is_door_open = true;
			oto_dooropen(_door_mspd_edit)
		}
	}
	if (_door_mspd_edit <0 && door_openclose_v <= .02) {
		if (nyu.is_door_open) {
			nyu.is_door_open = false;
			oto_doorclose( _door_mspd_edit)
		}
	}
	nyu.door_mspd_amari *= .82
	nyu.door_mspd_amari2 *= .89
	if (nyu.door_mspd_amari2>18) nyu.door_mspd_amari2 = 18

}




function nyu_kihon() {
	if (is_press) {
		nyu.bef_tx = nyu.now_tx;
		nyu.bef_ty = nyu.now_ty;
		if (ososos=='pc') {
			nyu.now_tx = mouseX;
			nyu.now_ty = mouseY;
		} else {
			nyu.now_tx = touches[0].x;
			nyu.now_ty = touches[0].y;
		}
		nyu.diff_tx = nyu.now_tx - nyu.bef_tx
		nyu.diff_ty = nyu.now_ty - nyu.bef_ty
	}
	if (ososos=='pc') {

		let _dist = Math.hypot(mouseX - nyu.now_hx, mouseY - nyu.now_hy);
		if (_dist > 200) {
			nyu.now_hx += (mouseX - nyu.now_hx) / 15
			nyu.now_hy += (mouseY - nyu.now_hy) / 15
		}
		nyu.now_edhy = mouseY - nyu.now_hy;
		if (nyu.now_edhy > 200) nyu.now_edhy = 200; 
		else if (nyu.now_edhy < -200) nyu.now_edhy = -200; 
		// nyu.now_hx = mouseX;
		// nyu.now_hy = mouseY;
	}
}

function mousePressed() {
	if (ososos=='pc') {
		f_usertouchstart();
		nyu.now_tx = nyu.sta_tx = mouseX;
		nyu.now_ty = nyu.sta_ty = mouseY;
		nyu.puramai = 1;
		is_press = true;
	}	
}

function mouseReleased() {
	if (ososos == 'pc') {
		is_press = false;
	}
}

function touchStarted() {　
	if (ososos != 'pc') { 
		if (!is_user_started) f_usertouchstart();	
		nyu.now_tx = nyu.sta_tx =  touches[0].x;
		nyu.now_ty = nyu.sta_ty = touches[0].y;
		nyu.puramai = 1;
		is_press = true;
	}
}
function touchEnded(){
	if (ososos != 'pc') {
		is_press = false;
	}
}



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
	scrbl.roughness = 6+door_openclose_v*1+ nyu.door_mspd_amari/12;
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




oto = {}
function oto_setup() {
	au_music.volume = 0;
	au_music.play(0.1, Math.round(qb.rndmmm(0,30)) );
	oto.reverb = new Pizzicato.Effects.Reverb({
	time: 5.75,
	decay: 4.0,
	reverse: false,
	mix: .28
	});
	
	au_musicgroup.addEffect(oto.reverb);
	
	oto.kisimi = 0;
	oto.kisimi_tgt = 0;
	oto.kisimi_mul = 1;
	oto.kisimi_multgt = 1;

}

let volumemag = 0;
function oto_ef() {
	if (volumemag<1) volumemag+=0.01;
	else volumemag = 1;
	if (is_sound) Pizzicato.volume = 1*volumemag;
	else Pizzicato.volume = 0;
	let _amp = qb.mppng(door_openclose_v,   0, .25,  0, 1, 0);
	au_music.volume= _amp;

	if (Math.random() < .057) oto.kisimi_tgt = qb.rndmmm(.4,.8);
	if (Math.random() < .07) oto.kisimi_tgt = 0;
	oto.kisimi += (oto.kisimi_tgt - oto.kisimi) / 5;

	if (Math.abs(nyu.door_mspd) < 1) oto.kisimi_multgt = 0
	else oto.kisimi_multgt = 1
	oto.kisimi_mul += (oto.kisimi_multgt - oto.kisimi_mul) / 1.5
	let _audoorv = oto.kisimi*oto.kisimi_mul;
	if (_audoorv>1) _audoorv = 1
	au_door1.volume = _audoorv;
	au_door2.volume = _audoorv;
}

function oto_dooropen(_tuyosa) {
	let _tuyosa_ed = Math.abs(_tuyosa)

	au_dooropen.stop()
	let _vvv = .1+_tuyosa_ed*(qb.rndmmm(7,9))
	if (_vvv>1)_vvv = 1;
	au_dooropen.volume = _vvv;
	au_dooropen.play()
	au_dooropen.sourceNode.playbackRate.value = qb.rndmmm(.91,1.06);
	
	if (Math.random()<.5) {
		au_door1.play(0, qb.rndmmm(0,1))
	} else {
		au_door2.play(.15, qb.rndmmm(0,3))
	}
	zawazawa_mul_tgt = 1;
}

function oto_doorclose(_tuyosa) {
	let _tuyosa_ed = Math.abs(_tuyosa)
	let _rnd1 = qb.rndmmm(.2, .35)
	let _rnd2 = qb.rndmmm(0,  .1)
	let _ontei =qb.rndmmm(.9, 1.1)
	if (_tuyosa_ed < 0.01) {
		au_doorclose_light.stop();
		au_doorclose_light.play();
		au_doorclose_light.sourceNode.playbackRate.value = qb.rndmmm(1,1.1);
		let _light = .1+_tuyosa_ed*10
		if (_light>1)_light=1
		au_doorclose_light.volume = _light;
		zawazawa_mul_tgt = zawazawa_mul = .4;
	} else {
		let _v1 = qb.mppng(_tuyosa_ed,0, .35,    _rnd1, 1, .7)
		let _v2 = qb.mppng(_tuyosa_ed,0, .35,    _rnd2, 1.2, .9)
		if (_v1>1)_v1 = 1
		if (_v2>1)_v2 = 1
		if (_tuyosa_ed > .35) {
			
			au_doorclose.stop();
			au_doorclose_strong.stop();
			au_doorclose.play(0, .1)
			au_doorclose.sourceNode.playbackRate.value = _ontei;
			au_doorclose.volume = _v1;
			au_doorclose_strong.play(0, .1)
			au_doorclose_strong.sourceNode.playbackRate.value = _ontei;
			au_doorclose_strong.volume = _v2;
		} else {
			au_doorclose.stop();
			au_doorclose_strong.stop();
			au_doorclose.play(0,0);
			au_doorclose.volume = _v1;
			au_doorclose.sourceNode.playbackRate.value  = _ontei;
			au_doorclose_strong.play(0,0);
			au_doorclose_strong.volume = _v2;
			au_doorclose_strong.sourceNode.playbackRate.value  = _ontei;
		}
	}
	au_music.volume = 0;
}




class DoorSet {
	constructor() {
		// this.myw = 200*zoomtype[0]*   .9;
		// this.myh = 410*zoomtype[1]*   .9;

		// if (ososos=="pc") {
		this.myw = 200*zoomtype[0]*   1;
		this.myh = 410*zoomtype[1]*   1;

		// }
		this.pos7 = [0,0];
		this.pos9 = [this.myw, 0];
		this.pos3 = [this.myw, this.myh];
		this.pos1 = [0, this.myh];

		this.hole_p7 = [this.pos7[0],this.pos7[1]];
		this.hole_p9 = [this.pos9[0],this.pos9[1]];
		this.hole_p3 = [this.pos3[0],this.pos3[1]];
		this.hole_p1 = [this.pos1[0],this.pos1[1]];

		this.door_p7 = [this.pos7[0],this.pos7[1]];
		this.door_p9 = [this.pos9[0],this.pos9[1]];
		this.door_p3 = [this.pos3[0],this.pos3[1]];
		this.door_p1 = [this.pos1[0],this.pos1[1]];

		this.nob_p7 = [175, this.myh/2];
		this.nob_p9 = [170,this.myh/2];
		this.nob_p3 = [170,this.myh/2+10];
		this.nob_p1 = [175,this.myh/2+10];

		this.akari_p7 = [this.pos7[0], this.pos7[1]+this.myh];
		this.akari_p9 = [this.pos9[0], this.pos9[1]+this.myh];
		this.akari_p3 = [this.pos3[0], this.pos3[1]+this.myh];
		this.akari_p1 = [this.pos1[0], this.pos1[1]+this.myh];

		this.arr_door_px = []
		this.arr_door_py = []
		this.arr_nob_px = []
		this.arr_nob_py = []
		this.arr_hole_px = []
		this.arr_hole_py = []
		this.arr_akari_px = []
		this.arr_akari_py = []

		this.mypx = 0;
		this.mypy = 0;

	}

	f_mypos(_x,_y) {
		this.mypx = _x; 
		this.mypy = _y;
	}


	f_ef() {
		let _centery = -100 + 0//-nyu.now_edhy/4;
		let _hishagex1 = 0//nyu.now_edhy/5;
		let _testymppx = qb.mppng(door_openclose_v,   0,1,  this.myw, -this.myw, 0);
		let _testymppy = qb.mppng_cu(door_openclose_v,  0,0.5,1,   0,-110,0,   2);

		

		let _akarimppx1 = 10;
		let _akarimppx2 = 0;
		if (door_openclose_v < .5) {
			_akarimppx1 = qb.mppng(door_openclose_v,   0, .5,  this.myw,  10, -.85);
			_akarimppx2 = qb.mppng(door_openclose_v,   0, .5,  this.myw+366, 0, 0);
		} else if (door_openclose_v <= .74) {
			_akarimppx2 = qb.mppng(door_openclose_v,   .5, .74,  0, -366, 0);
		} else {
			_akarimppx2 = -366;
		}
	
		let _nobx1 = qb.mppng_cu(door_openclose_v,  0,.5,1,   0,-15, 50,   .5);

		this.arr_hole_px = [ 
			this.mypx+this.hole_p7[0] + _hishagex1, 
			this.mypx+this.hole_p9[0] + -_hishagex1+nyu.door_mspd_amari2*1.2, 
			this.mypx+this.hole_p3[0] + _hishagex1+nyu.door_mspd_amari2*1.2, 
			this.mypx+this.hole_p1[0] + -_hishagex1
			];
		this.arr_hole_py = [ 
			this.mypy+this.hole_p7[1]+ _centery, 
			this.mypy+this.hole_p9[1]+ _centery, 
			this.mypy+this.hole_p3[1]+ _centery, 
			this.mypy+this.hole_p1[1]+ _centery 
			];
		this.arr_door_px = [ 
			this.mypx+this.door_p7[0] + _hishagex1, 
			this.mypx+_testymppx + -_hishagex1, 
			this.mypx+_testymppx+ _hishagex1, 
			this.mypx+this.door_p1[0]  + -_hishagex1
			];
		this.arr_door_py = [ 
			this.mypy+this.door_p7[1]+ _centery, 
			this.mypy+this.door_p9[1]+　_testymppy+ _centery, 
			this.mypy+this.door_p3[1]+ -_testymppy+ _centery, 
			this.mypy+this.door_p1[1]+ _centery
			];
		this.arr_nob_px = [ 
			this.mypx+_testymppx+  _nobx1 + -25,
			this.mypx+_testymppx+  _nobx1 + -20 - _testymppy/10,
			this.mypx+_testymppx+  _nobx1 + -20 - _testymppy/10,
			this.mypx+_testymppx+  _nobx1 + -25
			];
		this.arr_nob_py = [ 
			this.mypy+this.nob_p7[1]+ _centery+　_testymppy/15.88, 
			this.mypy+this.nob_p9[1]+ _centery+　_testymppy/15.88, 
			this.mypy+this.nob_p3[1]+ _centery+　-_testymppy/15.88, 
			this.mypy+this.nob_p1[1]+ _centery+　-_testymppy/15.88
			];



		this.arr_akari_px = [ 
			this.mypx+ _akarimppx1, 
			this.mypx+this.akari_p9[0] , 
			this.mypx+this.akari_p3[0] + 366, 
			this.mypx+ _akarimppx2
			];
		this.arr_akari_py = [ 
			this.mypy+this.akari_p7[1]+ _centery, 
			this.mypy+this.akari_p9[1]+ _centery, 
			this.mypy+this.akari_p3[1]+ _centery, 
			this.mypy+this.akari_p1[1]+ _centery 
			];

	}

}

'use strict'
let cnvs_wh = 1000;
let cnvs_rectx = [  0,  1000,  1000,  0  ];
let cnvs_recty = [  0,  0,  1000,  1000  ];
// let arr_keycol = [];
// let arr_keycol = ["#d85919bc","#afff19ff","#a33390bd","#2c3137cc","#fff"];
// let arr_keycol = ["#df61a8c8", "#43fab5ff", "#051b58b1", "#dc0d04c8","#fff"]; //c1
// let arr_keycol = ["#f3c682ff", "#dafcbbff", "#e49161b1", "#034fa6c8", "#a26123ff"]; //c2
let arr_keycol = ["#43f3b0b8", "#ff0f", "#d44a34b8", "#289f81c8", "#0c2347c8"]; //c3

let zoomtype = [1.0,  1.0];
let is_user_started = false;
let is_sound = false;
let cc_user_started = 0;

let scrbl;
let reverb;
let is_press = false;
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

	// bell.stop();

	// aufiles = new Tone.ToneAudioBuffers({
	// 	dooropen: "imp/door_open.mp3",
	// 	door1: "imp/door1.mp3",
	// 	door2: "imp/door2.mp3",
	// 	doorclose: "imp/door_close.mp3",
	// 	doorclose_strong: "imp/door_close_strong.mp3",
	// 	doorclose_light: "imp/door_close_light.mp3",
	// 	music: "imp/schumann3.mp3"
	// }, () => {
	// 	oto_setup();

	// });
	// eff_noise1 = loadShader('./codetmp/eff_noise1/eff.vert', './codetmp/eff_noise1/eff.frag');
}


function setup() {

	if (ososos=="pc") pixelDensity(0.7);
	else pixelDensity(0.6);
	frameRate(27)
	textureMode(NORMAL);
	angleMode(DEGREES);
	// qb.f_irokime(arr_keycol, "c8", 5);
	// arr_keycol[1] =  "#ffff"
	// arr_keycol[1] = qb.f_cRndmHX();
	// console.log(arr_keycol);
	createCanvas(cnvs_wh, cnvs_wh);
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
function f_draw() {
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


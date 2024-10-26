#version 300 es
precision mediump float;

in vec2 vTexCoord;
uniform sampler2D uTexture;
uniform float _fade;
uniform float _blur1x;
uniform float _blur1y;
uniform float _radius;

out vec4 fragColor;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  vec4 color = texture(uTexture, uv);
  
  float radius = _radius;
  vec2 src_size = vec2(1.0 / _blur1x, 1.0 / _blur1y);
  float n = float((radius + 1.) * (radius + 1.));
  
  vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);
  vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);
  vec3 c;

  for (int j = -6; j <= 0; ++j) {
    for (int i = -6; i <= 0; ++i) {
      c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
      m0 += c;
      s0 += c * c;
    }
  }
  
  for (int j = -6; j <= 0; ++j) {
    for (int i = 0; i <= 6; ++i) {
      c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
      m1 += c;
      s1 += c * c;
    }
  }
  
  for (int j = 0; j <= 4; ++j) {
    for (int i = 0; i <= 4; ++i) {
      c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
      m2 += c;
      s2 += c * c;
    }
  }
  
  for (int j = 0; j <= 6; ++j) {
    for (int i = -6; i <= 0; ++i) {
      c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
      m3 += c;
      s3 += c * c;
    }
  }
  
  vec4 glcolor;
  float min_sigma2 = 1e+2;
  
  m0 /= n;
  s0 = abs(s0 / n - m0 * m0);
  float sigma2 = s0.r + s0.g + s0.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    glcolor = vec4(m0, 1.0);
  }
  
  m1 /= n;
  s1 = abs(s1 / n - m1 * m1);
  sigma2 = s1.r + s1.g + s1.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    glcolor = vec4(m1, 1.0);
  }

  m2 /= n;
  s2 = abs(s2 / n - m2 * m2);
  sigma2 = s2.r + s2.g + s2.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    glcolor = vec4(m2, 1.0);
  }

  m3 /= n;
  s3 = abs(s3 / n - m3 * m3);
  sigma2 = s3.r + s3.g + s3.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    glcolor = vec4(m3, 1.0);
  }

  fragColor = mix(color, glcolor, _fade);
}
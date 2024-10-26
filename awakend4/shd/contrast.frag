#version 300 es
precision mediump float;

uniform sampler2D tex0;

in vec2 vTexCoord;
out vec4 fragColor; 

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 color = texture(tex0, uv); 

  // 明るさ調整
  float brightness = 0.206; // -1.0から1.0の範囲で調整（0.0が元の明るさ）
  vec3 brightColor = color.rgb + brightness;

  // コントラスト調整
  float contrast = 3.1;
  vec3 adjustedColor = (brightColor - 0.5) * contrast + 0.5;

  // 結果を0.0から1.0の範囲にクランプ
  // adjustedColor = clamp(adjustedColor, 0.0, 1.0);

  fragColor = vec4(adjustedColor, color.a);
}

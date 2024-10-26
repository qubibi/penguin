#version 300 es
precision mediump float;

uniform sampler2D tex0;

in vec2 vTexCoord; // 入力変数の修正
out vec4 fragColor; // 出力変数

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y; // Y座標を反転させる
  vec4 color = texture(tex0, uv); // WebGL 2.0 の関数
  color.rgb = color.rgb;
  fragColor = color; // 出力変数に結果を代入
}

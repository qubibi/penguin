#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uMainTex;
uniform sampler2D uMaskTex;

void main() {
  // テクスチャ座標を垂直方向に反転
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);

  vec4 mainColor = texture(uMainTex, uv);
  vec4 maskColor = texture(uMaskTex, uv);
  
  float luminance = dot(maskColor.rgb, vec3(0.299, 0.587, 0.114));
  
  // アルファ値の計算を調整
  float alpha = mainColor.a * luminance;
  
  // 完全に透明な部分は描画しない
  if (alpha < 0.01) {
    discard;
  }
  
  fragColor = vec4(mainColor.rgb, alpha*1.0);
}
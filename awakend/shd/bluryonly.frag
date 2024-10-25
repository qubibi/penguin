#version 300 es
precision highp float;

uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float blurAmount;

in vec2 vTexCoord;
out vec4 fragColor;

vec4 verticalBoxBlur(sampler2D tex, vec2 uv) {
    vec4 color = vec4(0.0);
    float radius = floor(blurAmount);
    float samples = 2.0 * radius + 1.0;

    for (float y = -radius; y <= radius; y++) {
        color += texture(tex, uv + vec2(0.0, y) * texelSize);
    }

    return color / samples;
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  // P5.jsのテクスチャ座標を反転

    vec4 blurredColor = verticalBoxBlur(tex0, uv);
    vec4 originalColor = texture(tex0, uv);

    // ブレンド比率を0.5に設定
    float blendRatio = 1.0;

    // ブラー処理した色と元の色をブレンド
    fragColor = mix(originalColor, blurredColor, blendRatio);
}
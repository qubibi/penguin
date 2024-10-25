#version 300 es
precision highp float;

uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float blurAmount;

in vec2 vTexCoord;
out vec4 fragColor;

vec4 twoPassBoxBlur(sampler2D tex, vec2 uv) {
    float radius = floor(blurAmount);
    float weight = 2.0 * radius + 1.0;
    
    // 水平方向のブラー
    vec4 hBlur = vec4(0.0);
    for (float x = -radius; x <= radius; x++) {
        hBlur += texture(tex, uv + vec2(x * texelSize.x, 0.0));
    }
    hBlur /= weight;
    
    // 垂直方向のブラー
    vec4 finalColor = vec4(0.0);
    for (float y = -radius; y <= radius; y++) {
        finalColor += texture(tex, uv + vec2(0.0, y * texelSize.y));
    }
    finalColor /= weight;
    
    // わずかに明るめの補正を加えた平均を取る
    return (hBlur + finalColor) * 0.72; // 0.5から0.51に微調整
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;

    vec4 blurredColor = twoPassBoxBlur(tex0, uv);
    vec4 originalColor = texture(tex0, uv);

    float blendRatio = 0.5;
    fragColor = mix(originalColor, blurredColor, blendRatio);
}
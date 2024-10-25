#version 300 es
precision highp float;

uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float blurAmount;

in vec2 vTexCoord;
out vec4 fragColor;

vec4 optimizedBoxBlur(sampler2D tex, vec2 uv) {
    vec4 color = vec4(0.0);
    float radius = floor(blurAmount);
    float samples = (2.0 * radius + 1.0) * (2.0 * radius + 1.0);

    // プリフェッチによる最適化
    vec4 cornerSamples[4];
    cornerSamples[0] = texture(tex, uv + vec2(-radius, -radius) * texelSize);
    cornerSamples[1] = texture(tex, uv + vec2(radius, -radius) * texelSize);
    cornerSamples[2] = texture(tex, uv + vec2(-radius, radius) * texelSize);
    cornerSamples[3] = texture(tex, uv + vec2(radius, radius) * texelSize);

    // エッジのサンプリング
    for (float x = -radius + 1.0; x < radius; x++) {
        color += texture(tex, uv + vec2(x, -radius) * texelSize);
        color += texture(tex, uv + vec2(x, radius) * texelSize);
    }
    for (float y = -radius; y <= radius; y++) {
        color += texture(tex, uv + vec2(-radius, y) * texelSize);
        color += texture(tex, uv + vec2(radius, y) * texelSize);
    }

    // コーナーサンプルの加算
    color += cornerSamples[0] + cornerSamples[1] + cornerSamples[2] + cornerSamples[3];

    // 中央領域のサンプリング
    for (float y = -radius + 1.0; y < radius; y++) {
        for (float x = -radius + 1.0; x < radius; x++) {
            color += texture(tex, uv + vec2(x, y) * texelSize);
        }
    }

    return color / samples;
}


void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  // P5.jsのテクスチャ座標を反転

    vec4 blurredColor = optimizedBoxBlur(tex0, uv);
    vec4 originalColor = texture(tex0, uv);

    // ブレンド比率を0.7に設定
    float blendRatio = 0.5;

    // ブラー処理した色と元の色をブレンド
    fragColor = mix(originalColor, blurredColor, blendRatio);
}
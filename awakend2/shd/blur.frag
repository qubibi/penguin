#version 300 es
precision highp float;

uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float blurAmount;

in vec2 vTexCoord;
out vec4 fragColor;

vec4 improvedBoxBlur(sampler2D tex, vec2 uv) {
    vec4 color = vec4(0.0);
    float radius = floor(blurAmount);
    float totalWeight = 0.0;

    for (float y = -radius; y <= radius; y++) {
        for (float x = -radius; x <= radius; x++) {
            vec2 offset = vec2(x, y) * texelSize;
            color += texture(tex, uv + offset);
            totalWeight += 1.0;
        }
    }

    return color / totalWeight;
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  // P5.jsのテクスチャ座標を反転

    fragColor = improvedBoxBlur(tex0, uv);
}
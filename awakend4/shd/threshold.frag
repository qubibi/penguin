#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float _time;
uniform float _threshold;
uniform float _noiserange;
uniform float _mixfade;

float blendOverlay(float base, float blend) {
    return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

float luminance(vec3 color) {
    return dot(color, vec3(0.222, 0.707, 0.071));
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  // p5.jsはテクスチャ座標をY軸で反転させる必要があります

    vec4 color = texture(uTexture, uv);

    float r = rand(uv * _time) * _noiserange - _noiserange / 2.0;
    float s = step(luminance(color.rgb), _threshold + r);
    
    vec4 color2 = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), s);
    
    fragColor = mix(color * color2, vec4(blendOverlay(color.rgb, color2.rgb), 1.0), _mixfade);
}
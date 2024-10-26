#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float _time;
uniform float _threshold;
uniform float _noiserange;
uniform float _mixfade;

const vec3 RGB_ADJUST = vec3(1.03, 0.99, 0.94);
const vec3 SHADOW_COLOR = vec3(0.0, 0.2, 0.25);
const vec3 SEPIA_COLOR = vec3(1.0, 0.9, 0.7);
const float SHADOW_INTENSITY = 0.23;
const float SEPIA_INTENSITY = 0.05;
const float BRIGHTNESS_ADJUST = 0.95;

float blendOverlay(float base, float blend) {
    return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r, blend.r),
                blendOverlay(base.g, blend.g),
                blendOverlay(base.b, blend.b));
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
    vec3 color = texture(uTexture, uv).rgb;

    // ノイズ効果とblendOverlay処理
    float noise = rand(uv * _time) * _noiserange - _noiserange * 0.5;
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    float s = step(lum, _threshold + noise);
    vec3 noiseEffect = mix(vec3(1.0), vec3(0.0), s);
    vec3 blendedColor = blendOverlay(color, noiseEffect);
    
    // _mixfadeを使って元の色とブレンドした色をミックス
    color = mix(color, blendedColor, _mixfade);

    // ここから下はセピア調のカラーフィルター処理（_mixfadeの影響を受けない）
    color *= RGB_ADJUST * BRIGHTNESS_ADJUST;
    
    float shadowMask = smoothstep(0.0, 0.4, 1.0 - lum);
    color += SHADOW_COLOR * SHADOW_INTENSITY * shadowMask;
    
    color = mix(color, SEPIA_COLOR * lum, SEPIA_INTENSITY);

    fragColor = vec4(color, 1.0);
}
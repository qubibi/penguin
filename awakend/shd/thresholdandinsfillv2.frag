#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float _time;
uniform float _threshold;
uniform float _noiserange;
uniform float _mixfade;
uniform float _fade;
uniform float _blur1x;
uniform float _blur1y;
uniform float _radius;

const vec3 RGB_ADJUST = vec3(1.03, 0.99, 0.94);
const vec3 SHADOW_COLOR = vec3(0.0, 0.2, 0.25);
const vec3 SEPIA_COLOR = vec3(1.0, 0.9, 0.7);
const float SHADOW_INTENSITY = 0.23;
const float SEPIA_INTENSITY = 0.05;
const float BRIGHTNESS_ADJUST = 0.9;

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

// フィルターAの処理を関数化
vec3 applyFilterA(vec3 color, vec2 uv) {
    float noise = rand(uv * _time) * _noiserange - _noiserange * 0.5;
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    float s = step(lum, _threshold + noise);
    vec3 noiseEffect = mix(vec3(1.0), vec3(0.0), s);
    vec3 blendedColor = blendOverlay(color, noiseEffect);
    
    color = mix(color, blendedColor, _mixfade);
    color *= RGB_ADJUST * BRIGHTNESS_ADJUST;
    
    float shadowMask = smoothstep(0.0, 0.4, 1.0 - lum);
    color += SHADOW_COLOR * SHADOW_INTENSITY * shadowMask;
    color = mix(color, SEPIA_COLOR * lum, SEPIA_INTENSITY);
    
    return color;
}

void main() {
    vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
    vec2 src_size = vec2(1.0 / _blur1x, 1.0 / _blur1y);
    float n = float((_radius + 1.0) * (_radius + 1.0));
    
    // フィルターXの計算用の変数
    vec3 m0 = vec3(0.0), m1 = vec3(0.0), m2 = vec3(0.0), m3 = vec3(0.0);
    vec3 s0 = vec3(0.0), s1 = vec3(0.0), s2 = vec3(0.0), s3 = vec3(0.0);
    vec3 c;
    
    // 基準となるピクセルの色を取得
    vec3 baseColor = texture(uTexture, uv).rgb;
    
    // 領域ごとのサンプリングと統計計算
    // 左上領域
    for (int j = -4; j <= 0; ++j) {
        for (int i = -4; i <= 0; ++i) {
            c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
            m0 += c;
            s0 += c * c;
        }
    }
    
    // 右上領域
    for (int j = -6; j <= 0; ++j) {
        for (int i = 0; i <= 6; ++i) {
            c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
            m1 += c;
            s1 += c * c;
        }
    }
    
    // 右下領域
    for (int j = 0; j <= 4; ++j) {
        for (int i = 0; i <= 4; ++i) {
            c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
            m2 += c;
            s2 += c * c;
        }
    }
    
    // 左下領域
    for (int j = 0; j <= 6; ++j) {
        for (int i = -6; i <= 0; ++i) {
            c = texture(uTexture, uv + vec2(float(i), float(j)) * src_size).rgb;
            m3 += c;
            s3 += c * c;
        }
    }

    // 最適な領域の選択
    float min_sigma2 = 1e+2;
    vec3 finalColor = baseColor;

    // 各領域の分散を計算して最適な領域を選択
    m0 /= n;
    s0 = abs(s0 / n - m0 * m0);
    float sigma2 = s0.r + s0.g + s0.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        finalColor = m0;
    }

    m1 /= n;
    s1 = abs(s1 / n - m1 * m1);
    sigma2 = s1.r + s1.g + s1.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        finalColor = m1;
    }

    m2 /= n;
    s2 = abs(s2 / n - m2 * m2);
    sigma2 = s2.r + s2.g + s2.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        finalColor = m2;
    }

    m3 /= n;
    s3 = abs(s3 / n - m3 * m3);
    sigma2 = s3.r + s3.g + s3.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        finalColor = m3;
    }

    // フィルターXの結果をベース色とブレンド
    finalColor = mix(baseColor, finalColor, _fade);
    
    // フィルターAを適用
    finalColor = applyFilterA(finalColor, uv);
    
    fragColor = vec4(finalColor, 1.0);
}
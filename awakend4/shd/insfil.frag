#version 300 es
precision mediump float;

uniform sampler2D tex0;
in vec2 vTexCoord;
out vec4 fragColor;

// RGBチャンネル調整関数
vec3 adjustRGB(vec3 color) {
    vec3 result;
    result.r = color.r * 1.03;
    result.g = color.g * 0.99;
    result.b = color.b * 0.94;
    return result;
}

// 暗部を青緑に持ち上げる関数
vec3 liftShadows(vec3 color) {
    vec3 shadowColor = vec3(0.0, 0.2, 0.25); // 青緑色
    float shadowIntensity = 0.23; // 効果の強さ（0.1 = 10%）
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    float shadowMask = smoothstep(0.0, 0.4, 1.0 - luminance); // 暗い部分にのみ適用
    return mix(color, color + shadowColor, shadowIntensity * shadowMask);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y; // テクスチャを上下反転
    
    vec4 color = texture(tex0, uv);
    
    // RGBチャンネル調整
    color.rgb = adjustRGB(color.rgb);
    
    // 明るさを少し下げる（5%）
    color.rgb *= 0.95;
    color.rgb = liftShadows(color.rgb);
    // セピア効果を加える
    float sepiaIntensity = 0.05;
    vec3 sepiaColor = vec3(1.0, 0.9, 0.7);
    color.rgb = mix(color.rgb, sepiaColor * dot(color.rgb, vec3(0.299, 0.587, 0.114)), sepiaIntensity);
    
    // 暗部を青緑に持ち上げる
    
    
    fragColor = color;
}
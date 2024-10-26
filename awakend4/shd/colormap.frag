#version 300 es
precision mediump float;
uniform sampler2D tex0;
uniform sampler2D colorMap;
uniform vec2 colorMapSize;
in vec2 vTexCoord;
out vec4 fragColor;

vec4 mapColor(vec4 color) {
    vec3 colors[9] = vec3[](
        vec3(0.0, 0.0, 0.0),   // 黒
        vec3(0.0, 0.0, 1.0),   // 青
        vec3(0.0, 1.0, 0.0),   // 緑
        vec3(0.0, 1.0, 1.0),   // シアン
        vec3(1.0, 0.0, 0.0),   // 赤
        vec3(1.0, 0.0, 1.0),   // マゼンタ
        vec3(1.0, 1.0, 0.0),   // 黄
        vec3(1.0, 1.0, 1.0),   // 白
        vec3(0.5, 0.5, 0.5)    // グレー
    );
    
    float minDist = 1000.0;
    int closestIndex = 0;
    
    for (int i = 0; i < 9; i++) {
        float dist = distance(color.rgb, colors[i]);
        if (dist < minDist) {
            minDist = dist;
            closestIndex = i;
        }
    }
    
    vec2 mapCoord = vec2(float(closestIndex % 3) / 3.0 + 1.0 / 6.0, 
                         float(closestIndex / 3) / 3.0 + 1.0 / 6.0);
    return texture(colorMap, mapCoord);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    vec4 originalColor = texture(tex0, uv);
    vec4 mappedColor = mapColor(originalColor);
    
    vec3 blendedColor = mix(originalColor.rgb, mappedColor.rgb, 0.2);
    fragColor = vec4(blendedColor, originalColor.a);
}
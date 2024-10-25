#version 300 es
precision mediump float;

uniform sampler2D tex0;
uniform float time; 
uniform float tuyosa; 
in vec2 vTexCoord; 
out vec4 fragColor; 

float random(vec2 st) {
		return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
	vec2 uv = vTexCoord;
	uv.y = 1.0 - uv.y;
	vec2 offset = (vec2(random(uv + time), random(uv + time + 0.1)) - 0.5) * tuyosa;
	vec4 color = texture(tex0, uv + offset);
	fragColor = color;
}

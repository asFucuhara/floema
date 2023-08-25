precision highp float;

uniform float uAlpha;
uniform sampler2D tMap;

varying vec4 vPostion;
varying vec2 vUv;

void main() {
  vec4 texture = texture2D(tMap, vUv);
  gl_FragColor = texture;
  gl_FragColor.a = (1.0 - abs(vPostion.x) * 2.0) * uAlpha;
}

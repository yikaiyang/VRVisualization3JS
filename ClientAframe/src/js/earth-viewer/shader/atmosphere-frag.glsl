
varying vec3 vNormal;
varying vec3 worldPos;
vec3 atmosphereColor = vec3(0.17, 0.79, 0.88);

void main() {
float intensity = pow( 0.5 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 );
if (worldPos.x < 20000.0) {
   gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) ;
} else {
   gl_FragColor = vec4( atmosphereColor, 1.0 ) * intensity;
}
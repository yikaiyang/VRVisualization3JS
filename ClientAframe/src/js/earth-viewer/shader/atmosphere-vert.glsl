varying vec3 vNormal;
varying vec3 worldPos;
varying float earthRad;

void main() {
    float atmosphereRadius = 20.0;
    float earthRadius = 20.0;
    vNormal = normalize( normalMatrix * normal );
    worldPos = position;
    vec3 npos = position * (atmosphereRadius / earthRadius);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( npos, 1.0 );
}
require('three-instanced-mesh')(THREE);

export default class InstancedMeshGenerator{
    constructor(
        geometry, 
        material, 
        maxInstanceCount, 
        isDynamic = false,
        hasColor = false,
        isUniformScaled = false
    ){
        this.geometry = geometry;
        this.material = material;
        this.maxInstancesCount = maxInstanceCount; //Max number of allowed instances
        this.isDynamic = isDynamic;
        this.hasColor = hasColor;           //Set to true if meshes are colored.
        this.isUniformScaled = isUniformScaled; //Set to true if meshes are uniformly scaled.
        
        this._instancesCount = 0; //Counts the number of instanced meshes.
        
        this._instancedMesh = new THREE.InstancedMesh(
            this.geometry,
            this.material,
            this.maxInstancesCount,
            this.isDynamic,
            this.hasColor,
            this.isUniformScaled
        );
    }

    addInstance(position, quaternion, color, scale){
        if (this._instancesCount >= this.maxInstancesCount){
            console.error('ERROR: addInstance: number of instanced objects exceeded max number of instanced: '
            + this.maxInstancesCount);
            return;
        }

        this._instancedMesh.setQuaternionAt(
            this._instancesCount,
            quaternion
        );
        this._instancedMesh.setPositionAt(
            this._instancesCount,
            position
        );
        this._instancedMesh.setColorAt(
            this._instancesCount,
            color
        );
        this._instancedMesh.setScaleAt(
            this._instancesCount,
            scale
        );
        this._instancesCount++;
    }

    getMesh(){
        return this._instancedMesh;
    }
}
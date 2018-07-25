class TileLoader {
    constructor(tileServiceBaseUrl){
        this.tiles = [];
        this.tileServiceBaseUrl = tileServiceBaseUrl;
        this.imgLoader = new THREE.ImageLoader();
    }

    addTile(tile){
        this.tiles.push(tile);
    }

    loadTile(){
        let nextTile = this.tiles.shift();
        if (!!nextTile || nextTile instanceof Tile){
            this.imgLoader.load(
                mbUrl,
                //onload
                function (data){
                    if (!!data){
                        console.log(data);
                        
        
                        //let image = new ImageData(imgArray, ctx.canvas.width, ctx.canvas.height);
        
                        //ctx.putImageData(imgData, 0, 0);
                        
                        /** 
                        let tile = JSON.parse(data);
                        let imgData = (tile.tile_data || {}).data;
                        
                        let imgArray = new Uint8ClampedArray(imgData);
                        console.log(imgArray);
        
                        
                        //console.log('id: ' + data.id);
                        //console.log('imgData:' + imgData);
        
                        var container = document.getElementById('container');
                        
                        var canvas2 = container.appendChild(document.createElement('canvas'));
                        canvas2.setAttribute('id', 'canvas2');
        
                        var ctx = canvas2.getContext('2d');
                        ctx.fillStyle = 'red';
        
                        let image = new ImageData(imgArray, ctx.canvas.width, ctx.canvas.height);
                        ctx.putImageData(image,0,0);
        
                        //ctx.putImageData(imgData, 0, 0);
        
                        //var tileTexture = new THREE.Texture(imgData);
                        //tileTexture.needsUpdate = true;
                        
                        //Add sample tile
                        var tileGeometry = new THREE.PlaneGeometry(120, 120, 1, 1);
                        var tileMaterial = new THREE.MeshLambertMaterial({
                            color : 0x180B7E, 
                            wireframe: true
                            //map: tileTexture
                        });
                        var tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
                        tileMesh.rotation.x  = -Math.PI / 2;
                        scene.add(tileMesh);
                        **/
                    
                    } else {
                        console.error('Tile loading failed for tile {zoom:' + zoom + ' x: ' + x + ' y:' + y+ '}');
                    }
                },
                //on progress
                undefined,
                //on error
                function(){
                    console.log('Error at loader.load');
                }
            );
        }
    }
}
import MapboxTileSource from '../src/js/earth-viewer/tileSource/mapbox-tile-source.js'
import OSMTileSource from '../src/js/earth-viewer/tileSource/osm-tile-source.js'

QUnit.module('MapboxTileSourceTest');

QUnit.test('BuildSucessfulHTTPRequest', function( assert ){
    //https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=your-access-token
    const baseUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7';
    //const acceessToken = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
    const acceessToken = '114324324'
    const zoom = 1;
    const tileX = 0;
    const tileY = 0;
    const fileFmt = 'png';
    const expectedURL = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=114324324'

    let tileSource = new MapboxTileSource(acceessToken, fileFmt);
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);
    
    console.log('URL' + URL);
    assert.strictEqual(URL,expectedURL);
});

QUnit.test('BuildSucessfulHTTPRequestWithoutSpecifyingFileFormat', function( assert ){
    //https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=your-access-token
    const baseUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7';
    //const acceessToken = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
    const acceessToken = '114324324'
    const zoom = 1;
    const tileX = 0;
    const tileY = 0;
    //const fileFmt = 'png';
    const expectedURL = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=114324324'

    let tileSource = new MapboxTileSource(acceessToken);
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);
    
    console.log('URL' + URL);
    assert.strictEqual(URL,expectedURL);
});

QUnit.module('Open Street Maps');
QUnit.test('BuildSucessfulHTTPRequest', function( assert ){
    //const acceessToken = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';
    const expectedURL = 'https://b.tile.openstreetmap.org/9/278/176.png'

    const zoom = 9;
    const tileX = 278;
    const tileY = 176;

    let tileSource = new OSMTileSource();
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);
    
    console.log('URL' + URL);
    assert.strictEqual(URL,expectedURL);
});
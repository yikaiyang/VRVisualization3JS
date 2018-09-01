import MapboxTileSource from './mapbox-tile-source.js'

test('Builds valid HTTP Request', () => {
    const acceessToken = '114324324';
    const zoom = 1;
    const tileX = 0;
    const tileY = 0;
    const fileFmt = 'png';
    const expectedURL = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=114324324'

    let tileSource = new MapboxTileSource(acceessToken, fileFmt);
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);

    expect(URL).toBe(expectedURL);
});

test('Build successful HTTP Request without specifying file format', () => {
    const acceessToken = '114324324'
    const zoom = 1;
    const tileX = 0;
    const tileY = 0;
    const expectedURL = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/1/0/0.png?access_token=114324324'

    let tileSource = new MapboxTileSource(acceessToken);
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);
    expect(URL).toBe(expectedURL);
});


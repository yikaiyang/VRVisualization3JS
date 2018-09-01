import OSMTileSource from './osm-tile-source.js'

test('Builds valid HTTP Request', () => {
    const zoom = 9;
    const tileX = 278;
    const tileY = 176;
    const expectedURL = 'https://b.tile.openstreetmap.org/9/278/176.png'

    let tileSource = new OSMTileSource();
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);

    expect(URL).toBe(expectedURL);
});
import OSMTileSource from './osm-tile-source.js'

test('Builds valid HTTP Request', () => {
    const zoom = 9;
    const tileX = 278;
    const tileY = 176;
    const expectedURLRegEx = /https:\/\/[a,b,c].tile.openstreetmap.org\/\d*\/\d*\/\d*\.png/;

    let tileSource = new OSMTileSource();
    let URL = tileSource.buildTileURL(zoom, tileX, tileY);

    expect(URL).toMatch(expectedURLRegEx);
});
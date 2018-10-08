import JSONUtil from './json-util'

test('Successful getProperty on valid json object with valid path', () => {
    const testJSON = {
        position: {
            latitude: 43,
            longitude: 32,
        }
    }

    let latitudeExists = JSONUtil.checkIfPropertyExists(testJSON, 'position.latitude');
    let longitudeExists = JSONUtil.checkIfPropertyExists(testJSON, 'position.longitude');

    expect(latitudeExists).toBe(true);
    expect(longitudeExists).toBe(true);
});

test('Successful getProperty on valid json object with valid path', () => {
    const testJSON = {
        position: {
            latitude: 43,
            longitude: 32,
        }
    }

    const expectedLatitude = testJSON.position.latitude;
    const expectedLongitude = testJSON.position.longitude;

    const resultLatitude = JSONUtil.getProperty(testJSON, 'position.latitude');
    const resultLongitude = JSONUtil.getProperty(testJSON, 'position.longitude');

    expect(resultLatitude).toBe(expectedLatitude);
    expect(resultLongitude).toBe(expectedLongitude);
});
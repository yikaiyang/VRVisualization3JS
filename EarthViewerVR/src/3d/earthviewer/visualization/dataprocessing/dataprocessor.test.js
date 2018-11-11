import DataProcessor from './dataprocessor'
import SampleData from '../../../../assets/data/sampledata.js'

test('Processes a json object succesfully', () => {
    expect(SampleData).toBeDefined();
    const sampleDataLength = SampleData.data.length;

    const mapping = {
        "id": "\ufeffKA-Nr",
        "dataPath": "data",
        "title": "\ufeffKA-Nr",
        "latitude": "position.lat",
        "longitude": "position.lng"
    }
    const result = DataProcessor.processData(SampleData, mapping);
    expect(result.length).toBe(sampleDataLength);
});
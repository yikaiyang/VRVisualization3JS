import SizeMapper from './sizemapper.js'
import SampleData from '../../../../assets/data/sampledata.js'
import BasePropertyMapper from './base-propertymapper.js';
import DataMapperFactory from './datamapper-factory.js';

test('Test successful base-propertymapper', () => {
/*     const testArray = SampleData.data;
    const propertyPath = "Bettenanzahl";
    let sizeMapper = new BasePropertyMapper(testArray, propertyPath);
    const maxValue = sizeMapper.maxValue;
    const minValue = sizeMapper.minValue;
    const range = sizeMapper.valueRange;

    expect(maxValue).toBeDefined();
    expect(minValue).toBeDefined();
    expect(range).toBeDefined(); */
});

test('Test successful sizemapper', () => {
    const testArray = SampleData.data;
    const propertyPath = "Bettenanzahl";
    let sizeMapper = DataMapperFactory.createSizeMapper(testArray, propertyPath);
    //let sizeMapper = new SizeMapper(testArray, propertyPath);
    const maxValue = sizeMapper.maxValue;
    const minValue = sizeMapper.minValue;
    const range = sizeMapper.valueRange;

    expect(maxValue).toBeDefined();
    expect(minValue).toBeDefined();
    expect(range).toBeDefined();

    //Test min / max value
    const mappedMin = sizeMapper.getMappedValue(minValue);
    const mappedMax = sizeMapper.getMappedValue(maxValue);
    
    expect(mappedMin).toBe(minValue);
    expect(mappedMax).toBe(maxValue);
});

test('Test successful sizemapper with custom range', () => {
    const testArray = SampleData.data;
    const propertyPath = "Bettenanzahl";
    const options = {
        range: [100, 1000]
    }
    let sizeMapper = DataMapperFactory.createSizeMapper(testArray, propertyPath, options);
    const maxValue = sizeMapper.maxValue;
    const minValue = sizeMapper.minValue;
    const range = sizeMapper.valueRange;

    expect(maxValue).toBeDefined();
    expect(minValue).toBeDefined();
    expect(range).toBeDefined();

    //Test min / max value
    const mappedMin = sizeMapper.getMappedValue(minValue);
    const mappedMax = sizeMapper.getMappedValue(maxValue);
    
    expect(mappedMin).toBe(100);
    expect(mappedMax).toBe(1000);
})


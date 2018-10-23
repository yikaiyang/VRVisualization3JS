import SizeMapper from './sizemapper.js'
import SampleData from '../../../../assets/data/sampledata.js'
import BasePropertyMapper from './base-propertymapper.js';
import d3 from 'd3';

test('Test successful base-propertymapper', () => {
    const testArray = SampleData.data;
    const propertyPath = "Bettenanzahl";
    let sizeMapper = new BasePropertyMapper(testArray, propertyPath);
    const maxValue = sizeMapper.maxValue;
    const minValue = sizeMapper.minValue;
    const range = sizeMapper.valueRange;

    expect(maxValue).toBeDefined();
    expect(minValue).toBeDefined();
    expect(range).toBeDefined();
});

test('Test successful sizemapper', () => {
    const testArray = SampleData.data;
    const propertyPath = "Bettenanzahl";
    let sizeMapper = new SizeMapper(testArray, propertyPath);
    const maxValue = sizeMapper.maxValue;
    const minValue = sizeMapper.minValue;
    const range = sizeMapper.valueRange;

    expect(maxValue).not(undefined);
});


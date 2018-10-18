import DataLoader from './dataloader.js'

test('Fetches file succesfully', () => {
    const filePath = '../../../../assets/data/hospital/hospitalData.json';
    DataLoader.loadData(filePath)
        .then((response) => {
            const res = response;
            expect(res).toBeDefined(res);
        });
});
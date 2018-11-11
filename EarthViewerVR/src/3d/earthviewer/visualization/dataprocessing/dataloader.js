import axios from 'axios'

export default class DataLoader {
    /**
     * Fetches data from a given filepath and returns it's value
     */
    static loadData(filePath){
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: filePath,
            })
            .then((response) => {
                alert('loaded data');
                let data;
                if (!!response){
                    data = response.data;
                }
    
                resolve(data);
            })
            .catch((error) => {
                console.error('Failed loading file:' + filePath);
                console.error(error);
                reject(error);
            })
        });
    }
}
class GoogleMapsAutoComplete {
    constructor(){
        this.service = new google.maps.places.AutocompleteService();
        this.callback;
    }

    query(searchTerm, callback){
        this.callback = callback;
        this.service.getQueryPredictions(
            {input: searchTerm}, 
            (results, status) => {this._handleCallback(results, status)}
        );
    }

    _handleCallback(predictions, status) {
        console.debug('displaySuggestions : ' );
        console.debug(predictions);
        const result = this._parseResult(predictions, status);
        console.debug(result);
        this.callback(result);
    };

    _parseResult(apiResult, status){
        console.debug('parseResult');
        let resultJSON = {
            results: [],
            status: ''
        };

        if (status != google.maps.places.PlacesServiceStatus.OK) {
            //If API is unavailable, return an empty json object and set status element to 'Error'
            console.debug('Error: Google places invalid servicestatus');
            resultJSON.status = 'Error';
            return resultJSON;
        }

        if (apiResult === undefined){
            resultJSON.status = 'Error'
            return resultJSON;
        }
        
        for (let i = 0; i < apiResult.length; i++){
            const apiSuggestion = apiResult[i].description;
            const suggestionResult = apiSuggestion.split(',')[0];
            let suggestionDetail = apiSuggestion
                                        .split(',')
                                        .slice(1, suggestionResult.length)
                                        .toString();
            //suggestionDetail = (suggestionDetail.length > 14) ? suggestionDetail.substring(0, 14) + '...' : suggestionDetail; 

            let resultItem = {
                result: suggestionResult,
                resultDetail: suggestionDetail,
                id: apiResult[i].id
            };
            resultJSON.results.push(resultItem);
        }

        resultJSON.status = 'OK';

        console.log(resultJSON);

        return resultJSON;
    }

}
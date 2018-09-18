//TODO: Handle all error cases like too many api requests, service unavailable ....

class GoogleMapsClientAPI {
    constructor(){
        this.autocompleteService = new google.maps.places.AutocompleteService(
            //Create an empty div to avoid the requirement of embedding a google maps element on the html page.
            document.createElement('div')  
        );
        this.placesService = new google.maps.places.PlacesService(
            document.createElement('div')
        );
        this.callback; //Callback which will be called after information retrieval of the google autocomplete api.
        this.getLocationCallback;
    }

    /**
     * API to fetch detailed location info (latitude, longitude, etc..) 
     */

    /**
     * Aquires location info using the given location id
     * @param {*} locationId 
     */
    getLocationInfo(locationId, callback){
        if (!!locationId){
            this.getLocationCallback = callback;
            const request = {
                placeId: locationId,
                fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
            };

            this.placesService.getDetails(request, 
                (response, status) => {this._handleGetLocationInfoCallback(response, status)}
            );
        }
    }

    _handleGetLocationInfoCallback(response, status){
        console.debug('_handleGeLocationInfoCallback:');
        console.log(response);
        
        if (!!this.getLocationCallback){
            const result = this._parseGetLocationResponse(response,status); //No need to parse if there is no callback
            this.getLocationCallback(result);
        }
        
    }

    _parseGetLocationResponse(response, status){
        console.debug('parseGeLocationResponse : ');
        console.debug(response);

        let result = {};
        result.status = 'Error';

        if (status == google.maps.places.PlacesServiceStatus.OK){
            const lat = response.geometry.location.lat();
            const lon = response.geometry.location.lng();
            const name = response.name;

            result.name = name;
            result.lat = lat;
            result.lon = lon;
            result.status = 'OK';

            console.debug('lat: ' + lat + ' lon: ' +lon);
            console.log(result);
        }
        
        return result;
    }

    /**
     * Autocomplete API
     */
    query(searchTerm, callback){
        this.callback = callback;
        this.autocompleteService.getQueryPredictions(
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
                id: apiResult[i].id,
                placeId: apiResult[i].place_id
            };
            resultJSON.results.push(resultItem);
        }

        resultJSON.status = 'OK';

        console.log(resultJSON);

        return resultJSON;
    }

}

export default GoogleMapsClientAPI;
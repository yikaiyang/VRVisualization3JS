/**
 * @author Yikai Yang
 * A simple Rest Client for accessing google maps api. 
 */
class GoogleMapsAPIKey {}
GoogleMapsAPIKey.Token = 'AIzaSyDK7Vp__eSf3moyboIE6vg6Plwn4KV-eHY'; //TODO: Better save this somewhere else 
Object.freeze(GoogleMapsAPIKey);

import axios from 'axios';

class GoogleMaps{}
GoogleMaps.PlacesAPIBaseURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=photos,formatted_address,name,rating,opening_hours,geometry&inputtype=textquery'
Object.freeze(GoogleMaps);

/**
 * Welp, apparently the places api works only on server side (node.js) and client side requests are blocked by CORS.
 * See https://developers.google.com/maps/documentation/javascript/places
 * (for servers, which this app is not)
 */
class GoogleMapsAPI {
    constructor () {
        this.axios = axios;
        this.apiURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key='
    }

    queryLocation(searchTerm, callback){
        this._buildURL(GoogleMapsAPIKey.Token, searchTerm);
        this.axios
            .get(this._buildURL(GoogleMapsAPIKey.Token, searchTerm))
            .then(response => (
                callback(response)
            ));
    }

    _buildURL(key, queryText){
        const queryURL = GoogleMaps.PlacesAPIBaseURL + '&key=' + key + '&input=' + queryText;
        return queryURL;
    }
}

/*
 *  Version for clients
 */
class GoogleMapsAPIClient {
    constructor(){
        this.googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
        this.callback;
    }

    queryLocation (locationId){
        if (!locationId){
            console.error('Error: invalid locationId ' + locationId );
        }   
    }

    queryLocation(searchTerm, callback){
        this.callback = callback;
        let request = {
            query: searchTerm
        };
        this.googlePlacesService.textSearch(request, (results, status) => {this._handleMapsCallback(results, status)});
    } 

    _handleMapsCallback(results, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            if (this.callback !== undefined){
                this.callback(results);
            }
        } else {
            console.debug('Google Maps Places API: Invalid PlacesServiceStatus');
            if (this.callback !== undefined){
                this.callback(null);
            }
        }
    }
}


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

        console.log(resultJSON);

        return resultJSON;
    }

}

export {GoogleMapsAPI, GoogleMapsAPIClient, GoogleMapsAutoComplete};
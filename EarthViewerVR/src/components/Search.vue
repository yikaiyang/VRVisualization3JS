<template>
    <div id="search">
        <form id="searchbar">
            <div class="search-container">
                <button class="menu" type="button" onclick="openMenu()"></button>
                <input 
                    id="textinput" 
                    type="text" 
                    name="searchbox" 
                    placeholder="Search location"
                    v-model="searchInput"
                    v-on:keyup="queryLocation"
                    v-on:keyup.enter="queryLocation"
                >
            </div>
        </form>
            
        <div 
            id="search-results"
            v-on:mouseenter="enteredResultBox()"
            v-on:mouseleave="leftResultBox()"
        >
            <ul>
                <li v-bind:key="resultItem.id" 
                    v-for="resultItem in results"
                    v-on:mouseenter="handleMouseOver(resultItem)"
                    v-on:mouseleave="handleMouseOut(resultItem)">
                    <div class="result-item-container">
                        <span class="result-item result-name">{{resultItem.result}}</span>
                        <span class="result-item delimiter">•</span>
                        <span class="result-item result-city">{{resultItem.resultDetail + ' '}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import debounce from 'debounce' // Delays invocation of method
import GoogleMapsClientAPI from '../api/googlemapsClientAPI.js'
//import {GoogleMapsAutoComplete} from '../api/googlemapsAPI';


export default {
    name: "Search",
    data: function() {
        return {
            searchInput: '',
            results: [
            /*  {
                    result: 'Vienna',
                    country: 'Austria',
                },
                {
                    result: 'Prag',
                    country: 'Czech'
                },
                {
                    result: 'ASfsaf',
                    country: 'AfsdfLand'
                } */
            ],
            cachedUserPosition: {}, //Cached position of the initial location of the user before peeking to  (Previewing)
        }
    },

    mounted () {
        this.hoverTimeOut = {};
        this.leftResultBoxTimeOut = {};
        this.resultBox = {};
        this.enteredResultBoxLock = false;
        this.leftResultBoxLock = false;
        this.isPeekingActive = false;

        this.api = new GoogleMapsClientAPI();
        const placeID = 'ChIJn8o2UZ4HbUcRRluiUYrlwv0';
        this.api.getLocationInfo(placeID);
    },

    methods: {
        queryLocation: function (){
            if (this.searchInput){
                this.api.query(this.searchInput,
                    (result) => {
                        if (!!result){
                            this.$data.results = result.results;
                        }
                    } 
                );
            } else {
                this.$data.results = [];
            }
        },
      
        handleMouseOver: function (item){
        /**
         * Rotates to selected location (mouseover) if the user hovers 800ms or longer above the item.
         */
            this.hoverTimeOut = setTimeout(() => {
              
                //alert('timeout' + item.placeID)
                console.log(item.placeId);
                const placeId = item.placeId;
                if (!!placeId){
                    this.api.getLocationInfo(
                        placeId,
                        (result) => {
                            if (!!result){
                                console.log(result);
                                Earth.rotateTo(result.lat, result.lon);
                            }
                        }
                    )
                } else {
                    console.error('ERROR: Mouse over: item ' + item + ' does not have a placeid.');
                }
            }, 1000);
        },
        handleMouseOut: function(item){
            //Resets timeout for
            clearTimeout(this.hoverTimeOut);
        },
        enteredResultBox: function(){
            this.isPeekingActive = true;
            console.debug('enteredResultBox');
            if (!this.enteredResultBoxLock){
                //alert('newPosition');
                this.$data.cachedUserPosition = Earth.getUserPosition();
            } 
            this.enteredResultBoxLock = true;
            clearTimeout(this.leftResultBoxTimeOut);
        },
        leftResultBox: function(){
            console.debug('leftResultBox');
            this.isPeekingActive = false;
            clearTimeout(this.leftResultBoxTimeOut);

            if (this.enteredResultBoxLock && !this.leftResultBoxLock){

                this.leftResultBoxTimeOut = setTimeout(() => {
                    //alert('leftResultBox');
                    this.leftResultBoxLock = true; //Do not allow triggering leftResultBox method multiple times
                    
                    const position = this.$data.cachedUserPosition;
                    if (!!position){
                        Earth.rotateTo(position.latitude, position.longitude);
                        //Wait 1000ms for animation to finish.
                        setTimeout(() => {
                            //alert('releasing lock');
                            if (!this.isPeekingActive){
                                this.enteredResultBoxLock = false;
                            }
                            
                            this.leftResultBoxLock = false;
                        },1000);
                    } else {
                        this.enteredResultBoxLock = false;
                        this.leftResultBoxLock = false;
                    }
                }, 1000);     
            }
        },
        created: function () {
            this.queryLocation = debounce(this.queryLocation, 300); //Add 300ms delay when the method is triggered
        }
    }
};
</script>

<style scoped>

form {
    background: #FFFFFF;
    box-shadow: 0 2px 2px 0 rgba(169,169,169,0.50);
    border-radius: 2px;

    width: 340px;
    height: 48px;
    
    margin-top: 18px;
    margin-left: 18px;
    cursor: default;
}

.search-container {
    display: flex;
}

#searchbar {
    background-color: white;
}

#searchbar >>> .menu{
    border: 0px;
    height: 48px;
    width: 48px;
    background-color: white;
    background-image: url('../assets/icons/Search/menu.svg');
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: center;
    cursor: pointer;
} 

#searchbar >>> #textinput{
    border: none;
    margin-left: 14px;
    border: 0;
    padding: 0;
    height: 48px;
    font-size: 14px;
    flex-grow: 2;
    color: #616569;
    outline: none;
}

#search-results {
    width: 340px;
    background: #FFFFFF;
    box-shadow: 0 2px 2px 0 rgba(169,169,169,0.50);
    border-radius: 2px;
    margin-left: 18px;
    margin-top: 8px;
    cursor: default;
}

#search-results >>> li {
    margin: 0;
    padding: 0px;
    min-height: 42px;
    border-bottom: 1px solid #EDEDED;
    cursor: pointer;
}

#search-results >>> li:last-child{
    border-bottom: 0px;
    
}

#search-results >>> li:hover {
    background-color: #F4F4F4;
}

.result-item-container {
    margin-left: 18px;
}

#search-results >>> span {
    display: inline-flex;
    justify-content: center;
    flex-direction: column;
    height: 42px;
    font-size: 14px;
    word-wrap: break-word
}

#search-results >>> .result-name{
    color: #2D2D2D;
    margin-right: 4px;
}

.delimiter {
    color: #D8D8D8;
    margin-right: 4px;
}

#search-results >>> .result-city{
    color: #878787;
}

#search-results >>> ul {
    margin-left: 0;
    padding-left: 0;
    list-style: none;
}

</style>
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
            
        <div id="search-results">
            <ul>
                <li v-bind:key="resultItem.id" v-for="resultItem in results">
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
import {GoogleMapsAPIClient} from '../api/googlemapsAPI'
import {GoogleMapsAutoComplete} from '../api/googlemapsAPI'

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
        ]
    }
  },

  mounted () {
      this.api = new GoogleMapsAutoComplete();
  },

  methods: {
      queryLocation: function (){
        if (this.searchInput){
             this.api.query(this.searchInput,
                 (result) => {
                    console.log('Queried:');
                    console.log(result);
                    //alert(result);
                    this.$data.results = result.results;
                } 
            );
           /* console.debug('queryLocation: ' + this.searchInput);
            this.api.query(this.searchInput, 
                    this.handleRequest.bind(this)
                 (result) => {
                    console.log('Queried');
                    console.log(result);
                    alert(result);
                } 
            );*/
        } else {
            this.$data.results = [];
        }
      }
  },

  created: function () {
      this.queryLocation = debounce(this.queryLocation, 300); //Add 300ms delay when the method is triggered
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

#search-results >>> .result-name {
    
}

</style>

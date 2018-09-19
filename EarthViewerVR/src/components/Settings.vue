<template>
    <div 
        class="panel"
        id="search-results"
    >
        <div class="header">
            <h2>Settings</h2>
        </div>
        
        <ul>
            <li v-bind:key="resultItem.id" 
                v-for="resultItem in results"
                v-on:mouseenter="handleMouseOver()"
                v-on:mouseleave="handleMouseOut()">
                <div class="result-item-container">
                    <span class="result-item result-name">{{resultItem.result}}</span>
                    <span class="result-item delimiter">•</span>
                    <span class="result-item result-city">{{resultItem.resultDetail + ' '}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "Settings",
    data: function() {
        return {
            searchInput: '',
            results: [
                {
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
                } 
            ],
            cachedUserPosition: {}, //Cached position of the initial location of the user before peeking to  (Previewing)
        }
    },

    mounted () {
    },

    methods: {
        created: function () {
        },
        handleMouseOver: function() {
        },
        handleMouseOut: function() {
        }
    }
};
</script>

<style scoped>

h2 {
    font-size: 16px;
    padding: 16px;
    text-align: center;
}

.header {
    background-color: white;
    box-shadow: 0 2px 4px 0 rgba(299,299,299,0.5);
}

.header-line {
    margin: 0;
    padding: 0;
}

.heading {
    background-color: white;
}

.panel {
    background-color: #f7f7f7
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
<template>
    <div 
        class="panel"
    >
        <div class="header">
            <h2>Settings</h2>
        </div>

        <div class="content">
            <div class="content-item">
                <p>Choose your map provider:</p>
                <div class="dropdown">
                    <button 
                        class="btn btn-secondary dropdown-toggle" 
                        type="button" 
                        id="dropdownMenuButton" 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false">
                        {{
                            this.mapOptions[selectedMapOptionId].providerName 
                            || this.mapOptions[0].providerName
                        }}
                    </button>
                    <div 
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                    >
                        <a 
                            :key="option.id"
                            v-for="(option, index) in mapOptions"
                            v-bind:class="{'disabled': (selectedMapOptionId === index)}"
                            v-on:click="mapSelectionDropdownClicked(option.id)"
                            class="dropdown-item" href="#">
                            {{option.providerName}}
                        </a>
                    </div>
                </div>
            </div>  

            <div 
                class="content-item"
                v-bind:class="{ 'collapsed': 
                    !mapOptions[selectedMapOptionId]
                        .hasOwnProperty('apiKey')}"
            >
                <p>Enter your Mapbox API Token:</p>
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="API Token"
                    aria-label="Mapbox API Token"
                    v-bind:value="mapOptions[selectedMapOptionId].apiKey || ''"
                >
            </div>  
        </div>
    </div>
</template>

<script>
import {
  MapboxTileSource,
  MapboxOptions
} from "./../3d/earthviewer/tilesource/mapbox-tile-source.js";
import OSMTileSource from "./../3d/earthviewer/tilesource/osm-tile-source.js";

const MAPBOX_TOKEN = 'pk.eyJ1IjoieWlrYWl5YW5nIiwiYSI6ImNqaXJ5eXd6MDBhOGwzcGxvMmUwZGxsaDkifQ.Czx2MTe4B6ynlMbpW52Svw';

export default {
  name: "Settings",
  data: function() {
    return {
      mapOptions: [
        {
          providerName: "Mapbox (Default)",
          apiKey: MAPBOX_TOKEN,
          id: 0
        },
        {
          providerName: "Open Street Maps",
          id: 1
        }
      ],
      selectedMapOptionId: 0
    };
  },

  mounted() {
        //Initialize available tilesources
        this._mapboxTileSource =
            new MapboxTileSource(
                MAPBOX_TOKEN,
                undefined, 
                MapboxOptions.StreetV1,
                'mapbox://styles/yikaiyang/cjljkon0224u72rmqfyvybx1e'
            );
      
        this._osmTileSource = new OSMTileSource();

  },

  methods: {
    mapSelectionDropdownClicked: function(id) {
      this.$data.selectedMapOptionId = id;
      if (id === 0) {
          //Mapbox was selected
          alert('mapbox');
          Earth.setTileSource(this._mapboxTileSource);
      } else if (id === 1) {
          //OSM was selected
          alert('osm');
          Earth.setTileSource(this._osmTileSource);
      }
    }
  }
};
</script>

<style scoped>
h2 {
  font-family: Heebo;
  font-size: 18px;
  font-weight: 500;
  padding: 20px;
}

.collapsed {
    visibility: hidden;
}

p {
  /* Choose your map prov: */
  font-family: Heebo;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #505050;
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(299, 299, 299, 0.5);
}

.header-line {
  margin: 0;
  padding: 0;
}

.content {
  padding-left: 18px; 
  padding-right: 18px;
  padding-top: 8px;
}

.content-item {
    padding-bottom: 18px;
}

.panel {
  background-color: #f2f3f5;
  box-shadow: 0 2px 2px 0 rgba(169,169,169,0.50);
  height: 540px;
  width: 340px;
  margin-left: 18px;
  margin-top: 12px;
}
</style>
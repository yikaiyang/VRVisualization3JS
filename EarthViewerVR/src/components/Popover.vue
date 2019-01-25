<template>
    <div>
        <transition name="ev-popover-fade">
            <div class="earthviewer-popover" v-show="isPopoverEnabled">
                <div class="title-header">
                    <span class="title">{{
                        (selectedItem || {} ).name
                    }}</span> 
                </div>
                
                <div class="content">
                    <Histogram 
                        v-bind:id="selectedID"
                        mappedProperty="Bettanzahl"
                        />                    
                    <table style="color: white;">
                        <tr>
                            <td>ID:</td>
                            <td>{{selectedID.id}}</td>
                        </tr>
                        <tr>
                            <td>Title:</td>
                            <td>{{selectedItem.title}}</td>
                        </tr>
                        <tr>
                            <td>Latitude:</td>
                            <td>{{selectedItem.latitude}}</td>
                        </tr>
                        <tr>
                            <td>Longitude:</td>
                            <td>{{selectedItem.longitude}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </transition>
        <!-- <VRBillboard 
            v-bind:selectedItem="selectedItem"
            v-bind:selectedID="selectedID"
        >
        </VRBillboard> -->
    </div>
</template>

<script>
import Histogram from './Histogram.vue'
import VRBillboard from './VRBillboard/VRBillboard.vue'
import JSONUtil from '../util/json-util.js'
import DataStorage from './../3d/earthviewer/visualization/datastorage/datastorage.js'

/**
 * State / Store pattern 
 * https://vuejs.org/v2/guide/state-management.html
 */
var store = {
    debug: true,
    state: {
        selectedItem: {
            name: '',
            id: 'ID',
            title: 'TITLE',
            latitude: 0.0,
            longitude: 0.0
        },
        selectedID: 0
    },
    setSelectedItemAction (value){
        if (this.debug) {
            console.log('setMessageAction triggered with:' + value);
        };

        if (!!value){
                this.state.selectedItem.name = value.name;
                this.state.selectedItem.id = value.id;
                this.state.selectedItem.title = value.title;
                this.state.selectedItem.latitude = value.latitude;
                this.state.selectedItem.longitude = value.longitude;
        }
    },
    setSelectedID(value){
        if (this.debug) {
            console.log('setSelectedID triggered with:' + value);
        };

        if (!!value){
            this.state.selectedID = value;
        }
    }
}

export default {
    name: 'Popover',
    data: function(){
        return {
            isPopoverEnabled: false,
            selectedID: store.state.selectedID,
            selectedItem: store.state.selectedItem
        }
    },
    mounted: function(){
        EVENT_BUS.on('earthviewer:sceneSelectedItemChanged', (id) => {
            this.handleSelectedItemChangedEvent(id);
        });
    },
    methods: {
        async handleSelectedItemChangedEvent(id) {
            if (!!id && id !== this.selectedID){
                this.isPopoverEnabled = true;
                this.selectedID = id;

                //Load object with the retrieved id 
                await this.loadSelectedItem(id);
            } else {
                //No item selected. Set visibility of popover to hidden.
                this.isPopoverEnabled = false;
            }
        },
        async loadSelectedItem (id) {
            if (!!id){
                 //Get and set object with the retrieved id 
                if (!!window.DATA_STORAGE){
                    let selectedObject = await Object.assign({},window.DATA_STORAGE[id]);
                    let parsedObject = {
                        name: ((selectedObject || {} ).properties || {} ).Bezeichnung,
                        id: (selectedObject || {}).id,
                        title: (selectedObject || {}).title,
                        latitude: ((selectedObject || {}).position || {}).lat,
                        longitude: ((selectedObject || {}).position || {}).lon
                    }
                    //alert(JSON.stringify(parsedObject));
                    store.setSelectedItemAction(parsedObject);
                    //this.selectedItem = window.DATA_STORAGE[id];
                }
            }
        },
    },
    components: {
        Histogram,
        VRBillboard
    }
}
</script>

<style>
    .earthviewer-popover {
        background: #10151C;
        margin-left: 16px;
    }

    .earthviewer-popover .title{
        font-size: 14px; 
        font-weight: bold;
        color: white;
    }

    .earthviewer-popover .title-header{
        background: #1A222C;
        padding: 16px;
    }

    .earthviewer-popover .content{
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 12px;
        padding-bottom: 16px;
    }

    .earthviewer-popover table {
        width: 100%;
        /*max-width: 340px;*/
    }

    .earthviewer-popover table td {
        font-size: 14px;
        color: #FFFFFF;
    }

    .earthviewer-popover table td:last-child{
        text-align: right;
    }

    .earthviewer-popover table td:first-child {
        color: #AFAFAF;
    }

    /** Fade animations
        https://vuejs.org/v2/guide/transitions.html
     **/
    .ev-popover-fade-enter-active, .ev-popover-fade-leave-active {
        transition: opacity .2s;
    }
    .ev-popover-fade-enter, .ev-popover-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
  
</style>


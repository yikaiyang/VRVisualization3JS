<template>
    <transition name="ev-popover-fade">
        <div class="earthviewer-popover" v-show="isPopoverEnabled">
            <div class="title-header">
                <span class="title">{{
                    ((selectedItem || {} ).properties || {} ).Bezeichnung
                }}</span> 
            </div>
            
            <div class="content">
                <Histogram 
                    v-bind:id="selectedID" 
                    v-bind:selectedItem="selectedItem"
                    mappedProperty="Bettanzahl"/>                    
                <table style="color: white;">
                    <tr>
                        <td>ID:</td>
                        <td>{{
                            (selectedItem || {}).id
                        }}</td>
                    </tr>
                    <tr>
                        <td>Title:</td>
                        <td>{{
                            (selectedItem || {}).title
                        }}</td>
                    </tr>
                    <tr>
                        <td>Latitude:</td>
                        <td>{{
                            ((selectedItem || {}).position || {}).lat
                        }}</td>
                    </tr>
                    <tr>
                        <td>Longitude:</td>
                        <td>{{
                            ((selectedItem || {}).position || {}).lon
                        }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </transition>
</template>

<script>
import Histogram from './Histogram.vue'
export default {
    name: 'Popover',
    data: function(){
        return {
            isPopoverEnabled: false,
            selectedID: 0,
            selectedItem: {
                id: '1212',
                title: 'Allgemeines Krankenhaus',
                latitude: 42.3,
                longitude: 13.5
            }
        }
    },
    mounted: function(){
        EVENT_BUS.on('earthviewer:sceneSelectedItemChanged', (id) => {
            if (!!id){
                this.isPopoverEnabled = true;
                this.selectedID = id;

                //Get and set object with the retrieved id 
                if (!!window.DATA_STORAGE){
                    let object = window.DATA_STORAGE[id];
                
                    //TODO: Validate schema
                    this.selectedItem = object;
                }
            } else {
                //No item selected. Set visibility of popover to hidden.
                this.isPopoverEnabled = false;
            }
        });
    },
    components: {
        Histogram
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


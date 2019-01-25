
<template>
    <div v-bind:class="{hide: !debug}">
        <div id="billboard-html" ref="billboard">
            <h1>{{selectedItem.name}}</h1>
            <div id="billboard-container">
                <div id="left-segment">
                    <table style="color: white;">
                        <tr>
                            <td>ID:</td>
                            <td>{{selectedItem.id}}</td>
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
                <div id="right-segment">
                    <!--
                    <Histogram 
                        mappedProperty="Bettanzahl"
                        v-bind:height="140"
                        v-bind:width="380"
                        v-bind:id="selectedID"
                        v-bind:vrMode="true"></Histogram>-->
                </div>   
            </div>
        </div>

        <!-- canvas render target used for embedding texture on plane -->
        <canvas id="billboard-canvas" ref="canvas">
        </canvas>
    </div>

  
</template>

<script>
import Histogram from '../Histogram.vue'
import html2canvas from 'html2canvas'

export default {
    name: 'VRBillboard',
    props: {
        selectedItem: {
            type: Object,
            default: {
                name: 'Test',
                id: 12,
                title: 'test',
                latitude: 43.2,
                longitude: 32.0
            }
        },
        selectedID: {
            type: Number,
            default: 0
        },
        debug: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        selectedID: function(newValue, oldValue){
            //alert('selectedID changed:' + newValue);
            /* The selected item was changed.
             * -> Rerender the html element to the canvas so that the texture
             *  used in the VR billboard is updated
             */
            this.redrawBillboard();
        }
    },
    methods: {
        async redrawBillboard(){
            let canvasElement = this.$refs.canvas;
            let billboardElement = this.$refs.billboard;
              
            if (!!canvasElement){
                html2canvas(billboardElement, {
                    canvas: canvasElement,
                    async: true,
                    removeContainer: true
                });
            } else {
                console.warn('Could not update texture canvas. The referenced canvas element is null or undefined.');
            }
        }
    },
    components: {
        Histogram
    },
}
</script>

<style>
    .hide {
        position: absolute;
        top: -400px;
    }

    #billboard-html {
        position: absolute;
        height: 320px;
        width: 800px;
        background-color: #10151C;
        color: #E0E0E0;
        font-family: Arial, Helvetica, sans-serif;
        padding: 20px;
    }

    #billboard-html h1{
        color: #FFFFFF;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    #billboard-container {
        display: flex;
    }

    
    #left-segment {
        width: 40%;
        margin-top: 22px;
    }

    #right-segment {
        width: 60%;
        margin-left: 22px;
    }

    #billboard-canvas {
        position: absolute;
        height: 320px;
        width: 800px;
        z-index: 100;
    }

    #billboard-container table {
        width: 100%;
     
        font-size: 18px;
        /*max-width: 340px;*/
    }

    #billboard-container table td {
        color: #FFFFFF;
    }

    #billboard-container table td:last-child{
        text-align: right;
    }

    #billboard-container table td:first-child {
        color: #AFAFAF;
    }
  
</style>


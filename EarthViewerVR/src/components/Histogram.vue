<template>
    <div id="histogram">
        <span class="property-header">Property:</span>
        <p>
            <table style="color: white;">
                <tr>
                    <td style="color: white"> {{mappedProperty}}</td>
                    <td>{{mappedValue}}</td>
                </tr>
            </table>
        </p>
        <div id="histogram-svg-container" >
        </div>
    </div>
    
</template>

<script>
import * as d3 from 'd3'
import JSONUtil from '../util/json-util.js'
import { scaleQuantile } from 'd3';

export default {
    name: 'Histogram',
    props: {
        id: Number,
        selectedItem: {
            type: Object,
            default: null
        },
        mappedProperty: String,
        highlightColor: {
            type: String,
            default: '#E95720'
        },
        color: {
            type: String,
            default: '#37BAD0'
        }
    },
    data: function(){
        return {
            binCount: 25,
            histogramData: [],
            propertyPath: 'properties.Bettenanzahl',
            mappedValue: '',
            valueToBinScale: () => (null)
        }
    },
    mounted: function(){
        this.initialize();
    },
    watch: {
        id(newId, oldId) {
            if (!!this.selectedItem){
                //Retrieve the mapped value of the currently selected item.
                let mappedValue = JSONUtil.getProperty(this.selectedItem, this.$data.propertyPath);

                this.$data.mappedValue = mappedValue;
                
                //Calculate the associated bin index for the value.
                let binNumber = this.$data.valueToBinScale(mappedValue);
                
                //Remove all highlights
                this.removeHighlightColor();

                //Set a highlight color to the bin associated with the selected item value.
                this.highlightBinAtIndex(binNumber);
            }
        }
    },
    methods: {
        initialize(){
            /**
             * Wait 2s until data is loaded.
             * //TODO: implement event trigger which updates this component if the data has been loaded.
             */
            setTimeout(() => {
                this.$data.histogramData = this.getData(this.$data.propertyPath);
                this.renderHistogram(this.$data.binCount);
            }, 2000);
        },

        /**
         * Initializes histogram using d3 histogram
         */
        renderHistogram(binCount){
            var width = 280;
            var height = 100;
            var elementID = "#histogram-svg-container";

            let data = this.$data.histogramData || d3.range(1000).map(d3.randomNormal(550,50)); //Take 100 random normal distributed values;
            console.warn(data);

            var BIN_COUNT = binCount;
            var margin = {top: 20, right: 20, bottom: 20, left: 40};
            let color = this.color;
            
            //Determine max and min of dataset
            var max = d3.max(data);
            var min = d3.min(data);

            const BIN_WIDTH = 10; //x(bins[0].x1) - x(bins[0].x0) - 1 (take all available space - 1 px padding)
            const IS_ROUNDED = true;

            var thresholds = d3.range(min, max, (max - min ) / BIN_COUNT);
            var x = d3.scaleLinear()
                .domain([min, max])
                .range([0, width]);

            console.log(data);
            //Determine bins
            var bins = d3
                .histogram()
                .domain(x.domain())
                .thresholds(thresholds)
                (data);
            
            console.log(bins);
            
            //Determine y values. (d.length is number of array items in the classified bin)
            var yMax = d3.max(bins, (d) => (d.length));
            var yMin = d3.min(bins, (d) => (d.length));
            
            var histogramHeight = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);
            
            //Create svg element
            var svg = d3.select(elementID)
                .append("svg")
                .attr('id', 'histogram-svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            
            //Create different bars for the bins
            var bars = svg.selectAll("g.bar")
            .data(bins)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", function(d) {
                return "translate(" + (x(d.x0) + margin.left) + "," + histogramHeight(d.length) + ")";
            });
            
            //Maps the y value to a color scheme
            var colorScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([d3.rgb(color).darker(), d3.rgb(color).brighter()]);
            
            //Create the rectangular shapes of the bin
            bars.append("rect")
            .attr("fill", (d) => (colorScale(d.length)))
            .attr('rx', BIN_WIDTH / 2)
            .attr('ry', BIN_WIDTH / 2)
            .attr("width", BIN_WIDTH) 
            .attr("height", function(d) {
                return height - histogramHeight(d.length);
            });

            var scaleQuantize = d3.scaleQuantize()
                .domain(x.domain())
                .range(_.range(1,this.$data.binCount + 1));

            this.$data.valueToBinScale = scaleQuantize;

            //Add bottom axis
            var axis = d3
                .axisBottom(x)
                .ticks(8);
            svg.append('g')
                .attr('class', 'bottomAxis')
                .attr('transform', 'translate(' + margin.left + ',' + height + ')')
                .call(axis);

            //Add left axis
            var axisLeft = d3
                .axisLeft(histogramHeight)
                .ticks(5);
            svg.append('g')
                .attr('class', 'leftAxis')
                .attr('transform', 'translate('+ margin.left+ ',0) ')
                .call(axisLeft);

        },
        /**
         * Retrieves an array of the Property from the data storage
         * TODO: get an identifier via event bus and load data from the data storage subsequently
         */
        getData(mappedProperty){
            let dataArray = window.DATA_STORAGE;
            let result;
            if (!!dataArray){
                result = JSONUtil.extractPropertiesFromArrayAsList(dataArray,mappedProperty)
            }
            return result;
        },
        highlightBinAtIndex(index){
            var binRectangle = document.querySelector('#histogram-svg .bar:nth-child(' + index +') rect:not(.selected)');
            if (!!binRectangle){
                var initialColor = binRectangle.getAttribute('fill'); 
                binRectangle.setAttribute('fill', '#E95720');
                binRectangle.setAttribute('initialColor', initialColor);
                binRectangle.setAttribute("class", "selected");
            }
        },
        removeHighlightColor(){
            var selectedRects = document.querySelectorAll('#histogram-svg .bar .selected');
            selectedRects.forEach((rect) => {
                rect.removeAttribute('class');
                let initialColor = rect.getAttribute('initialColor'); 
                rect.setAttribute('fill', initialColor);
            });
        }
    }
}
</script>

<style>

    .property-header{
        font-size: 10px;
        color: #AFAFAF;
        font-weight: bold;
        text-transform: uppercase;
    }

    /**
     * See styling reference: https://bl.ocks.org/d3noob/629790fc15cc1afba0253f29a4d246e7
    */
    .bottomAxis text{
        fill: #B7B7B7;
    }

    .bottomAxis path {
        visibility: hidden;
    }
            
    .bottomAxis line {
        visibility: hidden;
    }

    /**
     * Left axis
     */

    .leftAxis text{
        font-weight: bold;
        fill: rgb(226, 226, 226);
    }

    .leftAxis path {
        visibility: hidden;
    }
            
    .leftAxis line {
        stroke: #515151;
    }
</style>

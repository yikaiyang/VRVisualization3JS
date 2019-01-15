import * as d3 from 'd3'
import _ from 'lodash'

export default function createHistogram(
    {
        htmlElementID = "#histogram-svg-container", 
        height = 100, 
        width = 280, 
        binCount = 25, 
        histogramData = null,
        color = '#37BAD0'
    })
{
    let data = histogramData || d3.range(1000).map(d3.randomNormal(550,50)); //Take 100 random normal distributed values;

    console.debug('Created histogram with data: ' + data);

    var margin = {top: 20, right: 20, bottom: 20, left: 40};
    
    //Determine max and min of dataset
    var max = d3.max(data);
    var min = d3.min(data);

    const BIN_WIDTH = 10; //x(bins[0].x1) - x(bins[0].x0) - 1 (take all available space - 1 px padding)

    var thresholds = d3.range(min, max, (max - min ) / binCount);
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
    var svg = d3.select(htmlElementID)
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
        .range(_.range(1, binCount + 1));

    var valueToBinScale = scaleQuantize;

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

    /**
     * Apply styling of axis elements manually.
     * This is needed since html2canvas does not support css (currentColor) styling
     * and renders axes in the default color. (black)
     */
    //Make axis line hidden

/*     let domain = d3.selectAll('.domain')
    domain.attr('opacity', '0.0');

    let text = d3.selectAll('.bottomAxis text');
    text.attr('fill', '#A0A0A0');
    text.attr('font-size', '16');
    text.attr('font-weight', 'bold')

    let line = d3.selectAll('.bottomAxis line');
    line.attr('opacity', '0.0')

    //Left axis
    text = d3.selectAll('.leftAxis text');
    text.attr('fill', '#FFFFFF');
    text.attr('font-size', '16');
    text.attr('font-weight', 'bold')

    line = d3.selectAll('.leftAxis line');
    line.attr('stroke', '#FFFFFF');
    line.attr('stroke-width', '2');*/
}
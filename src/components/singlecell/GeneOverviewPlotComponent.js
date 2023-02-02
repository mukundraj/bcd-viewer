
import { useD3 } from '../../hooks/useD3';
import * as d3 from 'd3';
import {useState, useEffect, useCallback} from 'react';

import './GeneOverviewPlotComponent.css';

function GeneOverviewPlot({downsampledData, numCols}) {

  // create a state variable called data
  const [prepedData, setPrepedData] = useState([]);

  // write a function to compute histogram for an array of data without d3 and also return bin boundaries
  function histogram(data, numBins) {
    let min = d3.min(data);
    let max = d3.max(data);
    let binSize = (max - min) / (numBins);
    let bins = [];
    let binBoundaries = [];
    for (let i = 0; i < numBins+1; i++) {
      bins.push(0);
      binBoundaries.push(min + i * binSize);
    }
    binBoundaries.push(max);
    for (let i = 0; i < data.length; i++) {
      let binIndex = Math.floor((data[i] - min) / binSize);
      bins[binIndex]++;
    }
    return [bins, binBoundaries, binSize];
  }

  useEffect(() => {

      // d[0] is pct and d[1] is avg
    // let dataTmp = downsampledData.map((d,i)=>{return {x: d[0], y: d[1], xx: d[0]}});
    let dataTmp = downsampledData;
      setPrepedData(dataTmp);

  }, [downsampledData]);

  const ref = useD3(
    (svg) => {
      // console.log(props.data);

      // const height = 100;
      // const width = 500;
      let element = svg.node();
      const margin = { top: 0, right: 0, bottom: 15, left: 0 };
      const height = element.getBoundingClientRect().height - margin.top - margin.bottom;
      const width = element.getBoundingClientRect().width - margin.left - margin.right;
      let data = prepedData;
      // let data = [{ct: 10}, {ct: 10}, {ct: 30}, {ct:20},{ct:25}]

      let maxDataVal = d3.max(data, (d) => +d);
      var x = d3.scaleLinear()
        .domain([0, 1+maxDataVal])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);


      let numBins = 50;
      let [bins, binBoundaries, binWidth] = histogram(data, numBins);
      // check if binWidth is not NaN
      
      if (bins.length>1 && !isNaN(binWidth)) {

        // remove all elements in current svg
        svg.selectAll("*").remove();

        // Add a background color
        svg.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "#F0F3F4");

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
          .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d })]);   // d3.hist has to be called before the Y axis obviously

        const index = d3.local(); // get index in event - https://stackoverflow.com/questions/64910052/d3-js-v6-2-get-data-index-in-listener-function-selection-onclick-listene
        // svg.append("g")
        //   .call(d3.axisLeft(y));
        // append the bar rectangles to the svg element
        svg.selectAll(".opbars")
          .append("rect")
          .data(bins)
          .enter()
          .append("rect")
          .attr("x", 1)
          .attr("transform", function(d,i) {return "translate(" + x(binBoundaries[i]) + "," + y(d) + ")"; })
          .attr("width", function(d) { return x(binWidth) })
          .attr("height", function(d) { return height - y(d); })
          .style("fill", "steelblue")
          .each(function(d, i) {
            index.set(this, i);            // Store index in local variable.
          })
          .on('mouseover', function (event, dat) {
            d3.select(this).transition()
                  .duration('100')
                  .attr("r", 7);
            div.transition()
                 .duration(100)
                 .style("opacity", 1);
            div.html("freq: " + dat+'<br/>logcnt: ' + binBoundaries[index.get(this)].toFixed(2)+' to '+binBoundaries[index.get(this)+1].toFixed(2))
                 // .style("left",  String(parseFloat(svgTopLeft.x)+parseFloat(d3.select(this).attr("cx"))) + "px")
                 // .style("top",  String(parseFloat(svgTopLeft.y)+parseFloat(d3.select(this).attr("cy"))) + "px")
              .style("left", event.x + "px")
              .style("top",  event.y + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('200')
                 .attr("r", 1.5);
            div.transition()
                 .duration('200')
                 .style("opacity", 0);
        });

        svg.append("g")
          .style("font", "9px sans-serif")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .tickValues([1, maxDataVal/2,maxDataVal]));

        // if ever a line plot is needed
        // svg.append("path")
        //   .datum(bins)
        //   .attr("fill", "none")
        //   .attr("stroke", "steelblue")
        //   .attr("stroke-width", 1.5)
        //   .attr("d", d3.line()
        //     .x(function(d,i) { return x(binBoundaries[i]) })
        //     .y(function(d) { return y(d) })
        //   )

        // get top left corner of svg element
        // let svgTopLeft = svg.node().getBoundingClientRect(); // need replaced by 'element' argument below

        var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        // svg.append('g')
        //   .selectAll("dot")
        //   .data(data)
        //   .enter()
        //   .append("circle")
        //   .attr("cx", function (d) { return x(d.x); } )
        //   .attr("cy", function (d) { return y1(d.y); } )
        //   .attr("r", 1.5)
        //   .style("fill", "steelblue")
        //   .on('mouseover', function (event, dat) {
        //     d3.select(this).transition()
        //           .duration('100')
        //           .attr("r", 7);
        //     div.transition()
        //          .duration(100)
        //          .style("opacity", 1);
        //     div.html("avg:" + d3.format(".2f")(dat.y) + "<br/>" + "pct:" + d3.format(".2f")(dat.x*100) + "%")
        //          // .style("left",  String(parseFloat(svgTopLeft.x)+parseFloat(d3.select(this).attr("cx"))) + "px")
        //          // .style("top",  String(parseFloat(svgTopLeft.y)+parseFloat(d3.select(this).attr("cy"))) + "px")
        //       .style("left", event.x + "px")
        //       .style("top",  event.y + "px")
        // })
        // .on('mouseout', function (d, i) {
        //     d3.select(this).transition()
        //          .duration('200')
        //          .attr("r", 1.5);
        //     div.transition()
        //          .duration('200')
        //          .style("opacity", 0);
        // });
        // 
      }

    }, [prepedData]

  );


  return (
    <div className="outer" style={{position:"static"}}>
      <svg
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );

}





export default GeneOverviewPlot;

// modified and adapted from - https://medium.com/@kj_schmidt/hover-effects-for-your-scatter-plot-447df80ea116
// https://d3-graph-gallery.com/graph/histogram_basic.html

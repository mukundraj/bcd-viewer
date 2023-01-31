
import { useD3 } from '../../hooks/useD3';
import * as d3 from 'd3';
import {useState, useEffect, useCallback} from 'react';


function GeneOverviewPlot({downsampledData, numCols}) {

  // create a state variable called data
  const [prepedData, setPrepedData] = useState([]);


  useEffect(() => {

      // d[0] is pct and d[1] is avg
      let dataTmp = downsampledData.map((d,i)=>{return {x: d[0], y: d[1]}});
      setPrepedData(dataTmp);

  }, [downsampledData]);

  const ref = useD3(
    (svg) => {
      // console.log(props.data);

      // const height = 100;
      // const width = 500;
      let element = svg.node();
      const height = element.getBoundingClientRect().height;
      const width = element.getBoundingClientRect().width;
      const margin = { top: 0, right: 0, bottom: 0, left: 0 };
      
      let data = prepedData;

      // find domain of data for x and y
      let xDomain = d3.extent(data, (d) => d.x); 
      let yDomain = d3.extent(data, (d) => d.y);

      const x = d3
        .scaleLinear()
        .domain(xDomain)
        // .range([margin.left, width - margin.right]);
        .range([width - margin.right, margin.left]);

      const y1 = d3
        .scaleLinear()
        .domain(yDomain)
        .range([height - margin.bottom, margin.top]);


      // Add a background color
      svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#F0F3F4");

      // if ever a line plot is needed
      // svg.append("path")
      //   .datum(data)
      //   .attr("fill", "none")
      //   .attr("stroke", "steelblue")
      //   .attr("stroke-width", 1.5)
      //   .attr("d", d3.line()
      //     .x(function(d) { return x(d.x) })
      //     .y(function(d) { return y1(d.y) })
      //   )

      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y1(d.y); } )
        .attr("r", 1.5)
        .style("fill", "steelblue")

    }, [prepedData, numCols]

  );


  return (
    <div className="outer">
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

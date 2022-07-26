import '../css/FrequencyBars.css';
import { useD3 } from '../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import {useStore} from '../store/store'


function FrequencyBars({ setPuckidAndLoadStatus, data, activeDataName}) {


  const carouselRef = useStore(state => state.carouselRef);
  function bar_click_handler(event, d){
    // alert("test"+event+" "+d.sr+" "+d.key[0]);
    setPuckidAndLoadStatus(d.key[0]);
    carouselRef.current.goToSlide(d.sr);
    
  }

  const ref = useD3(
    (svg) => {

      console.log(data);

      // const height = 100;
      // const width = 500;
      let element = svg.node();
      const height = element.getBoundingClientRect().height;
      const width = element.getBoundingClientRect().width;
      const margin = { top: 0, right: 30, bottom: height*0.3, left: 10 };

      let bandwidth = width/(data[activeDataName].length+2);

      const x = d3
        // .scaleBand()
        .scaleLinear()
        // .domain(data[active_data_name].map((d) => d.key[0]))
        .domain(d3.extent(data[activeDataName].map((d,i) => i)))
        .range([margin.left, width - margin.right]);
        // .padding(0.1);

      const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(data[activeDataName], (d) => parseInt(d.cnt))])
        .rangeRound([height - margin.bottom, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
          .tickValues( data[activeDataName].map((d,i)=>(i+0.5)))
            .tickFormat((d,i)=>{if ('nm' in data[activeDataName][i]){return data[activeDataName][i].nm}else{return ""}})
            .tickSizeOuter(0)
            .tickSizeInner(0)
        );

      // const y1Axis = (g) =>
      //   g
      //     .attr("transform", `translate(${margin.left},0)`)
      //     .style("color", "steelblue")
      //     .call(d3.axisLeft(y1).ticks(null, "s"))
      //     .call((g) => g.select(".domain").remove())
      //     .call((g) =>
      //       g
      //         .append("text")
      //         .attr("x", -margin.left)
      //         .attr("y", 10)
      //         .attr("fill", "currentColor")
      //         .attr("text-anchor", "start")
      //         .text(data.y1)
      //     );

      svg.select(".x-axis").call(xAxis);
      // svg.select(".y-axis").call(y1Axis);

      var div = d3.select("body").append("div")
        .attr("class", "fbar_tooltip")
        .style("opacity", 0);

      let bars = svg
        .select(".plot-area")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(data[activeDataName]);
        
      bars.join("rect")
        .on("click", (event, i)=>bar_click_handler(event, i))
        .attr("class", "bar")
        .style("position", "absolute")
      // .attr("x", (d) => x(parseInt(d.key[0])))
        .attr("x", (d,i) => x(i))
        // .attr("width", x.bandwidth())
        .attr("width", bandwidth)
        .attr("y", (d) => y1(d.cnt))
        .attr("height", (d) => y1(0) - y1(d.cnt))
        .on("mouseover", function(event,d) {
          d3.select(this).style("fill","red");
          div.transition()
            .duration(200)
            .style("opacity", .9);
          if ('nm' in d){
            div.html(d.nm+",pid:"+d.key[0]+" cnt:"+d.cnt + "<br/>")
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 40) + "px");

          }else{
            div.html("pid:"+d.key[0]+", cnt:"+d.cnt + "<br/>")
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 40) + "px");
          }
        })
        .on("mouseout", function() {
          d3.select(this).style("fill","steelblue");
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

    },
    [data, activeDataName]
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

export default FrequencyBars;

// https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
// https://stackoverflow.com/questions/23703089/d3-js-change-color-and-size-on-line-graph-dot-on-mouseover

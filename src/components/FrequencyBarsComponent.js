import '../css/FrequencyBars.css';
import { useD3 } from '../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import {useStore} from '../store/store'
import {pidToSrno} from "../shared/common"
import {useWindowSize} from '../hooks/useWindowSize';


function FrequencyBars(props) {

  // const fbarActiveDataName = useStore(state => state.fbarActiveDataName);
  // const setFbarActiveDataName = useStore(state => state.setFbarActiveDataName);
  const fbarActiveDataName = props.fbarActiveDataName;
  // const chosenPuckid = useStore(state => state.chosenPuckid);
  const toggleGeneralToggleFlag = useStore(state => state.toggleGeneralToggleFlag);
  const setTogglePid = useStore(state => state.setTogglePid);

  const {widthWin, heightWin} = useWindowSize();

  // const carouselRef = useStore(state => state.carouselRef);
  function bar_click_handler(event, d){
    // alert("test"+event+" "+d.sr+" "+d.key[0]);
    // console.log("chosen ", chosenPuckid);
    // props.setPuckidAndLoadStatus(d.key[0]);
    // carouselRef.current.goToSlide(d.sr);
    setTogglePid(d.key[0]);
    toggleGeneralToggleFlag();
  }

  const ref = useD3(
    (svg) => {

      console.log(props.data);

      // const height = 100;
      // const width = 500;
      let element = svg.node();
      const height = element.getBoundingClientRect().height;
      const width = element.getBoundingClientRect().width;
      const margin = { top: 0, right: 30, bottom: height*0.3, left: 10 };

      let bandwidth = width/(props.data[fbarActiveDataName].length+2);

      const x = d3
        // .scaleBand()
        .scaleLinear()
        // .domain(data[active_data_name].map((d) => d.key[0]))
        .domain(d3.extent(props.data[fbarActiveDataName].map((d,i) => i)))
        .range([margin.left, width - margin.right]);
        // .padding(0.1);

      const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(props.data[fbarActiveDataName], (d) => d.cnt)])
        .rangeRound([height - margin.bottom, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
          .tickValues(props.data[fbarActiveDataName].map((d,i)=>(i+0.5)))
            .tickFormat((d,i)=>{if ('nm' in props.data[fbarActiveDataName][i]){return props.data[fbarActiveDataName][i].nm}else{return ""}})
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
        .data(props.data[fbarActiveDataName]);
        
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
            div.html(d.nm+",pid:"+pidToSrno[d.key[0]]+" cptkp:"+d.cnt + "<br/>")
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 40) + "px");

          }else{
            div.html("pid:"+pidToSrno[d.key[0]]+", cptkp:"+d.cnt + "<br/>") //cptkp=counts per 10k all gene counts in puck
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
    [props.data, fbarActiveDataName, widthWin]
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

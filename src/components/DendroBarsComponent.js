import '../css/FrequencyBars.css';
import { useD3 } from '../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import {useStore, usePersistStore} from '../store/store'
import {srnoToPid} from "../shared/common"
import { useEffect, useState } from 'react';
import {getUrl} from "../shared/common"
import {useWindowSize} from '../hooks/useWindowSize';
import useGetDendroBars from '../hooks/useGetDendroBars';

function DendroBars(props){

  // const fbarActiveDataName = useStore(state => state.fbarActiveDataName);
  // const setFbarActiveDataName = useStore(state => state.setFbarActiveDataName);
  // const chosenPuckid = useStore(state => state.chosenPuckid);
  const toggleGeneralToggleFlag = useStore(state => state.toggleGeneralToggleFlag);
  const setTogglePid = useStore(state => state.setTogglePid);
  // const [regionwiseData, setRegionwiseData] = useState(null);
  const regionwiseData = usePersistStore(state => state.regionwiseData);
  const setRegionwiseData = usePersistStore(state => state.setRegionwiseData);
  const curSrno = props.curSrno;
  const {widthWin, heightWin} = useWindowSize();

  const carouselRef = useStore(state => state.carouselRef);
  function bar_click_handler(event, d){
    console.log(srnoToPid);
    console.log(d.sr,srnoToPid[d.sr])
    setTogglePid(srnoToPid[d.sr]);
    toggleGeneralToggleFlag();
  }
  const dendroBarData = usePersistStore(state => state.dendroBarData);
  let data = dendroBarData.map((x,i)=>{return {"sr":i+1, "cnt":x}});

  const chosenGene = usePersistStore(state => state.chosenGene);
  const selectedRegIds = usePersistStore(state => state.selectedRegIds);
  const setDendroBarData = usePersistStore(state => state.setDendroBarData);

  const dendroBarDataDict = useGetDendroBars({dendroBarsFullPath: props.dendroBarsFullPath, geneName: chosenGene[0], selectedRegIds: selectedRegIds});

  useEffect(()=>{
    if (dendroBarDataDict.curRegionwiseData && dendroBarDataDict.curDendroBarData){
      setRegionwiseData(dendroBarDataDict.curRegionwiseData); // regionwise counts
      setDendroBarData(dendroBarDataDict.curDendroBarData); // counts aggregated over selected regions
    }

  }, [setDendroBarData.curRegionwiseData, dendroBarDataDict.curDendroBarData]);


  const ref = useD3(
    (svg) => {

      // console.log(dendroBarData);


      // const height = 100;
      // const width = 500;
      let element = svg.node();
      const height = element.getBoundingClientRect().height;
      const width = element.getBoundingClientRect().width;
      const margin = { top: 0, right: 30, bottom: height*0.3, left: 10 };

      let bandwidth = width/(data.length+2);

      const x = d3
        // .scaleBand()
        .scaleLinear()
        // .domain(data[active_data_name].map((d) => d.key[0]))
        .domain(d3.extent(data.map((d,i) => i)))
        .range([margin.left, width - margin.right]);
        // .padding(0.1);

      const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => parseFloat(d.cnt))])
        .rangeRound([height - margin.bottom, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
          .tickValues(data.map((d,i)=>(i+0.5)))
            .tickFormat((d,i)=>"")
            .tickSizeOuter(0)
            .tickSizeInner(0)
        );

      // clear the fbar tooltip
      d3.select("#fbt2").remove();
      
      // remove all bars before drawing new ones
      svg
        .select(".plot-area2")
        .selectAll(".bar")
        .remove();

      svg.select(".x-axis").call(xAxis);
      // svg.select(".y-axis").call(y1Axis);

      var div = d3.select("body").append("div")
        .attr("class", "fbar_tooltip")
        .attr("id", "fbt2")
        .style("opacity", 0);

      const index = d3.local();

      let bars = svg
        .select(".plot-area2")
        // .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(data);
        
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
        .attr("fill", (d,i) => { return ((i+1) === curSrno) ? "red" : "steelblue"})
        .each(function(d,i) { index.set(this, i); })
        .on("mouseover", function(event,d) {
          d3.select(this).style("fill","red");
          div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html("pid:"+d.sr+", cptkr:"+d.cnt + "<br/>") //cptk=counts per 10k all gene counts in region
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 40) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).style("fill",()=>{ return ((index.get(this)+1) === curSrno) ? "red" : "steelblue"});
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

    },
    [data, widthWin, curSrno]
  );


  return(
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
        <g className="plot-area2" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default DendroBars;

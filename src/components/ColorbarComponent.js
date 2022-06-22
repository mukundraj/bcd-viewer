import useStore from '../store/store'
import {useEffect,useState, useRef} from 'react'
import {interpolateViridis} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'

function Colorbar(props){


  // const [currentColorMap, setCurrentColorMap] = useState(() => interpolateViridis); 
  // const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  const currentColorMap = useStore(state => state.currentColorMap);
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);
  const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  const svgRef = useRef(null);


  useEffect(()=>{
    async function drawColorbar(){
      const d3 = await import("d3");
      // d3.selectAll("svg > *").remove();

      // console.log(maxUmiThreshold);
      // let linear = d3.scaleLinear()
      //   .domain([0, 0.01, maxUmiThreshold/2, maxUmiThreshold])
      //   .range([d3.color("#aaaaaa40").formatRgb(), 
      //   d3.color(interpolateViridis(1)).formatRgb(), 
      //   d3.color(interpolateViridis(0.5)).formatRgb(),
      //   d3.color(interpolateViridis(0.0)).formatRgb()]);

      let logColorScale = d3.scaleLog()
        .domain([0.0001, 0.01, 0.25*maxUmiThreshold, 0.5*maxUmiThreshold, 0.75*maxUmiThreshold, maxUmiThreshold])
        .range([ 
        d3.color("#aaaaaa").formatRgb(),   
        d3.color(interpolateViridis(1)).formatRgb(),   
        d3.color(interpolateViridis(0.75)).formatRgb(),   
        d3.color(interpolateViridis(0.5)).formatRgb(),
        d3.color(interpolateViridis(0.25)).formatRgb(),
        d3.color(interpolateViridis(0.0)).formatRgb()]);

      let currentColorMap = function(val){
        if (val===0){
          return d3.color("#aaaaaa").formatRgb();
        }else{
          return logColorScale(val);
        }
      }
      // linear.domain = logColorScale.domain;

      setCurrentColorMap(currentColorMap);

       const svgEl = d3.select(svgRef.current);
       svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
      const svg = svgEl.append("g")

      svg
        .style("position", "absolute")
        .style("left", "2%")
        .style("top", "2%");
      svg.append("g")
        .attr("class", "legendLinear")
      // .attr("transform", "translate(90,20)");

      var legendLinear = legendColor()
        .shapeWidth(17)
        .cells(15)
        .orient('horizontal')
        .scale(logColorScale);

      svg.select(".legendLinear")
        .call(legendLinear);

      svg.selectAll(".cell .label").attr("font-size", "8");

    }
    drawColorbar();

  }, [maxUmiThreshold]);

  return(
    <>
      <svg ref={svgRef} width="90%" height="35px"/>
    </>
  );
}

export default Colorbar;

// References
// https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/

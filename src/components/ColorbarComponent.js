import useStore from '../store/store'
import {useEffect,useState, useRef} from 'react'
import {interpolatePlasma} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'

function Colorbar(props){


  // const [currentColorMap, setCurrentColorMap] = useState(() => interpolatePlasma); 
  // const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  // const currentColorMap = useStore(state => state.currentColorMap);
  // const setCurrentColorMap = useStore(state => state.setCurrentColorMap);
  // const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  const setCurrentColorMap = props.setCurrentColorMap;
  const maxVal = props.max;
  const svgRef = useRef(null);


  useEffect(()=>{
    async function drawColorbar(){
      const d3 = await import("d3");
      // d3.selectAll("svg > *").remove();

      // console.log(maxUmiThreshold);
      // let linear = d3.scaleLinear()
      //   .domain([0, 0.01, maxUmiThreshold/2, maxUmiThreshold])
      //   .range([d3.color("#aaaaaa40").formatRgb(), 
      //   d3.color(interpolatePlasma(1)).formatRgb(), 
      //   d3.color(interpolatePlasma(0.5)).formatRgb(),
      //   d3.color(interpolatePlasma(0.0)).formatRgb()]);

      let logColorScale = d3.scaleLog()
        .domain([0.0001, 0.01, 0.2*maxVal, 0.4*maxVal, 0.6*maxVal, 0.8*maxVal, maxVal])
        .range([ 
        d3.color("#aaaaaa").formatRgb(),   
        d3.color(interpolatePlasma(1.0)).formatRgb(),   
        d3.color(interpolatePlasma(0.8)).formatRgb(),   
        d3.color(interpolatePlasma(0.6)).formatRgb(),   
        d3.color(interpolatePlasma(0.4)).formatRgb(),
        d3.color(interpolatePlasma(0.2)).formatRgb(),
        d3.color(interpolatePlasma(0.0)).formatRgb()
        ]).interpolate(d3.interpolateRgb.gamma(2.2)); // https://observablehq.com/@d3/working-with-color

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
        .shapeWidth(props.barWidth)
        .cells(props.cells)
        .orient('horizontal')
        .scale(logColorScale);

      svg.select(".legendLinear")
        .call(legendLinear);

      svg.selectAll(".cell .label").attr("font-size", "8");

    }
    drawColorbar();

  }, [maxVal]);

  return(
    <>
      <span style={props.style}><svg ref={svgRef} width="100%" height="35px"/></span>
    </>
  );
}

// Set default props
Colorbar.defaultProps = {
  barWidth: 18,
};

export default Colorbar;

// References
// https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/
// https://blog.logrocket.com/complete-guide-react-default-props/

import React from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import "../css/DualSlider.css"

const DualSlider = ({maxUmiThreshold, setUmiLowerThreshold, setUmiUpperThreshold}) => {

   function onSlide(render, handle, value, un, percent){
     setUmiLowerThreshold(value[0]);
     setUmiUpperThreshold(value[1]);
  };
  return(
    <>
      <div class="slider-styled" id="slider-round">
        <Nouislider range={{ min: 0, max: maxUmiThreshold }} start={[1, maxUmiThreshold]} connect={[false,true,false]} 
          onSlide={onSlide}
          tooltips={[true, true]}
          step={maxUmiThreshold>2?1:maxUmiThreshold/100}
        />
      </div>
    </>
  )
};

export default DualSlider;

// https://github.com/leongersen/noUiSlider/issues/836

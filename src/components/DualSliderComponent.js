import React from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import "../css/DualSlider.css"

const DualSlider = ({maxThreshold, upperThreshold, lowerThreshold, setUmiLowerThreshold, setUmiUpperThreshold}) => {

   function onSlide(render, handle, value, un, percent){
     setUmiLowerThreshold(value[0]);
     setUmiUpperThreshold(value[1]);
  };
  return(
    <>
      <div className="slider-styled" id="slider-round">
        <Nouislider range={{ min: 0, max: maxThreshold }} start={[lowerThreshold, upperThreshold]} connect={[false,true,false]} 
          onSlide={onSlide}
          tooltips={[true, true]}
          step={upperThreshold>2?1:upperThreshold/100}
        />
      </div>
    </>
  )
};

export default DualSlider;

// https://github.com/leongersen/noUiSlider/issues/836

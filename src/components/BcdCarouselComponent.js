import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from 'react-bootstrap/Image'
import { useEffect, useState, useRef} from 'react'

function BcdCarousel(props){
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 9,
    slidesToSlide: 7 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 9,
    slidesToSlide: 7 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  }
};

  let nis_ids = Array(104).keys();
  let nis_idxs = Array.from(nis_ids, x => String(2*x+1).padStart(3,'0'));
  let forDeletion = ['005', '077', '167'];
  nis_idxs = nis_idxs.filter( item => !forDeletion.includes(item));
  let img_paths = Array.from(nis_idxs, x => 'https://storage.googleapis.com/ml_portal/public/transformed_lowres/nis_'+x+'.jpg');
  let images = img_paths.map((x, idx)=>{
  
    let nissl_id = parseInt(nis_idxs[idx]);
  return(
    <div key={idx} className="slide" style={{position: "relative", cursor: "pointer"}} onClick={() => props.setChosenPuckid(nissl_id)}>
      <span style={{position: "absolute", fontSize: "70%"}}>{nis_idxs[idx]}</span>
      <Image 
        src = {x}
        style={{  width: "100%", height: "100%" }}
        alt=''
        className={`${nissl_id===props.chosenPuckid ? "border border-danger":""}`}
      />
    </div>
  )
});

  const carouselRef = useRef();

return (
  <>
<Carousel
  ref={carouselRef}
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  ssr={false} // means to render carousel on server-side.
  infinite={false}
  autoPlay={false}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["mobile"]}
  // deviceType="desktop"
  // dotListClass="custom-dot-list-style"
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
>
  {images}
</Carousel>
    <button onClick={() => {
    const nextSlide = carouselRef.current.state.currentSlide + 1;
     // carouselRef.current.next()
     // carouselRef.current.goToSlide(nextSlide)
     carouselRef.current.goToSlide(20);
  }}>Click</button>
  </>
)
}

export default BcdCarousel; 

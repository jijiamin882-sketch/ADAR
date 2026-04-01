import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "./Residencies.css";
import { sliderSettings } from "../../utils/common";
import PropertyCard from "../PropertyCard/PropertyCard";
import useProperties from "../../hooks/useProperties";
import {PuffLoader} from 'react-spinners'

/*const Residencies = () => {

  const {data, isError, isLoading} = useProperties()

  if(isError){
    return(
      <div className='wrapper'>
        <span> حدث خطأ أثناء جلب البيانات</span>
      </div>
    )
  }

  if(isLoading){
    return(
      <div className="wrapper flexCenter" style={{height: "60vh"}}>
        <PuffLoader
        height="80"
        width="80"
        radius={1}
        color="#4066ff"
        aria-label="puff-loading"
        />
      </div>
    )
  }


  return (
    

     <div id="residencies" className="r-wrapper" style={{}}>
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head" style={{ alignItems: "center", textAlign: "center"  }}>
             
          <span className="orangeText" style={{ fontSize: "40px" }}> الخيارات المتاحة </span>
           
      
        </div>
        <Swiper {...sliderSettings}>
          <SlideNextButton />
          {/* slider *
          {data.slice(0, 8).map((card, i) => (
            <SwiperSlide key={i}>
              <PropertyCard card={card}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
     </div>
     
  );
};

export default Residencies;

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};
*/
 
 

 



// 8 عناصر لتعبئة الشبكة بشكل جميل (2 صفوف)
const dummyData = [
  { id: 1, title: 'المنازل الجديدة', price: '376', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80' },
  { id: 2, title: 'الشقق الفاخرة', price: '121', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: 3, title: 'الفيلات العائلية', price: '85', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80' },
  { id: 4, title: 'الأراضي السكنية', price: '42', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
  { id: 5, title: 'شقق الاستوديو', price: '210', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { id: 6, title: 'عقارات تجارية', price: '54', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { id: 7, title: 'مجمعات سكنية', price: '163', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
  { id: 8, title: 'بيوت العطلات', price: '98', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' }
];




const Residencies = () => {
  return (
    <div id="residencies" className="r-wrapper">
      <div className="r-container">
        
        <div className="r-head">
          <span>الخيارات المتاحة</span>
        </div>

        {dummyData.map((card) => (
          <div className="realtor-card" key={card.id}>
            <img src={card.image} alt={card.title} />
            <div className="realtor-overlay"></div>
            
            <div className="realtor-content">
              <h3 className="realtor-title">{card.title}</h3>
            </div>
            
            {/* الرقم في الخلفية */}
            <span className="realtor-number">{card.price}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Residencies;
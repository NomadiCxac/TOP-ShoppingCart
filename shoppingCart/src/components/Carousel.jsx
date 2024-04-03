// import { useState } from 'react';
// import resolveImageUrl from '../functions/resolveImageUrl';
// import './Carousel.css';

// const Carousel = ({ items }) => {
//     const [activeIndex, setActiveIndex] = useState(0);
//     const filteredImageUrls = Object.keys(items)
//         .filter(key => {
//             const item = items[key];
//             return item.quantity > 0 || item.halfDozenQuantity > 0 || item.dozenQuantity > 0;
//         })
//         .map(key => resolveImageUrl(items[key].id));


//     const nextSlide = () => {
//         setActiveIndex(prevIndex => (prevIndex === filteredImageUrls.length - 1 ? 0 : prevIndex + 1));
//     };

//     const prevSlide = () => {
//         setActiveIndex(prevIndex => (prevIndex === 0 ? filteredImageUrls.length - 1 : prevIndex - 1));
//     };

//     return (
//         <div className="carousel">
//             <button onClick={prevSlide} className="carousel__btn carousel__btn--prev">&lt;</button>
//             {filteredImageUrls.length > 0 && (
//                 <img
//                     src={filteredImageUrls[activeIndex]}
//                     alt={`Slide ${activeIndex}`}
//                     className="carousel__img"
//                 />
//             )}
//             <button onClick={nextSlide} className="carousel__btn carousel__btn--next">&gt;</button>
//         </div>
//     );
// };

// export default Carousel;
import React from 'react'
import ProductSlider from '../products/ProductSlider';


const BestSeller = () => {
  return (
    <section className='sec_best_seller py-6 md:py-10 '>
      <div className='container max-w-sitemax px-4 mx-auto '>
        <h2 className='text-3xl md:text-5xl font-bold text-center mb-10'>Best Seller</h2>
        <div className="products_slider">
          <ProductSlider />
        </div>
      </div>
    </section>
  )
}

export default BestSeller
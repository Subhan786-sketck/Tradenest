import React from 'react';

function Hero() {
  return (
    <React.Fragment>
      <div className='container p-5 mb-5'>
        <div className='row text-center'>
        
         <img src='media/images/hero.png' alt='Hero Image' className='mb-1'/>
         <h3>TradeNest is a modern trading platform inspired by professional brokers. It provides tools, analytics, and seamless trading experiences for investors.</h3>
         <h1 className='mt-5'>Invest in everything</h1>
         <p>Start your investment journey with us today.</p>
         
        </div>
      </div>
    </React.Fragment>
  );
}

export default Hero;

import React from 'react';
import Hero from './Hero';
import Awards from './Awards';
import Stats from './stats';
import Education from './Education';
import Pricing from './Pricing';

function HomePage() {
  return (
    <React.Fragment>
      
      <Hero />
      <Awards />
      <Stats />
      <Education />
      <Pricing />
      
      
    </React.Fragment>
  );
}

export default HomePage;

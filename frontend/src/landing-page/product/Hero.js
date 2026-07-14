import React from 'react';
import Leftimage from './Leftimage';
import Rightimage from './Rightimage';
import Universe from './Universe';
function Hero() {
  return (
    <React.Fragment>
      <h1 className="text-center mt-5">Technology</h1>
      <h3 className="text-muted text-center mt-5">Sleek,modern and intuitive trading platforms</h3>
      <Leftimage/>
      <Rightimage/>
      <Universe/>
    </React.Fragment>
  );
}

export default Hero;

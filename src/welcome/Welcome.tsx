/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Suspense} from 'react';
import '../assets/css/welcome/welcome.css';
const CoreStyles = React.lazy(()=>import('mf_react_core/CoreStyles'));
import SafeView from '../safe/SafeView';

const Welcome = () => {
  return (
    <SafeView
      color='white'
      title={`${process.env.REACT_APP_MF_NAME}
              ${process.env.REACT_APP_MF_VERSION}
              ${process.env.REACT_APP_ENVIRONMENT}`}
    >
      <Suspense fallback={<></>}>
        <CoreStyles>
          <div className=''>
            <header className='mf-name '>
              <div className=''>
                <div className=' mf-c-center mf-font'>
                  <div>{process.env.REACT_APP_MF_NAME}</div>
                  <div>{process.env.REACT_APP_MF_VERSION}</div>
                  <div>{process.env.REACT_APP_ENVIRONMENT}</div>
                </div>
              </div>
            </header>
            <div className='mf-bottom'></div>
          </div>
        </CoreStyles>
      </Suspense>
    </SafeView>
  );
};

export default Welcome;

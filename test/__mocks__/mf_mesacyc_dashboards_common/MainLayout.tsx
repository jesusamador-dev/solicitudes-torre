import React from 'react';
import {Outlet} from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className='d-flex flex-column flex-root app-root' style={{backgroundColor: '#E6EFEC'}}>
      <div className='app-page flex-column flex-column-fluid'>
        <div className='app-wrapper d-flex flex-row flex-row-fluid'>
          <div
            className='d-flex flex-column flex-shrink-0'
            style={{position: 'fixed', height: '100vh'}}
          >
          </div>
          <div className='app-main flex-column flex-row-fluid' style={{marginLeft: '200px'}}>
            <div className='d-flex flex-column flex-column-fluid'>
              <div className='app-content flex-column-fluid'>
                <div className='app-container container-fluid'>
                  <div className='row g-5 gx-xl-10 mb-5 mb-xl-10'>
                    <Outlet></Outlet>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

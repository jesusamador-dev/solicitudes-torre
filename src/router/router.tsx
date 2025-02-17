import React, {lazy, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import MainLayout from 'mf_mesacyc_dashboards_common/MainLayout';
import ErrorLayout from 'mf_mesacyc_dashboards_common/ErrorLayout';
import DSSpinner from 'mf_mesacyc_dashboards_common/DSSpinner';
import Reencauces from '@/presentation/pages/Reencauces';
import RouterReencauces from './RouterReencauces';

const Dashboard = lazy(() => import('../presentation/pages/Dashboard'))

const RouterSolicitudes: React.FC = () => {
  return (
    <Suspense  fallback={<DSSpinner></DSSpinner>}>
      <Routes>
        <Route element={<MainLayout />}>
            <Route path='/' element={<Dashboard/>} />
            {/* <Route path='/reencauces' element={<Reencauces/>}/> */}
           <Route path="/reencauces/*" element={<RouterReencauces />} />
        </Route>
        <Route path='/error' element={<ErrorLayout/>}></Route>
      </Routes>
    </Suspense>

  );
};

export default RouterSolicitudes;

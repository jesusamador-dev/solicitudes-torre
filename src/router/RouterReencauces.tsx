import React, {lazy, Suspense,} from 'react';
import {Route, Routes} from 'react-router-dom';
import MainLayout from 'mf_mesacyc_dashboards_common/MainLayout';
import InvestigationLayout from 'mf_mesacyc_dashboards_common/InvestigationLayout';
import ErrorLayout from 'mf_mesacyc_dashboards_common/ErrorLayout';
import DSSpinner from 'mf_mesacyc_dashboards_common/DSSpinner';
import Reencauces from '@/presentation/pages/Reencauces';
import TocanReencauce from '@/presentation/pages/TocanReencauce';
import DSReencaucesByTerritoryCount from 'mf_mesacyc_dashboards_common/DSReencaucesByTerritoryCount'; 
import ReencauceByTerritoryDetail from "@/presentation/pages/Reencauce/ReencaucesByTerritoryDetail"

const RouterReencauces: React.FC = () => {
    
  return (
    <Suspense fallback={<DSSpinner></DSSpinner>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<InvestigationLayout />}>
            <Route path='/' element={<Reencauces />} />
            <Route path='/con-oferta' element={"con-oferta"} />
            <Route path='/agendadas' element={"agendadas"} />
            <Route path='/pendientes-de-atender' element={"pendientes-atender"} />
            <Route path='/reprogramadas' element={"reprogramadas"} />
            <Route path='/reencauzadas' element={<Reencauces />} />
            <Route path='/reencauzadas/geografias-detalle' element={"NUEVA PAGINA YIPEEE"} />
            <Route path='/con-visita-atendida' element={"con-visita-atendida"} />
            <Route path='/inactivas' element={"inactivas"} />
            <Route path='/resumen' element={<Reencauces />} />
            <Route path='/1-reencauce' element={"1 Reencauce Screen"} />
            <Route path='/2-reencauce' element={"2 Reencauce Screen"} />
            <Route path='/3-reencauce' element={"3 Reencauce Screen"} />
            <Route path='/4-reencauce' element={"4 Reencauce Screen"} />
            <Route path='/tocan-reencauce' element={<TocanReencauce />} />
            {/* territorio-detalle es para los elementos de DSTopsWithTabs */}
            <Route path='/reencauzadas/territorio-detalle/:territorioId' element={<ReencauceByTerritoryDetail />} />
            <Route path='/solicitudes/reencauces/reencauzadas/territorio-detalle' element={"Hola mundo!"} />


          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterReencauces;

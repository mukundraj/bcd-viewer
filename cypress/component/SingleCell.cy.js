import React from 'react'
import  SingleCell  from '../../src/components/SingleCellComponent'
import {DATACONFIGS} from '../../src/shared/dataConfigs'
import {QueryClient, QueryClientProvider} from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

describe('SingleCell.cy.js', () => {
  it('test1', () => {

    const queryClient = new QueryClient();
    // cy.mount(
    //   <BrowserRouter>
    //     <QueryClientProvider client={queryClient}>
    //       <SingleCell dataConfig={DATACONFIGS[1]}/>
    //     </QueryClientProvider>
    //   </BrowserRouter>
    // )
  })
})

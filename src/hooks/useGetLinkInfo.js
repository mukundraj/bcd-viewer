
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {useStore, usePersistStore} from '../store/store'
import { useLocation } from 'react-router-dom'
import {pidToSrno} from "../shared/common"
import useGEComponentStore from '../store/GEComponentStore'
import {useSCComponentPersistStore} from '../store/SCComponentStore'
import {useCSComponentStore, useCSCPersistStore} from '../store/CSComponentStore'




const useGetLinkInfo = () => {

    // get chosenGene from store
    // const chosenGene = usePersistStore(state => state.chosenGene);
    const {pid, gene, cell} = usePersistStore(state => state.chosenPuckid)
    const maxUmiThreshold = useStore(state => state.maxUmiThreshold)
    const chosenGene2 = useStore(state => state.chosenGene2)
    const maxUmiThreshold2 = useStore(state => state.maxUmiThreshold2)  
    const umiLowerThreshold = useGEComponentStore(state => state.umiLowerThreshold); 
    const umiUpperThreshold = useGEComponentStore(state => state.umiUpperThreshold);
    const umiLowerThreshold2 = useGEComponentStore(state => state.umiLowerThreshold2);
    const umiUpperThreshold2 = useGEComponentStore(state => state.umiUpperThreshold2);
    const opacityVal = useGEComponentStore(state => state.opacityVal);
    const selectedRegIds = usePersistStore(state => state.selectedRegIds);
    const minFrac = useStore(state => state.minFrac);
    const maxFrac = useStore(state => state.maxFrac);

    // states for SC component
    const multiSelections = useSCComponentPersistStore(state => state.multiSelections);
    const order = useSCComponentPersistStore(state => state.order);
    const sortField = useSCComponentPersistStore(state => state.sortField);
    const cellClassSelection = useSCComponentPersistStore(state => state.cellClassSelection);
    const sortByToggleVal = useSCComponentPersistStore(state => state.sortByToggleVal);
    const minCompoPct = useSCComponentPersistStore(state => state.minCompoPct);
    const adaptNormalizerStatus = useSCComponentPersistStore(state => state.adaptNormalizerStatus);
    const hiddenCols = useSCComponentPersistStore(state => state.hiddenCols);
    const hiddenColsStr = hiddenCols.join(',');
    const curPageSize = useSCComponentPersistStore(state => state.curPageSize);
    const aggregateBy = useSCComponentPersistStore(state => state.aggregateBy);
    // const downsampledTableData = useSCComponentPersistStore(state => state.downsampledTableData);


    // states for CS component
    const maxScoreThreshold = useCSComponentStore(state => state.maxScoreThreshold);
    const maxScoreThreshold2 = useCSComponentStore(state => state.maxScoreThreshold2);
    const scoreLowerThreshold = useCSCPersistStore(state => state.scoreLowerThreshold);
    const scoreUpperThreshold = useCSCPersistStore(state => state.scoreUpperThreshold);
    const chosenCluster2 = useCSComponentStore(state => state.chosenCluster2);
    const scoreUpperThreshold2 = useCSCPersistStore(state => state.scoreUpperThreshold2);
    const scoreLowerThreshold2 = useCSCPersistStore(state => state.scoreLowerThreshold2);
    const opacityValCS = useCSComponentStore(state => state.opacityVal);
    const aggregateByCS = useCSCPersistStore(state => state.aggregateBy);



    // common
    const regIdsStr = selectedRegIds.join(','); // get regIds into a comma separated string from selectedRegIds
    const fbarActiveDataName = useStore(state => state.fbarActiveDataName)
    const nisslStatus = useStore(state => state.nisslStatus)
    const wireframeStatus = useStore(state => state.wireframeStatus)


    // internal functions
    const generateGenexLink = () =>
    {
        console.log('uumiLowerThreshold', umiLowerThreshold, 'uumiUpperThreshold', umiUpperThreshold);
        const link = `${window.location.origin}/redir?path=genex&srno=${pidToSrno[pid]}&gene=${gene}&thl=${umiLowerThreshold}&thh=${umiUpperThreshold}&gene2=${chosenGene2[0]}&thl2=${umiLowerThreshold2}&thh2=${umiUpperThreshold2}&fbd=${fbarActiveDataName}&nisslStatus=${nisslStatus}&wireframeStatus=${wireframeStatus}&opacityVal=${opacityVal}&mth1=${maxUmiThreshold}&mth2=${maxUmiThreshold2}&regids=${regIdsStr}&minfrac=${minFrac}&maxfrac=${maxFrac}`
        return link;
    }

    const generateCellSpatialLink = () =>
    {
        const link = `${window.location.origin}/redir?path=cellspatial&srno=${pidToSrno[pid]}&cell=${cell}&thl=${scoreLowerThreshold}&thh=${scoreUpperThreshold}&cell2=${chosenCluster2[0]}&thl2=${scoreLowerThreshold2}&thh2=${scoreUpperThreshold2}&fbd=${fbarActiveDataName}&nisslStatus=${nisslStatus}&wireframeStatus=${wireframeStatus}&opacityVal=${opacityValCS}&mth1=${maxScoreThreshold}&mth2=${maxScoreThreshold2}&regids=${regIdsStr}&minfrac=${minFrac}&maxfrac=${maxFrac}&aggregateBy=${aggregateByCS}`
        return link;
    }

    const generateSingleCellLink = () =>
    {

        const genes = multiSelections.map((gene) => gene).join(',');

        const link = `${window.location.origin}/redir?path=singlecell&genes=${genes}&order=${order}&regids=${regIdsStr}&sortField=${sortField}&cellClassSelection=${cellClassSelection}&sortByToggleVal=${sortByToggleVal}&minCompoPct=${minCompoPct}&adaptNormalizerStatus=${adaptNormalizerStatus}&hiddenColsStr=${hiddenColsStr}&initPageSize=${curPageSize}&aggregateBy=${aggregateBy}`
        // console.log('link', link);
        return link;
    }


    const location = useLocation();
    const path = location.pathname;

    let generateLink = null;

    if (path === '/genex')
        generateLink = generateGenexLink;
    else if (path === '/singlecell')
        generateLink = generateSingleCellLink;
    else if (path === '/cellspatial')
        generateLink = generateCellSpatialLink;

    return generateLink;
}

export default useGetLinkInfo;


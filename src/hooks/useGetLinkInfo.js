
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {useStore, usePersistStore} from '../store/store'
import { useLocation } from 'react-router-dom'
import {pidToSrno} from "../shared/common"




const useGetLinkInfo = () => {

    // get chosenGene from store
    // const chosenGene = usePersistStore(state => state.chosenGene);
    const {pid, gene, cell} = usePersistStore(state => state.chosenPuckid)
    const maxUmiThreshold = useStore(state => state.maxUmiThreshold)
    const chosenGene2 = useStore(state => state.chosenGene2)
    const maxUmiThreshold2 = useStore(state => state.maxUmiThreshold2)  
    const fbarActiveDataName = useStore(state => state.fbarActiveDataName)
    const nisslStatus = useStore(state => state.nisslStatus)
    const wireframeStatus = useStore(state => state.wireframeStatus)

    const generateGenexLink = () =>
    {

        const link = `${window.location.origin}/redir?path=genex&srno=${pidToSrno[pid]}&gene=${gene}&th=${maxUmiThreshold}&gene2=${chosenGene2[0]}&th2=${maxUmiThreshold2}&fbd=${fbarActiveDataName}&nisslStatus=${nisslStatus}&wireframeStatus=${wireframeStatus}`
        return link;
    }

    const generateSingleCellLink = () =>
    {
        const link = `${window.location.origin}/redir?gene=${gene}&pid=${pid}&cell=${cell}`
        return link;
    }

    const generateCellSpatialLink = () =>
    {
        const link = `${window.location.origin}/redir?pid=${pid}&cell=${cell}`
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


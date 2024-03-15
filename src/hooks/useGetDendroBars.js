// Desc: Custom hook to fetch dendroBars data from server and also aggregate the counts over selected regions

import { useState, useEffect } from 'react';

const useGetDendroBars = ({dendroBarsFullPath, geneName, selectedRegIds}) => {

    // const [data, setData] = useState(null);
    const [curRegionwiseData, setRegionwiseData] = useState(null); // regionwise counts
    const [curDendroBarData, setCurDendroBarData] = useState(null); // counts aggregated over selected regions

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log('dendroBarsFullPath', dendroBarsFullPath, 'geneName', geneName, 'selectedRegIds', selectedRegIds);


    function getDendroBarsData(regIds, data){
        let curDendroBarData = [...Array(101).keys()].map(x=>0);

        regIds.forEach(regId =>{

            let readDataArray = data[parseInt(regId)].puck_dist;
            for (let i=0; i<curDendroBarData.length;i++){
                curDendroBarData[i] += parseFloat(readDataArray[i]);
                curDendroBarData[i] = parseFloat(curDendroBarData[i].toFixed(4));
            }
        });
        return curDendroBarData;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${dendroBarsFullPath}/${geneName}.json`
                );
                const json = await response.json();

                setRegionwiseData(json);

                // console.log('dendrojson', json);

                const regIds = selectedRegIds;
                const curDendroBarsData = getDendroBarsData(regIds, json);

                setCurDendroBarData(curDendroBarsData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        if (dendroBarsFullPath && geneName && selectedRegIds)
            fetchData();

    }, [dendroBarsFullPath, geneName, selectedRegIds]);


    return { curRegionwiseData, curDendroBarData, loading, error };
}

export default useGetDendroBars;


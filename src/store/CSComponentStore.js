// Store for CellSpatial component
import create from 'zustand'
import { persist } from "zustand/middleware"

export const useCSComponentStore = create(set => ({
        chosenCell2:[],
        setChosenCell2: (val)=>set({chosenCell2:val}),
        cellOptions: ['Inh_Frmd7_Lamp5'],
        setCellOptions: (val) => set({cellOptions:val}),
        cladeOptions: ['MC_1'],
        setCladeOptions: (val) => set({cladeOptions:val}),
        cellclassOptions: ['DC'],
        setCellclassOptions: (val) => set({cellclassOptions:val}),
        curPuckMaxScores: [0.5],
        setCurPuckMaxScores: (val) => set({curPuckMaxScores:val}),
        maxScoreThreshold:0.0001,
        setMaxScoreThreshold: (val) => set({maxScoreThreshold:val}),
        maxScoreThreshold2:0.0001,
        setMaxScoreThreshold2: (val) => set({maxScoreThreshold2:val}),
        opacityVal:1.0,
        setOpacityVal: (val) => set({opacityVal:val}),
        urlScoreLowerThreshold: null,
        setUrlScoreLowerThreshold: (val) => set({urlScoreLowerThreshold:val}),
        urlScoreUpperThreshold: null,
        setUrlScoreUpperThreshold: (val) => set({urlScoreUpperThreshold:val}),
        urlScoreLowerThreshold2: null,
        setUrlScoreLowerThreshold2: (val) => set({urlScoreLowerThreshold2:val}),
        urlScoreUpperThreshold2: null,
        setUrlScoreUpperThreshold2: (val) => set({urlScoreUpperThreshold2:val}),
        cladeNameToAnno: [], // stores in format ['cladeAnno:clade']
        setCladeNameToAnno: (val) => set({cladeNameToAnno:val}),
        cladeDisplayOptions: [],
        setCladeDisplayOptions: (val) => set({cladeDisplayOptions:val}),
    }));

export const useCSCPersistStore = create(persist(set => ({
        chosenCluster:['Inh_Frmd7_Lamp5'],
        setChosenCluster: (val)=>set({chosenCluster:val}),
        cellNameToIdx: {'Inh_Frmd7_Lamp5':1762 },
        setCellNameToIdx: (val) => set({cellNameToIdx:val}),
        scoreLowerThreshold: 0.3,
        setScoreLowerThreshold: (val) => set({scoreLowerThreshold:val}),
        scoreUpperThreshold: 0.0001,
        setScoreUpperThreshold: (val) => set({scoreUpperThreshold:val}),
        scoreLowerThreshold2: 0.0001,
        setScoreLowerThreshold2: (val) => set({scoreLowerThreshold2:val}),
        scoreUpperThreshold2: 0.0001,
        setScoreUpperThreshold2: (val) => set({scoreUpperThreshold2:val}),
        aggregateBy: "none",
        setAggregateBy: (val) => set({aggregateBy:val}),
        chosenCell: ['Inh_Frmd7_Lamp5'],
        setChosenCell: (val)=>set({chosenCell:val}),
        chosenClade: ['MC_1'],
        setChosenClade: (val)=>set({chosenClade:val}),
        chosenClass: ['DC'],
        setChosenClass: (val)=>set({chosenClass:val}),
    }),
    {
        name: "csc-persist-storage",
        getStorage: ()=>sessionStorage,
    })
);

export default useCSComponentStore;

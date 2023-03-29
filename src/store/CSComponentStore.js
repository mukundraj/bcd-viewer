// Store for CellSpatial component
import create from 'zustand'
import { persist } from "zustand/middleware"

export const useCSComponentStore = create(set => ({
        chosenCell2:[],
        setChosenCell2: (val)=>set({chosenCell2:val}),
        cellOptions: ['Inh_Frmd7_Lamp5'],
        setCellOptions: (val) => set({cellOptions:val}),
        curPuckMaxScores: [0.5],
        setCurPuckMaxScores: (val) => set({curPuckMaxScores:val}),
        maxScoreThreshold:0.0001,
        setMaxScoreThreshold: (val) => set({maxScoreThreshold:val}),
        maxScoreThreshold2:0.0001,
        setMaxScoreThreshold2: (val) => set({maxScoreThreshold2:val}),
        opacityVal:1.0,
        setOpacityVal: (val) => set({opacityVal:val}),
    }));

export const useCSCPersistStore = create(persist(set => ({
        chosenCell:['Inh_Frmd7_Lamp5'],
        setChosenCell: (val)=>set({chosenCell:val}),
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
    }),
    {
        name: "csc-persist-storage",
        getStorage: ()=>sessionStorage,
    })
);

export default useCSComponentStore;

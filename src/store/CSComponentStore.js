// Store for CellSpatial component
import create from 'zustand'
import { persist } from "zustand/middleware"

export const useCSComponentStore = create(set => ({
        chosenCell2:[],
        setChosenCell2: (val)=>set({chosenCell2:val}),
        cellOptions: ['Inh_Lhx6_Nmu_1'],
        setCellOptions: (val) => set({cellOptions:val}),
    curPuckMaxScores: {curPid:-1, maxScores:[]},  
        setCurPuckMaxScores: (val) => set({curPuckMaxScores:val}),
        maxScoreThreshold:0.0001,
        setMaxScoreThreshold: (val) => set({maxScoreThreshold:val}),
        maxScoreThreshold2:0.0001,
        setMaxScoreThreshold2: (val) => set({maxScoreThreshold2:val}),
    }));

export const useCSCPersistStore = create(persist(set => ({
        chosenCell:['Inh_Lhx6_Nmu_1'],
        setChosenCell: (val)=>set({chosenCell:val}),
        cellNameToIdx: {'Inh_Lhx6_Nmu_1':560 },
        setCellNameToIdx: (val) => set({cellNameToIdx:val}),
    }),
    {
        name: "csc-persist-storage",
        getStorage: ()=>sessionStorage,
    })
);

export default useCSComponentStore;

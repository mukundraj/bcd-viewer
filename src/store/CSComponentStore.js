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
    }));

export const useCSCPersistStore = create(persist(set => ({
        chosenCell:['Inh_Frmd7_Lamp5'],
        setChosenCell: (val)=>set({chosenCell:val}),
        cellNameToIdx: {'Inh_Frmd7_Lamp5':1762 },
        setCellNameToIdx: (val) => set({cellNameToIdx:val}),
    }),
    {
        name: "csc-persist-storage",
        getStorage: ()=>sessionStorage,
    })
);

export default useCSComponentStore;

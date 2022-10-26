// Store for CellSpatial component
import create from 'zustand'

export const useCSComponentStore = create(set => ({
        chosenCell:['Inh_Lhx6_Nmu_1'],
        setChosenCell: (val)=>set({chosenCell:val}),
        chosenCell2:[],
        setChosenCell2: (val)=>set({chosenCell2:val}),
        cellOptions: ['Inh_Lhx6_Nmu_1'],
        setCellOptions: (val) => set({cellOptions:val}),
        curPuckMaxScores: [0.5],
        setCurPuckMaxScores: (val) => set({curPuckMaxScores:val}),
        maxScoreThreshold:0.0001,
        setMaxScoreThreshold: (val) => set({maxScoreThreshold:val}),
        maxScoreThreshold2:0.0001,
        setMaxScoreThreshold2: (val) => set({maxScoreThreshold2:val}),
    }));


export default useCSComponentStore;

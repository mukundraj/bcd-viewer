// Store for CellSpatial component
import create from 'zustand'

export const useCSComponentStore = create(set => ({
    chosenCell:['Ex_Plekhg1_Fign_Ppp1r3a_2'],
    setChosenCell: (val)=>set({chosenCell:val}),
    chosenCell2:[],
    setChosenCell2: (val)=>set({chosenCell2:val}),
    cellOptions: ['Ex_Plekhg1_Fign_Ppp1r3a_2'],
    setCellOptions: (val) => set({cellOptions:val}),
    }));


export default useCSComponentStore;

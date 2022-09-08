import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'

export const useSCComponentStore = create(set => ({
        currentColorMap:interpolateViridis,
        setCurrentColorMap: (val) => set({currentColorMap:val}),
        maxAvgVal:1,
        setMaxAvgVal: (val) => set({maxAvgVal:val}),
        maxProportionalVal:1, 
        setMaxProportionalVal: (val)=>set({maxProportionalVal:val}),
        sortByToggleVal:1,
        toggleSortByToggleVal: () => set((state)=>({sortByToggleVal:-1*state.sortByToggleVal})),
    }));


export default useSCComponentStore;

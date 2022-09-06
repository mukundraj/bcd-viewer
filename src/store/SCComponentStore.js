import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'

export const useSCComponentStore = create(set => ({
    currentColorMap:interpolateViridis,
    setCurrentColorMap: (val) => set({currentColorMap:val}),
    }));


export default useSCComponentStore;

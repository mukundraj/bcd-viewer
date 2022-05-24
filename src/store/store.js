import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'

const useStore = create(set => ({
    hoverInfo: 0,
    setHoverInfo: (hoverInfo) => set({hoverInfo:hoverInfo}),
    maxUmiThreshold:0,
    setMaxUmiThreshold: (val) => set({maxUmiThreshold:val}),
    currentColorMap:interpolateViridis,
    setCurrentColorMap: (val) => set({currentColorMap:val})

}));

export default useStore;

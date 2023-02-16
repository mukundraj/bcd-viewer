// Store for GeneExp component
import create from 'zustand'


export const useGEComponentStore = create(set => ({
    umiLowerThreshold: 0.01,
    umiUpperThreshold: 0.01,
    setUmiLowerThreshold: (val) => set({umiLowerThreshold: val}),
    setUmiUpperThreshold: (val) => set({umiUpperThreshold: val}),
    umiLowerThreshold2: 1.0,
    umiUpperThreshold2: 1.0,
    setUmiLowerThreshold2: (val) => set({umiLowerThreshold2: val}),
    setUmiUpperThreshold2: (val) => set({umiUpperThreshold2: val}),
    opacityVal: 1.0,
    setOpacityVal: (val) => set(state => ({opacityVal: val})),
}));

export default useGEComponentStore;

import create from 'zustand'

const useStore = create(set => ({
    hoverInfo: 0,
    setHoverInfo: (hoverInfo) => set({hoverInfo:hoverInfo})
}));

export default useStore;

import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'
import { persist } from "zustand/middleware"

export const useSCComponentStore = create(set => ({
        currentColorMap:interpolateViridis,
        setCurrentColorMap: (val) => set({currentColorMap:val}),
        maxAvgVal:1,
        setMaxAvgVal: (val) => set({maxAvgVal:val}),
        maxProportionalVal:1, 
        setMaxProportionalVal: (val)=>set({maxProportionalVal:val}),
        tableDataFiltered:[], 
        setTableDataFiltered: (val)=>set({tableDataFiltered:val}),
    }));

export const useSCComponentPersistStore = create(persist(set => ({
                multiSelections: [],
                setMultiSelections: (val) => set({multiSelections:val}),
                sortField:"", 
                setSortField: (val)=>set({sortField:val}),
                order:"desc", 
                setOrder: (val)=>set({order:val}),
                sortByToggleVal:1,
                setSortByToggleVal: (val) => set({sortByToggleVal:val}),
                toggleSortByToggleVal: () => set((state)=>({sortByToggleVal:-1*state.sortByToggleVal})),
                cellClassSelection: [],
                setCellClassSelection: (val) => set({cellClassSelection:val}),
                minCompoPct: 0.25,
                setMinCompoPct: (val) => set({minCompoPct:val}),
                adaptNormalizerStatus: true,
                setAdaptNormalizerStatus: (val) => set({adaptNormalizerStatus:val}),
                initialHiddenCols: ['nt', 'np', 'npr', 'amd'], // initial hidden columns
                setInitialHiddenCols: (val) => set({initialHiddenCols:val}),
                hiddenCols: [], // hidden columns after user interaction
                setHiddenCols: (val) => set({hiddenCols:val}),
                initPageSize: 20,
                setInitPageSize: (val) => set({initPageSize:val}),
                curPageSize: 20,
                setCurPageSize: (val) => set({curPageSize:val}),
                aggregateBy: "none",
                setAggregateBy: (val) => set({aggregateBy:val}),
                // downsampledTableData:{},
                // setDownsampledTableData: (val) => set({downsampledTableData:val}),

        }), {
                name: "SCComponentPersistStore",
                getStorage: () => sessionStorage,

        }));






export default useSCComponentStore;

import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'
import { persist } from "zustand/middleware"

export const useStore = create(set => ({
    hoverInfo: 0,
    setHoverInfo: (hoverInfo) => set({hoverInfo:hoverInfo}),
    maxUmiThreshold:1,
    setMaxUmiThreshold: (val) => set({maxUmiThreshold:val}),
    currentColorMap:interpolateViridis,
    setCurrentColorMap: (val) => set({currentColorMap:val}),
    curRoute: 'none',
    setCurRoute: (val) => set({curRoute:val}),
    geneOptions: ['Pcp4'],
    setGeneOptions: (val) => set({geneOptions:val}),
    chosenPuckid:1,
    setChosenPuckid: (val)=>set({chosenPuckid:val}),
    chosenGene:['Pcp4'],
    setChosenGene: (val)=>set({chosenGene:val}),
    chosenGene2:[],
    setChosenGene2: (val)=>set({chosenGene2:val}),
    carouselRef:0,
    setCarouselRef: (val)=>set({carouselRef:val}),
    fbarActiveDataName:'sorted_puckwise_cnts',
    setFbarActiveDataName: (val)=>set({fbarActiveDataName:val}),
    wireframeStatus:true,
    setWireframeStatus: (val)=>set({wireframeStatus:val}),
    nisslStatus:true,
    setNisslStatus: (val)=>set({nisslStatus:val}),
    togglePid:1,
    setTogglePid: (val)=>set({togglePid:val}),
    generalToggleFlag:true,
    toggleGeneralToggleFlag: ()=>set((state)=>({generalToggleFlag: !state.generalToggleFlag})),
    dendroBarData:[...Array(101).keys()].map(x=>0),
    // addDendroBarData: (val)=>set((state)=>({dendroBarData:state.dendroBarData.map((x,i)=>x+val[i])})),
    // subDendroBarData: (val)=>set((state)=>({dendroBarData:state.dendroBarData.map((x,i)=>x-val[i])})),
    setDendroBarData: (val)=>set({dendroBarData:val}),
    selectedRegions:[],
    setSelectedRegions: (val)=>set({selectedRegions:val}),
    selectedRegIds:[],
    setSelectedRegIds: (val)=>set({selectedRegIds:val}),
    maxColVals: {},
    setMaxColVals: (val)=>set({maxColVals:val}), //  change to maxRows
    scTableScrollTop:0, 
    setScTableScrollTop: (val)=>set({scTableScrollTop:val}),
    tableDataSorted:[], 
    setTableDataSorted: (val)=>set({tableDataSorted:val}),
    sortField:"", 
    setSortField: (val)=>set({sortField:val}),
    order:"desc", 
    setOrder: (val)=>set({order:val}),
    currentREgene: "None",
    setCurrentREgene: (val)=>set({currentREgene:val}),
    generalColormap: ()=>[0, 0, 0],
    setGeneralColormap: (val)=>set({generalColormap:val}),
    }));

export const useAuthStore = create(persist(set => ({
    isLoggedIn: false,
    setIsLoggedIn: (val) => set({isLoggedIn:val}),
    accessToken:null,
    setAccessToken: (val) => set({accessToken:val}),
    isDemoPortal: false,
    setIsDemoPortal: (val) => set({isDemoPortal:val}),
    }),
    {
        name: "auth-storage",
        getStorage: ()=>sessionStorage,
    })
);

export default useStore;

import create from 'zustand'
import {interpolateViridis} from 'd3-scale-chromatic'
import { persist } from "zustand/middleware"

export const useStore = create(set => ({
    hoverInfo: 0,
    setHoverInfo: (hoverInfo) => set({hoverInfo:hoverInfo}),
    maxUmiThreshold:0,
    setMaxUmiThreshold: (val) => set({maxUmiThreshold:val}),
    currentColorMap:interpolateViridis,
    setCurrentColorMap: (val) => set({currentColorMap:val}),
    curRoute: 'none',
    setCurRoute: (val) => set({curRoute:val})
    }));

export const useAuthStore = create(persist(set => ({
    isLoggedIn: false,
    setIsLoggedIn: (val) => set({isLoggedIn:val}),
    accessToken:null,
    setAccessToken: (val) => set({accessToken:val}),
    })),
    {
        name: "auth-storage"
    });

export default useStore;

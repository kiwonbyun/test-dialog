import {createContext, Fragment, ReactNode, useCallback, useEffect, useMemo, useState} from "react";

export const OverlayContext = createContext<{
    mount(id: string, element: ReactNode): void;
    unmount(id: string): void;
} | null>(null)

interface IOverlayProvider {
    children: ReactNode;
}

const OverlayProvider = ({children}:IOverlayProvider) => {
    const [overlays, setOverlays] = useState<Map<string, ReactNode>>(new Map());

    const mount = useCallback((id:string, element:ReactNode) =>{
        setOverlays(prevOverlays=>{
            const clone = new Map(prevOverlays);
            clone.set(id, element);
            return clone;
        });
    },[])
    const unmount = useCallback((id:string) =>{
        setOverlays(prevOverlays=>{
            const clone = new Map(prevOverlays);
            clone.delete(id);
            return clone;
        });
    },[])

    const context = useMemo(()=>({mount,unmount}),[mount,unmount])

    const clearOverlays = (e: KeyboardEvent) =>{
        if(e.key !== "Escape") return;
        setOverlays(new Map());
    }

    useEffect(() => {
        document.addEventListener('keydown',clearOverlays)
        return ()=>document.removeEventListener('keydown',clearOverlays);
    }, []);

    return (
        <OverlayContext.Provider value={context}>
            {children}
            {[...overlays.entries()].map(([id, element])=>{
                return <Fragment key={id}>{element}</Fragment>
            })};
        </OverlayContext.Provider>
    );
};

export default OverlayProvider;
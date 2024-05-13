import {createContext, Fragment, ReactNode, useCallback, useMemo, useState} from "react";

export const OverlayContext = createContext(null)

const OverlayProvider = ({children}) => {
    const [overlays, setOverlays] = useState(new Map());
    console.log(overlays)

    const mount = useCallback((id, element) =>{
        setOverlays(prevOverlays=>{
            const clone = new Map(prevOverlays);
            clone.set(id, element);
            return clone;
        });
    },[])
    const unmount = useCallback((id) =>{
        setOverlays(prevOverlays=>{
            const clone = new Map(prevOverlays);
            clone.delete(id);
            return clone;
        });
    },[])

    const context = useMemo(()=>({mount,unmount}),[mount,unmount])

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
import React, {forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useState} from 'react';

export type CreateOverlayElement = (props: { isOpen: boolean; close: () => void; onExit: () => void; resolve:(value:boolean)=>void; }) => JSX.Element;

interface Props {
    overlayElement: CreateOverlayElement;
    onExit: () => void;
    resolve:(value:boolean) => void;
}

export interface OverlayControlRef {
    close: () => void;
}

const OverlayController = forwardRef(({overlayElement: OverlayElement, onExit, resolve}:Props, ref:Ref<OverlayControlRef>) => {
    const [isOpenOverlay, setIsOpenOverlay] = useState(false);
    const handleOverlayClose = useCallback(()=>setIsOpenOverlay(false),[]);

    useImperativeHandle(
        ref,
        () => {
            return { close: handleOverlayClose };
        },
        [handleOverlayClose]
    );

    useEffect(() => {
        setIsOpenOverlay(true);
    }, []);

    return (
        <OverlayElement onExit={onExit} isOpen={isOpenOverlay} close={handleOverlayClose} resolve={resolve} />
    );
});

export default OverlayController;
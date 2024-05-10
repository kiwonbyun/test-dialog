import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

const OverlayController = forwardRef(({overlayElement: OverlayElement, onExit, resolve}, ref) => {
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
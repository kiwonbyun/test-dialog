import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { OverlayContext } from './OverlayProvider';
/** @tossdocs-ignore */
import { OverlayController } from './OverlayController';

let elementId = 1;

export function useOverlay({ exitOnUnmount = true } = {}) {
  const context = useContext(OverlayContext);

  if (context == null) {
    throw new Error('useOverlay is only available within OverlayProvider.');
  }

  const { mount, unmount } = context;
  const [id] = useState(() => String(elementId++));

  const overlayRef = useRef(null);

  useEffect(() => {
    return () => {
      if (exitOnUnmount) {
        unmount(id);
      }
    };
  }, [exitOnUnmount, id, unmount]);

  return useMemo(
    () => ({
      open: (overlayElement) => {
        return new Promise((resolve) => {
          mount(
            id,
            <OverlayController
              // NOTE: state should be reset every time we open an overlay
              key={Date.now()}
              ref={overlayRef}
              overlayElement={overlayElement}
              onExit={() => {
                unmount(id);
              }}
              resolve={resolve}
            />
          );
        });
      },
      close: () => {
        overlayRef.current?.close();
      },
      exit: () => {
        unmount(id);
      },
    }),
    [id, mount, unmount]
  );
}

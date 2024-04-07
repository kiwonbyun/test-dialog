import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { OverlayContext } from './OverlayProvider';
/** @tossdocs-ignore */
import { OverlayController } from './OverlayController';

export function useOverlay({ exitOnUnmount = true } = {}) {
  const context = useContext(OverlayContext);

  if (context == null) {
    throw new Error('useOverlay is only available within OverlayProvider.');
  }

  const { mount, unmount, unmountAll } = context;
  // const [id] = useState(() => String(elementId++));
  const id = useRef(1);

  const overlayRef = useRef(null);

  useEffect(() => {
    return () => {
      if (exitOnUnmount) {
        unmountAll();
      }
    };
  }, [exitOnUnmount, id, unmountAll]);

  return useMemo(
    () => ({
      open: (overlayElement) => {
        id.current = id.current + 1;
        const resolvePromise = (resolve) => {
          mount(
            id.current,
            <OverlayController
              key={Date.now()}
              ref={overlayRef}
              overlayElement={overlayElement}
              onExit={() => {
                unmount(id);
              }}
              resolve={resolve}
            />
          );
        };

        return new Promise((resolve) => {
          resolvePromise(resolve);
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

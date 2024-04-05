import React, { createContext, useCallback, useMemo, useState } from 'react';

export const OverlayContext = createContext(null);
if (process.env.NODE_ENV !== 'production') {
  OverlayContext.displayName = 'OverlayContext';
}

export function OverlayProvider({ children }) {
  const [overlayById, setOverlayById] = useState(new Map());
  console.log(overlayById);

  const mount = useCallback((id, element) => {
    setOverlayById((overlayById) => {
      const cloned = new Map(overlayById);
      cloned.set(id, element);
      return cloned;
    });
  }, []);

  const unmount = useCallback((id) => {
    setOverlayById((overlayById) => {
      const cloned = new Map(overlayById);
      cloned.delete(id);
      return cloned;
    });
  }, []);

  const contextMethod = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={contextMethod}>
      {children}
      {[...overlayById.entries()].map(([id, element]) => (
        <React.Fragment key={id}>{element}</React.Fragment>
      ))}
    </OverlayContext.Provider>
  );
}

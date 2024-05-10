import {useContext, useEffect, useRef, useState} from "react";
import {OverlayContext} from "./OverlayProvider";
import OverlayController from "./OverlayController";

let elementId = 1;

const useOverlay = ({exitOnUnmount = true}={}) => {
    const context = useContext(OverlayContext);

    if(!context){
        throw new Error("useOverlay must be used within OverlayProvider");
    }
    const {mount, unmount} = context;
    const [id] = useState(()=>String(elementId++));
    const overlayRef = useRef(null);


    useEffect(() => {
        return ()=>{
            if(exitOnUnmount){
                unmount(id);
            }
        }
    }, [unmount, id,exitOnUnmount]);

    return {
      open:(overlayElement)=>{
          return new Promise((resolve)=>{
              mount(
                  id,
                  <OverlayController
                      overlayElement={overlayElement}
                      key={Date.now()}
                      onExit={()=>unmount(id)}
                      ref={overlayRef}
                      resolve={resolve}
                  />
              )
          })

      },
      close:()=>{
          overlayRef.current?.close();
      },
      exit:()=>{
          unmount(id);
      }
    };
};

export default useOverlay;
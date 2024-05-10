import React from 'react';
import {createPortal} from "react-dom";

const Modal = ({isOpen, children, close}) => {
    if(!isOpen)return null;



    return createPortal(
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999
            }} onClick={close}/>
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '5px',
                boxShadow: '5px 6px 10px 0px rgba(0, 0, 0, 0.12)',
                padding: '5px 10px',
            }}>
                {children}
            </div>
        </>,
        document.getElementById("modal-root")
    );
};

export default Modal;
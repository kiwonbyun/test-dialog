import React from 'react';
import Portal from "./Portal";

const ConfirmCloseModal = ({children,onConfirm, ...props}) => {
    const handleClose = () =>{
        props.resolve(false);
        props.close();
    };
    const handleConfirm = () =>{
        if(onConfirm) onConfirm()
        props.resolve(true);
        props.close();
    };

    if(!props.isOpen)return null;
    return (
        <Portal {...props}>
            {children}
            <div>
                <button onClick={handleClose}>닫기</button>
                <button onClick={handleConfirm}>확인</button>
            </div>
        </Portal>
    );
};

export default ConfirmCloseModal;
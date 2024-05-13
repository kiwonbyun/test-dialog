import React, {Fragment} from 'react';
import Portal from "./Portal";

const ConfirmModal = ({children, ...props}) => {
    const handleConfirm = () =>{
        props.resolve(true);
        props.close();
    };

    if(!props.isOpen)return null;
    return (
        <Portal {...props}>
            {children}
            <div>
                <button onClick={handleConfirm}>확인</button>
            </div>
        </Portal>

    );
};

export default ConfirmModal;
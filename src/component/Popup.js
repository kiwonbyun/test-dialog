import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOverlay } from '../context/Overlay/useOverlay';

const Popup = ({ isOpen, close, onOk, message }) => {
  const variants = {
    init: { opacity: 0 },
    show: { opacity: 1 },
    hide: { opacity: 0 },
  };
  const overlay = useOverlay();

  const handleAdditionalPopup = () => {
    overlay.open(({ isOpen, close }) => {
      return isOpen ? (
        <div>
          addpopup<button onClick={close}>addpopup 닫기</button>
        </div>
      ) : null;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="init"
          animate="show"
          exit="hide"
        >
          {message}
          <button onClick={handleAdditionalPopup}>추가팝업열기</button>
          <button onClick={() => close()}>닫기</button>
          <button
            onClick={() => {
              onOk();
            }}
          >
            확인
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;

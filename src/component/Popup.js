import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Popup = ({ isOpen, close, onOk, message }) => {
  const variants = {
    init: { opacity: 0 },
    show: { opacity: 1 },
    hide: { opacity: 0 },
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

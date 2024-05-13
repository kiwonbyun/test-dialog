import React from 'react';
import useOverlay from "../lib/overlay/useOverlay";
import {Overlay} from "../component/Modal/Portal";

function Post() {
    const overlay1 = useOverlay();
    const overlay2 = useOverlay();

    const handleOpenAnother = async() =>{
         const confirm = await overlay2.open((props)=>{
             console.log(props)
            return <Overlay.ConfirmCloseModal {...props}>중첩!</Overlay.ConfirmCloseModal>
        })
        if(!confirm)return
        overlay1.exit()
    }

  const handlePurchase = async () => {
      const isConfirm = await overlay1.open((props)=>(
          <Overlay.ConfirmModal{...props}>
              <h1>Modal Title</h1>
              <button onClick={handleOpenAnother}>중첩모달 열기</button>
          </Overlay.ConfirmModal>
      ));
      if(!isConfirm) return;
      console.log("hi");
  };

  return (
    <div>
      Post
      <button onClick={handlePurchase}>구매하기</button>
    </div>
  );
}

export default Post;

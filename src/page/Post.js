import React from 'react';
import useOverlay from "../lib/overlay/useOverlay";
import ConfirmCloseModal from "../component/Modal/ConfirmCloseModal";

function Post() {
    const overlay1 = useOverlay();

  const handlePurchase = async () => {
      const result = await overlay1.open((props)=>(
          <ConfirmCloseModal {...props}>sad</ConfirmCloseModal>
      ));
      if(result ==='reject') return;
      console.log(result);


  };

  return (
    <div>
      Post
      <button onClick={handlePurchase}>구매하기</button>
    </div>
  );
}

export default Post;

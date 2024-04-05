import React from 'react';
import {
  dialog_type_confirm,
  useDialogContext,
} from '../context/Dialog/DialogProvider';
import { useOverlay } from '../context/Overlay/useOverlay';
import Popup from '../component/Popup';

function Post() {
  const overlay = useOverlay();

  // promise 인터페이스 너무 어려움.
  // useOverlay 가 한번 호출되면 id가 고정되어 있어서 중복 overlay를 못띄움
  // const handlePurchase = async () => {
  //   await new Promise((resolve) => {
  //     overlay.open(({ close, isOpen }) => (
  //       <Popup
  //         isOpen={isOpen}
  //         close={close}
  //         message={'첫번째 팝업'}
  //         onOk={() => {
  //           resolve();
  //           close();
  //         }}
  //       />
  //     ));
  //   });
  //   console.log('hi');
  // };

  const handlePurchase = async () => {
    // 인터페이스 개선 open이 프로미스를 리턴, resolve를 호출해주면 await 을 탈출
    await overlay.open(({ close, isOpen, resolve }) => (
      <Popup
        isOpen={isOpen}
        close={close}
        message={'첫번째 팝업'}
        onOk={() => {
          resolve();
          // close();
        }}
      />
    ));

    // 여기서 await overlay.open()을 한번 더 할수 있어야함. id를 다르게 줘보자
    console.log('hi');
  };

  return (
    <div>
      Post
      <button onClick={handlePurchase}>구매하기</button>
    </div>
  );
}

export default Post;

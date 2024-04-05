import { css } from '@emotion/react';
import React, { memo } from 'react';

// Confirm 컴포넌트 정의
const ConfirmComponent = ({ dialog_props, dialog_utils }) => {
  // 확인 버튼 클릭 핸들러

  const handleConfirm = () => {
    // dialog_utils를 사용하여 다이얼로그를 닫고, 필요한 경우 추가 액션 수행
    dialog_utils.hideDialog(dialog_props.id);
    // dialog_props에 정의된 onConfirm 콜백 실행, 있을 경우
    dialog_props.onConfirm && dialog_props.onConfirm();
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    // dialog_utils를 사용하여 다이얼로그를 닫고, 필요한 경우 추가 액션 수행
    dialog_utils.hideDialog(dialog_props.id);
    // dialog_props에 정의된 onCancel 콜백 실행, 있을 경우
    dialog_props.onCancel && dialog_props.onCancel();
  };

  return (
    <div className={ConfirmDialog}>
      <div className={ConfirmMessage}>{dialog_props.message}</div>
      <div className={ConfirmButtons}>
        <button className={ConfirmButton} onClick={handleConfirm}>
          {dialog_props.positive_button_message ?? '확인'}
        </button>
        <button className={ConfirmButton} onClick={handleCancel}>
          {dialog_props.negative_button_message ?? '취소'}
        </button>
      </div>
    </div>
  );
};

const ConfirmDialog = css`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  max-width: 90%;
  margin: 20px auto;
`;

const ConfirmMessage = css`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const ConfirmButtons = css`
  display: flex;
  justify-content: space-around;
`;

const ConfirmButton = css`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
`;

export default memo(ConfirmComponent);

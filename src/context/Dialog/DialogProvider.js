import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { sleep } from './common';
import Dialogs from '../../component/Dialogs';

// import CenterConfirm from './component/CenterConfirm';

// import Toast from './component/Toast';

export const dialog_type_alert = 1;
export const dialog_type_confirm = 2;
export const dialog_type_custom = 3;

export const button_type_none = 0;
export const button_type_positive = 1;
export const button_type_negative = 2;

// @TODO 앞으로가기 처리
const dialog_context = createContext({ showDialog: () => {} });

export const DialogContextProvider = (props) => {
  const last_dialog_id = useRef(0);
  // Map 객체를 사용하면 더 쉽지 않을까?
  const dialogs = useRef([]);
  console.log(dialogs.current);

  // for render
  const [render_time, setRenderTime] = useState(0);

  // @TODO 구현하기 (분기처리만 하면 됨)
  const forward_history = props.forward_history ?? false;

  const navigate = useNavigate();

  // dialogs Ref 배열에 특정 객체를 push하는 함수
  // 호출되면 last_dialog_id가 1 늘어난다.
  // 그리고 last_dialog_id를 리턴한다.
  // requestRender함수는 리랜더링을 일으킨다. -> last_dialog_id를 ref로 사용하므로 해당 데이터가 변한다고 리랜더링이 발생하지 않는다.
  // requestRender함수는 의도적으로 리랜더링을 원할때 호출하기 위해서 만들어 진 것 같다.
  const _pushDialog = useCallback((dialog_params) => {
    last_dialog_id.current = last_dialog_id.current + 1;
    dialogs.current.push({
      ...dialog_params,
      id: last_dialog_id.current,
      visible: true,
    });
    requestRender();
    return last_dialog_id.current;
  }, []);

  /**
   * @param {
   *  type(int,*): dialogs type (dialog_type_alert, dialog_type_confirm)
   *  message(string)
   *  cancelable(bool)
   *  positive_button_message(string)
   *  negative_button_message(string)
   *  component(object class only): support only dialog_type_custom
   *  component_props: props of component
   *  on_dismiss: on dismiss listener
   *  with_history: state push(bool)
   *  with_blocking: page click blocking(bool)
   * } dialog_params
   * @return {
   *  resolve(dialog_id): if dialog_id is 0 cannot created dialog
   * } promise
   */
  const showDialog = useCallback(
    ({
      type,
      message,
      cancelable,
      positive_button_message,
      negative_button_message,
      component,
      component_props,
      on_dismiss,
      with_history = true,
      with_blocking = true,
    }) => {
      if (!type) {
        // 반환값이 에러가 아니고 boolean 이라면 사용자는 showDialog를 어떻게 에러처리 할까?
        return false;
      }

      let _resolve;
      // 이것은 dialog가 닫힐때 실행될 Promise인가? 사용자는 promise를 반환받은 후에 어떻게 사용하게 될까?
      const promise = new Promise((__resolve, __reject) => {
        _resolve = __resolve;
      });

      // push dialog
      // _pushDialog가 진짜 dialog id를 반환하니 0으로 초기화 하지 않고 undefined로 놔둬도 괜찮지않을까?
      let id = 0;
      id = _pushDialog({
        type,
        message,
        cancelable: cancelable === undefined ? true : cancelable, // default value
        positive_button_message,
        negative_button_message,
        component,
        component_props,
        on_dismiss,
        with_history,
        with_blocking,
        resolve: (params) => {
          _resolve(params);
        },
      });

      return {
        id,
        promise,
      };
    },
    [_pushDialog]
  );

  const findDialog = useCallback((dialog_id) => {
    return dialogs.current.find((dialog) => {
      return dialog.id === dialog_id;
    });
  }, []);

  const showDialogById = useCallback(
    (dialog_id) => {
      let dialog = findDialog(dialog_id);
      if (dialog && !dialog.visible) {
        dialog.visible = true;
        requestRender();
      }
    },
    [findDialog]
  );

  const hideDialog = useCallback(
    (dialog_id, params = null, back_state = false) => {
      let need_render = false;
      let with_history = false;
      // @TODO break
      // dialogs ref객체의 값인 배열을 순회하면서
      // hideDialog메서드가 매개변수로 받은 dialog_id와 id가 같은 dialog를 찾고
      // 그것이 보이는 상태이면 on_dismiss 함수를 가지고 있다면 호출하고 resolve(해결될때 실행되는 promise)도 실행
      // 그리고 visible을 false로 만들고 need_render 값도 true로 만든다.
      // 해당 dialog가 with_history 옵션을 가지고 있었다면 with_history 지역변수도 true로 만든다
      dialogs.current.forEach((dialog) => {
        if (dialog.id === dialog_id && dialog.visible) {
          dialog.on_dismiss && dialog.on_dismiss(params);
          dialog.resolve(params);
          dialog.visible = false;
          need_render = true;

          if (dialog.with_history) {
            with_history = true;
          }
        }
      });

      // 위에서 dialog_id로 목표가 된 dialog가 있었다면, 그리고 visible이 true였다면, need_render가 true가 되었으므로
      // 가려진 dialog를 가리기 위해 requestRender를 호출한다.
      // 만약 with_history가 truthy 하다면 (아직 이게 뭔지 모름) 뒤로가기 한번 하고 requestRender 호출함
      if (need_render) {
        if (!back_state && with_history) {
          navigate(-1);
        }

        requestRender();
      }

      return need_render;
    },
    [navigate]
  );

  // 모든 dialog를 전부 가리는 함수
  const hideDialogAll = useCallback(
    (params = null, back_state = false) => {
      let hide_count = 0;
      // dialog visible이 true인 모든 dialog를 순회하면서 on_dismiss 가 있으면 호출해주고
      // dialog가 해결될때 실행되는 resolve도 호출해준다.
      // 그리고 visible을 false로 만들어주고
      // dialog중에 with_history옵션이 있었던 갯수만큼 count를 올려준다.
      dialogs.current.forEach((dialog) => {
        if (dialog.visible) {
          dialog.on_dismiss && dialog.on_dismiss(params);
          dialog.resolve(params);
          dialog.visible = false;

          if (dialog.with_history) {
            hide_count++;
          }
        }
      });

      // 닫은 dialog중에 with_history옵션이 있었던 만큼 뒤도가기를 해준다.
      // back_state는 정확히 모르겠음
      // 모든게 끝나면 requestRender를 호출해서 리랜더링을 시켜줌으로써 가려진 dialog를 반영한다.
      if (hide_count > 0) {
        if (!back_state) {
          navigate(-hide_count);
        }

        requestRender();
      }

      return hide_count;
    },
    [navigate]
  );

  const getCurrentDialogId = (default_value = 0) => {
    let hash_prefix = '#dialog_';
    let path = window.location.href;
    let prefix_find = path.indexOf(hash_prefix);
    if (prefix_find >= 0) {
      return (
        parseInt(
          path.substring(prefix_find + hash_prefix.length, path.length)
        ) || default_value
      );
    } else {
      return default_value;
    }
  };

  // requestRender함수는 의도적으로 리랜더링을 원할때 호출하기 위해서 만들어 진 것 같다.
  const requestRender = () => {
    setRenderTime(new Date().getTime());
  };

  const memo_values = useMemo(() => {
    return {
      showDialog,
      hideDialog,
      hideDialogAll,
      findDialog,
      getCurrentDialogId,
      // DialogContextProvider.showDialog 참고
      // show는 왜 비동기 함수일까? sleep의 역할은 뭘까? dialog의 promise를 리턴하는 이유는?
      show: async (dialog_params) => {
        let dialog = showDialog(dialog_params);
        let res = await dialog.promise;
        await sleep(50); //hack
        return res;
      },
      toast: ({
        with_exit = false,
        with_loading = false,
        icon_url,
        message,
        duration = 3000,
      }) => {
        if (!message) {
          return null;
        }

        return showDialog({
          type: dialog_type_custom,
          component: <div>TOAST</div>,
          component_props: {
            duration,
            icon_url,
            with_loading,
            with_exit,
          },
          with_history: false,
          with_blocking: false,
          message,
        });
      },
      centerConfirm: async ({
        notice,
        title,
        message,
        positive_button_message,
        negative_button_message,
        theme,
        mobile_detect,
      }) => {
        if (!message) {
          return null;
        }

        let dialog = showDialog({
          type: dialog_type_custom,
          component: <div>CenterConfirm</div>,
          component_props: { title, notice, message, theme, mobile_detect },
          positive_button_message,
          negative_button_message,
        });

        let res = await dialog.promise;
        await sleep(50); //hack
        return res === button_type_positive;
      },
      confirm: async (message) => {
        if (!message) {
          return null;
        }

        let dialog = showDialog({
          type: dialog_type_confirm,
          message,
        });

        let res = await dialog.promise;
        await sleep(50); //hack
        return res === button_type_positive;
      },
      alert: async (message) => {
        if (!message) {
          return null;
        }

        let dialog = showDialog({
          type: dialog_type_alert,
          message,
        });

        await dialog.promise;
        await sleep(50); //hack
        return true;
      },
    };
  }, [showDialog, hideDialog, hideDialogAll, findDialog]);

  const memo_dialog_utils = useMemo(() => {
    return {
      showDialogById,
      hideDialog,
      hideDialogAll,
      findDialog,
    };
  }, [showDialogById, hideDialog, hideDialogAll, findDialog]);

  return (
    <dialog_context.Provider value={memo_values}>
      {props.children}

      <Dialogs
        forward_history={forward_history}
        list_change_hash={render_time}
        list={dialogs.current}
        dialog_utils={memo_dialog_utils}
      />
    </dialog_context.Provider>
  );
};

export const useDialogContext = () => {
  return useContext(dialog_context);
};

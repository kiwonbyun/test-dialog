import React, { useCallback, useEffect, useMemo, useRef } from 'react';
// import Alert from './Alert';
// import Confirm from './Confirm';

import { useLocation, useNavigate } from 'react-router-dom';
import { sleep } from '../context/Dialog/common';
import {
  dialog_type_alert,
  dialog_type_confirm,
  dialog_type_custom,
} from '../context/Dialog/DialogProvider';
import ConfirmComponent from './ConfirmComponent';

const hash_prefix = '#dialog_';
const init_window_state = {
  init: false,
  overflow: 'overlay',
};
const Dialogs = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const prev_window_state = useRef(init_window_state);
  const pushed_item_list = useRef([]);
  const last_url = useRef(null);
  const visit_key_map = useRef({});

  const forward_history = props.forward_history ?? false;

  const _extractDialogId = useCallback((path, default_value = 0) => {
    if (!path) return default_value;

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
  }, []);

  useEffect(() => {
    // scroll
    let visible_list_size = 0;
    // 만약 dialog들 중에 하나라도 visible하고 with_blocking이 true인 상태라면
    // overflow를 hidden으로 만들어서 스크롤을 없엔다.
    props.list?.forEach((dialog) => {
      if (dialog.visible && dialog.with_blocking) {
        visible_list_size++;
      }
    });
    if (visible_list_size === 0) {
      window.document.body.style.overflow = prev_window_state.current.overflow;

      // reset prev window state
      prev_window_state.current = init_window_state;
    } else {
      // init prev window state
      if (visible_list_size === 1 && !prev_window_state.current.init) {
        prev_window_state.current = {
          init: true,
          overflow: window.document.body.style.overflow || '',
        };
      }
      window.document.body.style.overflow = 'hidden';
    }

    // pushed list
    // eslint-disable-next-line array-callback-return
    props.list?.map((dialog) => {
      if (
        !pushed_item_list.current.find((pushed_item) => {
          return pushed_item.dialog.id === dialog.id;
        })
      ) {
        if (dialog.with_history) {
          navigate(`${location.search}${hash_prefix}${dialog.id}`);
          pushed_item_list.current.push({
            pushed: true,
            dialog: dialog,
          });
        }
      }
    });
  }, [props.list_change_hash, location, navigate, props.list]);
  // }, [props.list_change_hash]);

  // 하위 컴포넌트에서 hideDialog 호출하는 부분을 캐치하기 위해 override
  const dialog_utils = useMemo(() => {
    return props.dialog_utils
      ? {
          ...props.dialog_utils,
          moveTo: async ({ url }) => {
            props.dialog_utils?.hideDialogAll();
            await sleep(50); //hack // 이것은 무슨 역할일까?
            navigate(url);
          },
          hideAndTask: async (dialog_id, runnable) => {
            runnable && (await runnable());
            await sleep(50); //hack
            props.dialog_utils.hideDialog(dialog_id);
          },
        }
      : null;
  }, [navigate, props.dialog_utils]);

  useEffect(() => {
    let hash = location.key;
    let current_url = window.location.href;
    let is_visited = visit_key_map.current[hash] ? true : false;

    let current_dialog = props.dialog_utils?.findDialog(
      _extractDialogId(current_url)
    );
    let prev_dialog = props.dialog_utils?.findDialog(
      _extractDialogId(last_url.current)
    );
    if (current_dialog) {
      if (is_visited) {
        console.log({ forward_history });
        if (forward_history) {
          props.dialog_utils.showDialogById(current_dialog.id);
        }
        props.dialog_utils.hideDialog(prev_dialog?.id, undefined, true);
      } else {
        // nothing
      }
    } else {
      props.dialog_utils.hideDialog(prev_dialog?.id, undefined, true);
    }

    last_url.current = current_url;
    visit_key_map.current[hash] = hash;
  }, [location, _extractDialogId, forward_history, props.dialog_utils]);
  // }, [location]);

  return (
    <>
      {props.list &&
        props.list.map((dialog, index) => {
          try {
            if (dialog.visible) {
              if (dialog.type === dialog_type_alert) {
                console.log('여기2');
                return (
                  //   <Alert
                  //     key={index}
                  //     dialog_props={dialog}
                  //     dialog_utils={dialog_utils}
                  //   />
                  <div>Alert</div>
                );
              } else if (dialog.type === dialog_type_confirm) {
                return (
                  //   <div>asd</div>
                  <ConfirmComponent
                    key={index}
                    dialog_props={dialog}
                    dialog_utils={dialog_utils}
                  />
                );
              } else if (dialog.type === dialog_type_custom) {
                return (
                  <dialog.component
                    key={index}
                    dialog_props={dialog}
                    dialog_utils={dialog_utils}
                    {...dialog.component_props}
                  />
                );
              }
            }
          } catch (e) {}
          return null;
        })}
    </>
  );
};

export default Dialogs;

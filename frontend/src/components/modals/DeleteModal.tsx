import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Icon } from '../UI/Icon';
import './DeleteModal.css';

export type DeleteModalProps = {
  /** Unique HTML id for the `<dialog>` (required for Command API wiring). */
  dialogId: string;
  /** Opens the modal via `command="show-modal"` — no onClick needed. */
  trigger: ReactElement;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Runs when the user submits the form with value `confirm`. */
  onConfirm?: () => void;
  confirmDisabled?: boolean;
};

/**
 * Reusable delete confirmation modal.
 * Open/close uses native `<dialog>` + Command API (no React state, no open/close handlers).
 * Only `onConfirm` runs app logic after the user confirms.
 */
export function DeleteModal({
  dialogId,
  trigger,
  title = 'Delete item?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmDisabled = false,
}: DeleteModalProps) {
  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        command: 'show-modal',
        commandFor: dialogId,
      } as React.HTMLAttributes<HTMLElement>)
    : trigger;

  return (
    <>
      {triggerNode}

      <dialog
        id={dialogId}
        className="delete-dialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-desc`}
        onClose={(event) => {
          if (event.currentTarget.returnValue === 'confirm') {
            onConfirm?.();
          }
        }}
      >
        <div className="delete-dialog__panel glass-panel border border-outline-variant/40">
          <div className="delete-dialog__icon-wrap" aria-hidden>
            <Icon name="delete_forever" size={22} />
          </div>

          <div>
            <h2 className="delete-dialog__title" id={`${dialogId}-title`}>
              {title}
            </h2>
            <p className="delete-dialog__description" id={`${dialogId}-desc`}>
              {description}
            </p>
          </div>

          <form method="dialog" className="delete-dialog__actions">
            <button
              type="submit"
              value="cancel"
              className="delete-dialog__btn delete-dialog__btn--cancel"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              value="confirm"
              className="delete-dialog__btn delete-dialog__btn--confirm"
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

import { createNamespace } from '../utils';
import { BORDER_TOP, BORDER_LEFT } from '../utils/constant';
import { PopupMixin } from '../mixins/popup';
import { CloseOnPopstateMixin } from '../mixins/close-on-popstate';
import Button from '../button';

const [createComponent, bem, t] = createNamespace('dialog');

export default createComponent({
  mixins: [PopupMixin, CloseOnPopstateMixin],

  props: {
    title: String,
    message: String,
    className: null,
    callback: Function,
    beforeClose: Function,
    messageAlign: String,
    cancelButtonText: String,
    cancelButtonColor: String,
    confirmButtonText: String,
    confirmButtonColor: String,
    showCancelButton: Boolean,
    transition: {
      type: String,
      default: 'van-dialog-bounce'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: {
        confirm: false,
        cancel: false
      }
    };
  },

  methods: {
    onClickOverlay() {
      this.handleAction('overlay');
    },

    handleAction(action) {
      this.$emit(action);

      if (this.beforeClose) {
        this.loading[action] = true;
        this.beforeClose(action, state => {
          if (state !== false && this.loading[action]) {
            this.onClose(action);
          }

          this.loading.confirm = false;
          this.loading.cancel = false;
        });
      } else {
        this.onClose(action);
      }
    },

    onClose(action) {
      this.close();

      if (this.callback) {
        this.callback(action);
      }
    },

    onOpened() {
      this.$emit('opened');
    },

    onClosed() {
      this.$emit('closed');
    }
  },

  render() {
    if (!this.shouldRender) {
      return;
    }

    const { message, messageAlign } = this;
    const messageSlot = this.slots();
    const title = this.slots('title') || this.title;

    const Title = title && (
      <div class={bem('header', { isolated: !message && !messageSlot })}>{title}</div>
    );

    const Content = (messageSlot || message) && (
      <div class={bem('content')}>
        {messageSlot || (
          <div
            domPropsInnerHTML={message}
            class={bem('message', { 'has-title': title, [messageAlign]: messageAlign })}
          />
        )}
      </div>
    );

    const hasButtons = this.showCancelButton && this.showConfirmButton;
    const ButtonGroup = (
      <div class={[BORDER_TOP, bem('footer', { buttons: hasButtons })]}>
        {this.showCancelButton && (
          <Button
            size="large"
            class={bem('cancel')}
            loading={this.loading.cancel}
            text={this.cancelButtonText || t('cancel')}
            style={{ color: this.cancelButtonColor }}
            onClick={() => {
              this.handleAction('cancel');
            }}
          />
        )}
        {this.showConfirmButton && (
          <Button
            size="large"
            class={[bem('confirm'), { [BORDER_LEFT]: hasButtons }]}
            loading={this.loading.confirm}
            text={this.confirmButtonText || t('confirm')}
            style={{ color: this.confirmButtonColor }}
            onClick={() => {
              this.handleAction('confirm');
            }}
          />
        )}
      </div>
    );

    return (
      <transition
        name={this.transition}
        onAfterEnter={this.onOpened}
        onAfterLeave={this.onClosed}
      >
        <div
          vShow={this.value}
          role="dialog"
          aria-labelledby={this.title || message}
          class={[bem(), this.className]}
        >
          {Title}
          {Content}
          {ButtonGroup}
        </div>
      </transition>
    );
  }
});

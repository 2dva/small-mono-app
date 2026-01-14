class ScrollEventEmitter extends EventTarget {
    on(listener: EventListenerOrEventListenerObject) {
        this.addEventListener('layout-scroll', listener);
    }

    emit() {
        const event = new CustomEvent('layout-scroll')
        this.dispatchEvent(event);
    }
}

export const layoutScrollEvent = new ScrollEventEmitter()

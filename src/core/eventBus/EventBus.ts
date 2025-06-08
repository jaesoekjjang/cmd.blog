type EventHandler<T> = (data: T) => void;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export class EventBus<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: Set<EventHandler<TEvents[K]>>;
  } = {};

  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(handler);
  }

  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.delete(handler);
      if (eventListeners.size === 0) {
        delete this.listeners[event];
      }
    }
  }

  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      for (const handler of eventListeners) {
        handler(data);
      }
    }
  }

  removeAllListeners<K extends keyof TEvents>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      for (const key in this.listeners) {
        delete this.listeners[key as keyof TEvents];
      }
    }
  }

  getListenerCount<K extends keyof TEvents>(event: K): number {
    return this.listeners[event]?.size ?? 0;
  }
}


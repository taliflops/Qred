import { EventEmitter } from 'node:events';

export interface CardActivatedEvent {
  type: 'CardActivated';
  occurredAt: string;
}

export class EventBus {
  private readonly emitter = new EventEmitter();

  publish(event: CardActivatedEvent): void {
    this.emitter.emit(event.type, event);
  }

  subscribe(type: CardActivatedEvent['type'], handler: (event: CardActivatedEvent) => void): void {
    this.emitter.on(type, handler);
  }
}
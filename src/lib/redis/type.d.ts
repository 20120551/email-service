interface IEvent {
    name: string
}

interface IEventHandler<TEvent extends IEvent> {
    handle(event: TEvent): Promise<void>
}

interface IEventBus {
    handle(event: IEvent): Promise<void>
}

interface RedisPubsub {
    publish(topic: string, event: IEvent): Promise<number>,
    subscribe(topic: string): Promise<void>
}
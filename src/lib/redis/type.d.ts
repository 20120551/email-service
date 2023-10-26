interface IEvent {
    name: string
}

interface IEventHandler<TEvent extends IEvent> {
    event: string,
    handle(event: TEvent): Promise<void>
}

interface IEventBus {
    handle(event: IEvent): Promise<void>,
    register(name: string, handler: IEventHandler)
}

interface RedisPubsub {
    publish<TEvent extends IEvent>(topic: string, event: TEvent): Promise<number>,
    subscribe(topic: string, bus: IEventBus): Promise<void>
}


interface RedisCache {
    get<T>(key: string): Promise<T | null>,
    set<T>(topic: string, message: T, expirationTime: number): Promise<void>,
    del(key: string): Promise<boolean>
}
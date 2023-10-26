export default class EventBus implements IEventBus {
    private handlers: Map<string, IEventHandler<IEvent>> = new Map();
    register(name: string, handler: any) {
        this.handlers.set(name, handler);
    }
    handle(event: IEvent): Promise<void> {
        console.log(event);
        const handler = this.handlers.get(event.name);
        if (!handler) {
            throw new Error(`${event.name} is not registered`);
        }

        return handler.handle(event);
    }

}
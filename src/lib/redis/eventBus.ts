export default class EventBus implements IEventBus {
    private handlers: Map<string, IEventHandler<IEvent>> = new Map();
    handle(event: IEvent): Promise<void> {
        const handler = this.handlers.get(event.name);
        if (!handler) {
            throw new Error(`${event.name} is not registered`);
        }

        return handler.handle(event);
    }

}
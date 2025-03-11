
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class EventType {
    availableTickets: number;
    date: DateTime;
    id: number;
    name: string;
    totalTickets: number;
}

export abstract class IMutation {
    abstract purchaseTickets(eventId: number, quantity: number): OrderType | Promise<OrderType>;
}

export class OrderType {
    createdAt: DateTime;
    event: EventType;
    id: number;
    orderNumber: string;
    quantity: number;
}

export abstract class IQuery {
    abstract events(): EventType[] | Promise<EventType[]>;

    abstract hello(): string | Promise<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;

import { EventFeeType, EventStatus, EventVisibility } from "../../../generated/prisma/enums";

export type TCreateEvent = {
    title: string;
    description: string;
    date: string;
    time: string;
    endDate?: string;
    venue?: string;
    eventLink?: string;
    banner?: string;
    visibility: EventVisibility;
    feeType: EventFeeType;
    registrationFee?: number;
    currency?: string;
    maxCapacity?: number;
    categoryId?: string;
};

export type TUpdateEvent = Partial<TCreateEvent> & {
    status?: EventStatus;
};

export type TEventQuery = {
    search?: string;
    visibility?: EventVisibility;
    feeType?: EventFeeType;
    status?: EventStatus;
    categoryId?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};
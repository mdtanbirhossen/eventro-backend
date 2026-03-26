export interface ICreatePaymentPayload {
  eventId: string;
  invitationId?: string; // optional if payment is for invitation
}
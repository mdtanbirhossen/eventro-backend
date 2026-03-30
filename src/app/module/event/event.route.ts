import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { EventController } from "./event.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { optionalCheckAuth } from "../../middleware/optionalCheckAuth";

const router = Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES  (no auth required)
// ─────────────────────────────────────────────

router.get("/featured", EventController.getFeaturedEvent);
router.get("/", EventController.getAllEvents);

// Event details — public for PUBLIC events.
// Private event visibility is enforced inside the service using req.user?.userId.
// We intentionally do NOT gate this with checkAuth so unauthenticated users can
// still reach public event pages; the service returns 403 for private events.
router.get("/:id", optionalCheckAuth(), EventController.getEventById);

// ─────────────────────────────────────────────
// AUTHENTICATED USER ROUTES  (any logged-in role)
// ─────────────────────────────────────────────

// Dashboard — my created events & joined events
router.get(
    "/me/events",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.getMyEvents,
);
router.get(
    "/me/joined",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.getMyParticipation,
);

// Invitations inbox & response
router.get(
    "/invitations/me",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.getMyInvitations,
);
router.patch(
    "/invitations/:invitationId",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.respondToInvitation,
);

// Event CRUD (owner)
router.post("/", checkAuth(Role.USER, Role.ADMIN), EventController.createEvent);
router.put(
    "/:id",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.updateEvent,
);
router.delete(
    "/:id",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.deleteEvent,
);

// Join / request to join
router.post(
    "/:id/join",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.joinEvent,
);

// Invite a user (owner only — ownership is re-checked inside the service)
router.post(
    "/:id/invite",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.inviteUser,
);

// Participant management (owner only — ownership re-checked in service)
router.get(
    "/:id/participants",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.getEventParticipants,
);
router.patch(
    "/:id/participants/:userId/approve",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.approveParticipant,
);
router.patch(
    "/:id/participants/:userId/reject",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.rejectParticipant,
);
router.patch(
    "/:id/participants/:userId/ban",
    checkAuth(Role.USER, Role.ADMIN),
    EventController.banParticipant,
);

// ─────────────────────────────────────────────
// ADMIN-ONLY ROUTES
// ─────────────────────────────────────────────

router.get(
    "/admin/all",
    checkAuth(Role.ADMIN),
    EventController.getAllEventsAdmin,
);
router.delete(
    "/admin/:id",
    checkAuth(Role.ADMIN),
    EventController.adminDeleteEvent,
);
router.patch(
    "/admin/:id/feature",
    checkAuth(Role.ADMIN),
    EventController.setFeaturedEvent,
);

export const EventRoutes = router;

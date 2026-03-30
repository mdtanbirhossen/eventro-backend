import { prisma } from "../../lib/prisma";

const getAdminDashboardStats = async () => {
    const [
        totalUsers,
        totalEvents,
        totalPayments,
        revenueResult,
        pendingParticipants,
        activeEvents,
    ] = await Promise.all([
        // Total registered users (non-deleted)
        prisma.user.count({
            where: { isDeleted: false },
        }),

        // Total events (non-deleted)
        prisma.event.count({
            where: { isDeleted: false },
        }),

        // Total payment records
        prisma.payment.count(),

        // Sum of all PAID payments
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "PAID" },
        }),

        // Participants still waiting for approval
        prisma.eventParticipant.count({
            where: { status: "PENDING" },
        }),

        // Events currently published and not deleted
        prisma.event.count({
            where: {
                status: "PUBLISHED",
                isDeleted: false,
            },
        }),
    ]);

    return {
        totalUsers,
        totalEvents,
        totalPayments,
        totalRevenue: (revenueResult._sum.amount ?? 0).toString(),
        pendingParticipants,
        activeEvents,
    };
};

export const StatsService = {
    
    getAdminDashboardStats,
};

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ParticipantStatus } from "../../../generated/prisma/enums";

const createReview = async (
  userId: string,
  payload: { eventId: string; rating: number; comment?: string }
) => {
  const { eventId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new AppError(status.BAD_REQUEST, "Rating must be between 1 and 5!");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Event not found!");
  }

  // user must be approved participant to review
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId,
      status: ParticipantStatus.APPROVED,
    },
  });

  if (!participant) {
    throw new AppError(
      status.FORBIDDEN,
      "You must join and be approved to review this event!"
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      eventId,
      userId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new AppError(status.CONFLICT, "You already reviewed this event!");
  }

  const review = await prisma.review.create({
    data: {
      eventId,
      userId,
      rating,
      comment,
    },
  });

  return review;
};

const getReviewsByEvent = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Event not found!");
  }

  const reviews = await prisma.review.findMany({
    where: {
      eventId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getMyReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          banner: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const updateReview = async (
  userId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Review not found!");
  }

  if (review.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You are not allowed to update this review!");
  }

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new AppError(status.BAD_REQUEST, "Rating must be between 1 and 5!");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating ?? review.rating,
      comment: payload.comment ?? review.comment,
      isEdited: true,
      editedAt: new Date(),
    },
  });

  return updatedReview;
};

const deleteReview = async (userId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Review not found!");
  }

  if (review.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You are not allowed to delete this review!");
  }

  const deletedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedReview;
};

export const ReviewService = {
  createReview,
  getReviewsByEvent,
  getMyReviews,
  updateReview,
  deleteReview,
};
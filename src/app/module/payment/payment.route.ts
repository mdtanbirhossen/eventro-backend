import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
    "/create-session",
    checkAuth(Role.USER, Role.ADMIN),
    PaymentController.createPaymentSession,
);

// SSLCommerz callbacks
router.post("/sslcommerz/success", PaymentController.sslcommerzSuccess);
router.post("/sslcommerz/fail", PaymentController.sslcommerzFail);
router.post("/sslcommerz/cancel", PaymentController.sslcommerzCancel);

// payment history
router.get(
    "/my",
    checkAuth(Role.USER, Role.ADMIN),
    PaymentController.getMyPayments,
);

router.get(
    "/transaction/:transactionId",
    checkAuth(Role.USER, Role.ADMIN),
    PaymentController.getPaymentByTransactionId,
);
// admin
router.get("/", checkAuth(Role.ADMIN), PaymentController.getAllPaymentsAdmin);

export const PaymentRoutes = router;

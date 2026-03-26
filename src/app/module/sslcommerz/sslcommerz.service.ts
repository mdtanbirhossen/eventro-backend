import axios from "axios";
import { envVars } from "../../config/env";

interface ISslcommerzInitPayload {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;

    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;

    product_name: string;
    product_category: string;
    product_profile: string;
}

const sslcommerzInitPayment = async (payload: ISslcommerzInitPayload) => {
    const url = `${envVars.SSLCOMMERZ.BASE_URL}/gwprocess/v4/api.php`;

    const data = {
        store_id: envVars.SSLCOMMERZ.STORE_ID,
        store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
        ...payload,
    };

    const response = await axios.post(url, data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return response.data;
};

const sslcommerzValidatePayment = async (val_id: string) => {
    const url = `${envVars.SSLCOMMERZ.BASE_URL}/validator/api/validationserverAPI.php`;

    const response = await axios.get(url, {
        params: {
            val_id,
            store_id: envVars.SSLCOMMERZ.STORE_ID,
            store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
            format: "json",
        },
    });

    return response.data;
};

export const SSLCommerzService = {
    sslcommerzInitPayment,
    sslcommerzValidatePayment,
};

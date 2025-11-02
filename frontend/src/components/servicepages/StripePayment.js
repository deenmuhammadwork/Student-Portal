import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "bootstrap/dist/css/bootstrap.min.css";

const stripePromise = loadStripe("pk_test_51S0HXjGZwTv0wMspmbKha0IlXNfe4Vbcsc9L6ZjutbNmxNCv1ADy9eOk6AmOdBuIWnCWAKXHqajqgYw2fGIBtH5T008VuKEyIb");

const StripePaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
  "http://localhost:5000/api/auth/create-payment-intent", 
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  }
);

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError("Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0">
          {/* Header */}
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Pay with Card</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              disabled={processing}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p className="fw-bold">
              Total Amount:{" "}
              <span className="text-success">
                Rs. {amount.toLocaleString()}
              </span>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 p-3 border rounded bg-light">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": { color: "#aab7c4" },
                      },
                      invalid: { color: "#9e2146" },
                    },
                  }}
                />
              </div>

              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancel}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!stripe || processing}
                >
                  {processing
                    ? "Processing..."
                    : `Pay Rs. ${amount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

const StripePayment = (props) => (
  <Elements stripe={stripePromise}>
    <StripePaymentForm {...props} />
  </Elements>
);

export default StripePayment;

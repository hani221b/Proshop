package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
)

type CheckoutDetails struct {
	OrderID string                 `json:"orderId"`
	Order map[string]interface{} `json:"order"` 
}

func HandleCheckout(w http.ResponseWriter, r *http.Request) {
	var payload CheckoutDetails

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if payload.OrderID == "" {
		http.Error(w, "Missing orderId", http.StatusBadRequest)
		return
	}

	priceFloat, ok := payload.Order["totalPrice"].(float64)
	if !ok {
		http.Error(w, "Error while calculting the amonut!", http.StatusBadRequest)
		return
	}

	unitAmount := int64(priceFloat * 100)

	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String("http://localhost:5004/api/payment/success"),
		CancelURL:  stripe.String("http://localhost:5004/api/payment/cancel"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String(string(stripe.CurrencyUSD)),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("T-shirt"),
					},
					UnitAmount: stripe.Int64(unitAmount),
				},
				Quantity: stripe.Int64(1),
			},
		},
	}

	session, err := session.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url": session.URL,
	})
}

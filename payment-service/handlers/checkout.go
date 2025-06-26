package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
)

func HandleCheckout(w http.ResponseWriter, r *http.Request) {
	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String("http://localhost:5004/success"),
		CancelURL:  stripe.String("http://localhost:5004/cancel"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String(string(stripe.CurrencyUSD)),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("T-shirt"),
					},
					UnitAmount: stripe.Int64(1500),
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

	// http.Redirect(w, r, s.URL, http.StatusSeeOther)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url": session.URL,
	})
}

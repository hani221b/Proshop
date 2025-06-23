package handlers

import (
	"net/http"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/charge"
)

func HandlePayment(w http.ResponseWriter, r *http.Request) {
	params := &stripe.ChargeParams{
		Amount:      stripe.Int64(2000),
		Currency:    stripe.String(string(stripe.CurrencyUSD)),
		Description: stripe.String("Payment Service Test"),
	}

	params.SetSource("tok_visa") 

	ch, err := charge.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Charge successful! ID: " + ch.ID))
}

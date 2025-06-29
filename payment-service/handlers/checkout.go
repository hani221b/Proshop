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
	var itemsList []*stripe.CheckoutSessionLineItemParams
	
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if payload.OrderID == "" {
		http.Error(w, "Missing orderId", http.StatusBadRequest)
		return
	}

	items := payload.Order["orderItems"].([]interface{})

	
	for _, item := range items {
		 itm := item.(map[string]interface{})

		name := itm["name"].(string)
		qty := int64(itm["qty"].(float64)) 
		price := int64(itm["price"].(float64) * 100)

		lineItem := &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String(string(stripe.CurrencyUSD)),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String(name),
				},
				UnitAmount: stripe.Int64(price),
			},
			Quantity: stripe.Int64(qty),
		}

		itemsList = append(itemsList, lineItem)

	}
	shippingPriceFloat := payload.Order["shippingPrice"].(float64)
	shipmentItemLine := &stripe.CheckoutSessionLineItemParams{
		PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
			Currency: stripe.String(string(stripe.CurrencyUSD)),
			ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
				Name: stripe.String("Shipment"),
			},
			UnitAmount: stripe.Int64(int64(shippingPriceFloat)),
		},
		Quantity: stripe.Int64(1),
	}

	taxPriceFloat := payload.Order["taxPrice"].(float64)
	taxPriceCents := int64(taxPriceFloat * 100)
	TaxItemLine := &stripe.CheckoutSessionLineItemParams{
		PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
			Currency: stripe.String(string(stripe.CurrencyUSD)),
			ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
				Name: stripe.String("Tax"),
			},
			UnitAmount: stripe.Int64(taxPriceCents),
		},
		Quantity: stripe.Int64(1),
	}

	itemsList = append(itemsList, shipmentItemLine)
	itemsList = append(itemsList, TaxItemLine)

	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String("http://localhost:5004/api/payment/success"),
		CancelURL:  stripe.String("http://localhost:5004/api/payment/cancel"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems:  itemsList,
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

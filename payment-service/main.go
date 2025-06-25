package main

import (
	"log"
	"net/http"

	"proshop.local/payment-service/stripe"
	"proshop.local/payment-service/middleware"
	"proshop.local/payment-service/routes"
)

func main() {
	stripe.InitStripe()

	mux := http.NewServeMux()
	mux.Handle("/api/payment/", middleware.CorsMiddleware(routes.PaymentRouter()))

	log.Println("Server running on http://localhost:5004")
	log.Fatal(http.ListenAndServe(":5004", mux))
}

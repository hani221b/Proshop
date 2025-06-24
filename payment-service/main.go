package main

import (
	"log"
	"net/http"

	"example.com/payment-service/handlers"
	"example.com/payment-service/stripe"
)

func main() {
	stripe.InitStripe()

	http.HandleFunc("/checkout", handlers.HandleCheckout)
	// http.HandleFunc("/pay", handlers.HandlePayment) 
	http.HandleFunc("/success", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("✅ Payment successful!"))
	})
	http.HandleFunc("/cancel", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("❌ Payment cancelled."))
	})

	log.Println("Server running on http://localhost:5004")
	log.Fatal(http.ListenAndServe(":5004", nil))
}

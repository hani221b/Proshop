package routes

import (
	"net/http"
	"strings"

	"proshop.local/payment-service/handlers"
)

func PaymentRouter() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Strip the prefix before handling
		path := strings.TrimPrefix(r.URL.Path, "/api/payment")
		r.URL.Path = path

		switch {
		case path == "/checkout" && r.Method == "GET":
			handlers.HandleCheckout(w, r)
		case path == "/success" && r.Method == "GET":
			w.Write([]byte("✅ Payment successful!"))
		case path == "/cancel" && r.Method == "GET":
			w.Write([]byte("❌ Payment cancelled."))
		default:
			http.NotFound(w, r)
		}
	})
}
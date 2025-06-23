package stripe

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/stripe/stripe-go/v78"
)

func InitStripe() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env")
	}
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
}

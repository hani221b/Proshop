FROM golang:1.22

WORKDIR /app

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH

COPY . . 

RUN go get -u github.com/stripe/stripe-go/v82
RUN go get github.com/joho/godotenv


CMD ["go", "run", "main.go"]

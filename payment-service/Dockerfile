FROM golang:1.22

WORKDIR /app

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH

COPY . . 

RUN go install github.com/stripe/stripe-go/v78@latest

CMD ["go", "run", "main.go"]

FROM golang:alpine

# Create app workspace
RUN mkdir /app
COPY . /app/
WORKDIR /app

# Build
RUN go build -o serv .

# Run on port 8100
EXPOSE 8100

CMD ["./serv", "-p", "8100", "-f", "/mnt/content"]

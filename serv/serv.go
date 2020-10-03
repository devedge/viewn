package main

import (
	"log"
	"github.com/jessevdk/go-flags"
	"github.com/valyala/fasthttp"
	"os"
)

var opts struct {
	IP   string `short:"i" long:"ip" description:"Local IP to bind to" default:"0.0.0.0"`
	Port string `short:"p" long:"port" description:"Port number" default:"8080"`
	File string `short:"f" long:"file" description:"A file or directory to serve"`
}

func main() {
	_, err := flags.Parse(&opts)
	if err != nil {
		os.Exit(1)
	}

	if opts.File == "" {
		log.Fatalf("A file/directory must be specified (-f)")
	}

	address := opts.IP + ":" + opts.Port

	if err := fasthttp.ListenAndServe(address, requestHandler); err != nil {
		log.Fatalf("Error in server: %s", err)
	}
}

func requestHandler(ctx *fasthttp.RequestCtx) {
	filesHandler := fasthttp.FSHandler(opts.File, 0)
	// change to fasthttp.ServeFile when implementing the real fileserver?
	filesHandler(ctx)
}

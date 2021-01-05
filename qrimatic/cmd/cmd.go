package cmd

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	golog "github.com/ipfs/go-log"
	"github.com/mitchellh/go-homedir"
	"github.com/qri-io/ioes"
)

var log = golog.Logger("cmd")

// Execute runs the qri command line program
func Execute() {
	if os.Getenv("QRIMATIC_BACKTRACE") != "" {
		// Catch errors & pretty-print.
		defer func() {
			if r := recover(); r != nil {
				if err, ok := r.(error); ok {
					fmt.Println(err.Error())
				} else {
					fmt.Println(r)
				}
			}
		}()
	}

	// root context
	ctx := context.Background()

	qriPath := os.Getenv("QRI_PATH")
	if qriPath == "" {
		home, err := homedir.Dir()
		if err != nil {
			panic(err)
		}
		qriPath = filepath.Join(home, ".qri")
	}

	root := NewRootCommand(ctx, ioes.NewStdIOStreams(), qriPath)
	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}

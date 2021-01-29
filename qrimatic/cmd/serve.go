package cmd

import (
	"context"

	"github.com/qri-io/ioes"
	"github.com/qri-io/qrimatic/update"
	"github.com/spf13/cobra"
)

func NewServeCommand(ctx context.Context, streams ioes.IOStreams, repoPath string) *cobra.Command {
	o := ServeOptions{}
	cmd := &cobra.Command{
		Use: "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			server, err := update.NewService(ctx, streams, repoPath, o.Setup)
			if err != nil {
				return err
			}

			return server.Serve(ctx)
		},
	}

	cmd.Flags().BoolVarP(&o.Setup, "setup", "", false, "run setup if necessary, reading options from environment variables")

	return cmd
}

type ServeOptions struct {
	Setup bool
}

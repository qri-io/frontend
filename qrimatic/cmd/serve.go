package cmd

import (
	"context"

	"github.com/qri-io/ioes"
	"github.com/qri-io/qrimatic/update"
	"github.com/spf13/cobra"
)

func NewServeCommand(ctx context.Context, streams ioes.IOStreams, repoPath string) *cobra.Command {
	cmd := &cobra.Command{
		Use: "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			server, err := update.NewServer(ctx, streams, repoPath)
			if err != nil {
				return err
			}

			return server.Serve(ctx)
		},
	}

	return cmd
}

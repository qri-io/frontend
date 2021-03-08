package cmd

import (
	"context"

	"github.com/qri-io/ioes"
	"github.com/spf13/cobra"
)

// NewRootCommand creates a root command
func NewRootCommand(ctx context.Context, streams ioes.IOStreams, repoPath string) *cobra.Command {

	cmd := &cobra.Command{
		Use:  "qrimatic",
		Long: ``,
	}

	cmd.AddCommand(NewServeCommand(ctx, streams, repoPath))
	return cmd
}

// RootOptions encapsulates fields for the root qrimatic command
type RootOptions struct {
	IOStreams ioes.IOStreams
}

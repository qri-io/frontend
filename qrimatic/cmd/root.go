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

	client, err := NewClientCommands(streams, repoPath)
	if err != nil {
		panic(err)
	}
	for _, sub := range client.Commands(ctx) {
		cmd.AddCommand(sub)
	}

	return cmd
}

// RootOptions encapsulates fields for the root qrimatic command
type RootOptions struct {
	IOStreams ioes.IOStreams
}

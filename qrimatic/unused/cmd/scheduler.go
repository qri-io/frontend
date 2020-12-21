package cmd

import (
	"context"

	"github.com/qri-io/ioes"
	"github.com/spf13/cobra"
)

// NewSchedulerCommand creates a scheduler command
func NewSchedulerCommand(ctx context.Context, repoPath string, ioStreams ioes.IOStreams) *cobra.Command {
	cmd := &cobra.Command{
		Use:  "qrid",
		Long: ``,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
		},
	}

	cmd.AddCommand(
	// NewAutocompleteCommand(opt, ioStreams),
	)

	return cmd
}

package cmd

import (
	"context"
	"errors"

	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/api"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/scheduler/update"
	"github.com/spf13/cobra"
)

func NewServeCommand(ctx context.Context, streams ioes.IOStreams, repoPath string) *cobra.Command {
	cmd := &cobra.Command{
		Use: "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			repoErr := lib.QriRepoExists(repoPath)
			if repoErr != nil {
				return errors.New("no qri repo exists\nhave you run 'qri setup'?")
			}

			opts := []lib.Option{
				lib.OptIOStreams(streams), // transfer iostreams to instance
				// lib.OptCheckConfigMigrations(o.migrationApproval, (!o.Migrate && !o.NoPrompt)),
				// lib.OptSetLogAll(o.LogAll),
				// lib.OptRemoteOptions([]remote.OptionsFunc{
				// 	// look for a remote policy
				// 	remote.OptLoadPolicyFileIfExists(filepath.Join(o.repoPath, access.DefaultAccessControlPolicyFilename)),
				// }),
			}

			inst, err := lib.NewInstance(ctx, repoPath, opts...)
			if err != nil {
				return err
			}

			svc, err := update.NewService(inst)
			if err != nil {
				return err
			}

			s := api.New(inst)
			svc.AddRoutes(s.Mux)

			go func() {
				if err := s.Serve(ctx); err != nil {
					log.Errorf("starting cron http server: %s", err)
				}
			}()

			return svc.Start(ctx)
		},
	}

	return cmd
}

package update

import (
	"context"
	"errors"

	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/api"
	"github.com/qri-io/qri/lib"
)

type Server struct {
	inst *lib.Instance
	svc  *Service
}

func NewServer(ctx context.Context, streams ioes.IOStreams, repoPath string) (*Server, error) {
	repoErr := lib.QriRepoExists(repoPath)
	if repoErr != nil {
		return nil, errors.New("no qri repo exists\nhave you run 'qri setup'?")
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
		return nil, err
	}

	svc, err := NewService(inst)
	if err != nil {
		return nil, err
	}

	return &Server{
		inst: inst,
		svc:  svc,
	}, nil
}

func (s *Server) Serve(ctx context.Context) error {
	apiServer := api.New(s.inst)
	s.svc.AddRoutes(apiServer.Mux, apiServer.Middleware)
	apiServer.Mux.Handle("/deploy", apiServer.Middleware(s.svc.NewDeployHandler("/deploy")))

	go func() {
		if err := apiServer.Serve(ctx); err != nil {
			log.Errorf("starting cron http server: %s", err)
		}
	}()

	return s.svc.Start(ctx)
}

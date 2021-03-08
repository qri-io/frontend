package cmd

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/gorilla/mux"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/api"
	"github.com/qri-io/qri/cmd"
	"github.com/qri-io/qri/config"
	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qri/repo/gen"
	qmapi "github.com/qri-io/qrimatic/api"
	"github.com/spf13/cobra"
)

func NewServeCommand(ctx context.Context, streams ioes.IOStreams, repoPath string) *cobra.Command {
	o := ServeOptions{}
	cmd := &cobra.Command{
		Use: "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			return o.Run(ctx, streams, repoPath, o.Setup)
		},
	}

	cmd.Flags().BoolVarP(&o.Setup, "setup", "", false, "run setup if necessary, reading options from environment variables")

	return cmd
}

type ServeOptions struct {
	Setup bool
}

func (o *ServeOptions) Run(ctx context.Context, streams ioes.IOStreams, repoPath string, setup bool) error {
	repoErr := lib.QriRepoExists(repoPath)
	if repoErr != nil && setup {
		log.Debugf("repoErr: %q", repoErr.Error())
		if err := setupRepo(ctx, streams, repoPath); err != nil {
			return err
		}
	}

	repoErr = lib.QriRepoExists(repoPath)
	if repoErr != nil {
		return errors.New("no qri repo exists\nhave you run 'qri setup'?")
	}

	opts := []lib.Option{
		lib.OptIOStreams(streams),
	}

	inst, err := lib.NewInstance(ctx, repoPath, opts...)
	if err != nil {
		return err
	}

	qriCoreServer := api.New(inst)
	qriCoreServer.Mux = mux.NewRouter()

	srv, err := qmapi.NewServer(inst)
	if err != nil {
		return err
	}

	srv.AddRoutes(qriCoreServer.Mux, "", qriCoreServer.Middleware)

	go func() {
		if err := qriCoreServer.Serve(ctx); err != nil {
			log.Errorf("starting cron http server: %s", err)
		}
	}()

	return srv.Start(ctx)
}

func setupRepo(ctx context.Context, streams ioes.IOStreams, repoPath string) error {
	o := cmd.SetupOptions{IOStreams: streams, Generator: gen.NewCryptoSource()}
	cfg := config.DefaultConfig()
	envVars := map[string]*string{
		"QRI_SETUP_CONFIG_DATA":      &o.ConfigData,
		"QRI_SETUP_IPFS_CONFIG_DATA": &o.IPFSConfigData,
	}
	mapEnvVars(envVars)

	if o.ConfigData != "" {
		if err := readAtFile(&o.ConfigData); err != nil {
			return err
		}

		err := json.Unmarshal([]byte(o.ConfigData), cfg)
		if cfg.Profile != nil {
			o.Username = cfg.Profile.Peername
		}
		if err != nil {
			return err
		}
	}

	cfg.Profile.Peername = o.Username

	// If a username was passed with the --username flag or entered by prompt, make sure its valid
	if cfg.Profile.Peername != "" {
		if err := dsref.EnsureValidUsername(cfg.Profile.Peername); err != nil {
			return err
		}
	}

	p := lib.SetupParams{
		Config:    cfg,
		RepoPath:  repoPath,
		SetupIPFS: true,
		Register:  o.Registry == "none",
		Generator: o.Generator,
	}

	if o.IPFSConfigData != "" {
		if err := readAtFile(&o.IPFSConfigData); err != nil {
			return err
		}
		p.SetupIPFSConfigData = []byte(o.IPFSConfigData)
	}

	return lib.Setup(p)
}

func mapEnvVars(vars map[string]*string) {
	for envVar, value := range vars {
		envVal := os.Getenv(envVar)
		if envVal != "" {
			fmt.Printf("reading %s from env\n", envVar)
			*value = envVal
		}
	}
}

// readAtFile is a unix curl inspired method. any data input that begins with "@"
// is assumed to instead be a filepath that should be read & replaced with the contents
// of the specified path
func readAtFile(data *string) error {
	d := *data
	if len(d) > 0 && d[0] == '@' {
		fileData, err := ioutil.ReadFile(d[1:])
		if err != nil {
			return err
		}
		*data = string(fileData)
	}
	return nil
}

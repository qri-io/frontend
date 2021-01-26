package cmd

import (
	"context"
	"fmt"

	util "github.com/qri-io/apiutil"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/errors"
	"github.com/qri-io/qri/lib"
	reporef "github.com/qri-io/qri/repo/ref"
	"github.com/qri-io/qrimatic/update"
	"github.com/spf13/cobra"
)

// ClientCommands wraps a set of commands for interacting with the update
// service
type ClientCommands struct {
	ioes.IOStreams
	updates *update.Client

	Ref     string
	Title   string
	Message string

	BodyPath  string
	FilePaths []string
	Recall    string

	Publish    bool
	DryRun     bool
	NoRender   bool
	Force      bool
	KeepFormat bool
	Secrets    []string

	Daemonize bool
	Page      int
	PageSize  int

	// specifies custom repo location when scheduling a workflow,
	// should only be set if --repo persistent flag is set
	RepoPath string
}

// NewClientCommands creates a client commands
func NewClientCommands(streams ioes.IOStreams, repoPath string) (*ClientCommands, error) {
	updateClient, err := update.NewClient(repoPath)
	return &ClientCommands{
		IOStreams: streams,
		updates:   updateClient,
	}, err
}

func (client *ClientCommands) Commands(ctx context.Context) []*cobra.Command {
	return []*cobra.Command{
		client.NewStatusCommand(ctx),
		client.NewListCommand(ctx),
		client.NewScheduleCommand(ctx),
		client.NewUnscheduleCommand(ctx),
		client.NewLogsCommand(ctx),
		client.NewRunCommand(ctx),
	}
}

func (client *ClientCommands) NewStatusCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "status",
		Short: "show update daemon status",
		Args:  cobra.NoArgs,
		RunE: func(c *cobra.Command, args []string) error {
			return client.ServiceStatus()
		},
	}

	return cmd
}

func (client *ClientCommands) NewListCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "list",
		Aliases: []string{"ls"},
		Short:   "list scheduled updates",
		Long: `Update list gives you a view into the upcoming scheduled updates, starting
with the most immediate update.
	`,
		Example: `  # List the upcoming updates:
  $ qrimatic list
  1. b5/my_dataset
  in 4 hours 4:19PM | dataset

  2. b5/my_next_dataset
  in 2 days 5:22PM | dataset
  `,
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.List(ctx)
		},
	}

	cmd.Flags().IntVar(&client.Page, "page", 1, "page number results, default 1")
	cmd.Flags().IntVar(&client.PageSize, "page-size", 25, "page size of results, default 25")

	return cmd
}

func (client *ClientCommands) NewScheduleCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "schedule DATASET [PERIOD]",
		Short: "schedule an update",
		Long: `Schedule a dataset using all the same flags as the save command,
except you must provide a periodicity (or have a periodicity set in your 
dataset's Meta component. The given periodicity must be in the ISO 8601
repeated duration format (for more information of ISO 8601, check out 
	https://www.digi.com/resources/documentation/digidocs/90001437-13/reference/r_iso_8601_duration_format.htm)

Like the update Run command, the Schedule command assumes you want to recall 
the most recent transform in the dataset.

You can schedule an update for a dataset that has already been created, 
a dataset you are creating for the first time, or a shell script that 
calls "qri save" to update a dataset.

IMPORTANT: use the "qrimatic service" status command to ensure that the process
responsible for executing your scheduled updates is currently active.`,
		Example: `  # Schedule the weekly update of a dataset you have already created:
  $ qrimatic schedule b5/my_dataset R/P1W
  qri scheduled b5/my_dataset, next update: 2019-05-14 20:15:13.191602 +0000 UTC

  # Schedule the daily update of a dataset that you are creating for the first 
  # time:
  $ qrimatic schedule --file dataset.yaml b5/my_dataset R/P1D
  qri scheduled b5/my_dataset, next update: 2019-05-08 20:15:13.191602 +0000 UTC
  `,
		Args: cobra.MaximumNArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.Schedule(ctx, args)
		},
	}

	cmd.Flags().StringVarP(&client.Title, "title", "t", "", "title of commit message for update")
	cmd.Flags().StringVarP(&client.Message, "message", "m", "", "commit message for update")
	cmd.Flags().StringVarP(&client.Recall, "recall", "", "", "restore revisions from dataset history, only 'tf' applies when updating")
	cmd.Flags().StringSliceVar(&client.Secrets, "secrets", nil, "transform secrets as comma separated key,value,key,value,... sequence")
	cmd.Flags().BoolVarP(&client.Publish, "publish", "p", false, "publish successful update to the registry")
	cmd.Flags().BoolVar(&client.DryRun, "dry-run", false, "simulate updating a dataset")
	cmd.Flags().BoolVarP(&client.NoRender, "no-render", "n", false, "don't store a rendered version of the the vizualization ")
	cmd.Flags().StringSliceVarP(&client.FilePaths, "file", "f", nil, "dataset or component file (yaml or json)")
	cmd.Flags().StringVarP(&client.BodyPath, "body", "", "", "path to file or url of data to add as dataset contents")
	cmd.Flags().BoolVar(&client.Force, "force", false, "force a new commit, even if no changes are detected")
	cmd.Flags().BoolVarP(&client.KeepFormat, "keep-format", "k", false, "convert incoming data to stored data format")
	cmd.Flags().StringVar(&client.RepoPath, "use-repo", "", "experiment. run update on behalf of another repo")

	return cmd
}

func (client *ClientCommands) NewUnscheduleCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unschedule DATASET",
		Short: "unschedule an update",
		Long: `Unscheduling an update removes that dataset from the list of
scheduled updates.
	`,
		Example: `  # Unschedule an update using the dataset name:
  $ qrimatic unschedule b5/my_dataset
  unscheduled b5/my_dataset
  `,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.Unschedule(ctx, args)
		},
	}

	return cmd
}

func (client *ClientCommands) NewLogsCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "logs [LOGNAME]",
		Aliases: []string{"log"},
		Short:   "show log of dataset updates",
		Long: `Update logs shows the log of the updates that have already run,
starting with the most recent. The log includes a timestamped name, the type of
update that occured (dataset or shell), and the time it occured.

Using the name of a specific log as a parameter gives you the output of that
update.
	`,
		Example: `  # List the log of previous updates:
  $ qrimatic logs
  1. 1557173933-my_dataset
  1 day ago | no changes to save

  2. 1557173585-my_dataset
  1 day ago | no changes to save
  ...

  # Get the output of one specific update:
  $ qrimatic log 1557173933-my_dataset
  dataset saved: b5/my_dataset@MSN9/ipfs/BntM
	`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.Runs(ctx, args)
		},
	}

	cmd.Flags().IntVar(&client.Page, "page", 1, "page number results, default 1")
	cmd.Flags().IntVar(&client.PageSize, "page-size", 25, "page size of results, default 25")
	return cmd
}

func (client *ClientCommands) NewRunCommand(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "run DATASET",
		Short: "execute an update immediately",
		Long: `Run allows you to execute an update immediately, rather then wait for
its scheduled time. Run uses the same parameters as the Save command, but
but assumes you want to recall the most recent transform in the dataset.
	`,
		Example: `  # Run an update:
  $ qrimatic run b5/my_dataset
  🤖  running transform...
  ✅ transform complete
  dataset saved: b5/my_dataset@MSN9/ipfs/2BntM
	`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.RunUpdate(ctx, args)
		},
	}

	cmd.Flags().StringVarP(&client.Title, "title", "t", "", "title of commit message for update")
	cmd.Flags().StringVarP(&client.Message, "message", "m", "", "commit message for update")
	cmd.Flags().StringVarP(&client.Recall, "recall", "", "", "restore revisions from dataset history, only 'tf' applies when updating")
	cmd.Flags().StringSliceVar(&client.Secrets, "secrets", nil, "transform secrets as comma separated key,value,key,value,... sequence")
	cmd.Flags().BoolVarP(&client.Publish, "publish", "p", false, "publish successful update to the registry")
	cmd.Flags().BoolVar(&client.DryRun, "dry-run", false, "simulate updating a dataset")
	cmd.Flags().BoolVarP(&client.NoRender, "no-render", "n", false, "don't store a rendered version of the the vizualization ")
	cmd.Flags().StringSliceVarP(&client.FilePaths, "file", "f", nil, "dataset or component file (yaml or json)")
	cmd.Flags().StringVarP(&client.BodyPath, "body", "", "", "path to file or url of data to add as dataset contents")
	cmd.Flags().BoolVar(&client.Force, "force", false, "force a new commit, even if no changes are detected")
	cmd.Flags().BoolVarP(&client.KeepFormat, "keep-format", "k", false, "convert incoming data to stored data format")

	return cmd
}

// Schedule adds a workflow to the update scheduler
func (client *ClientCommands) Schedule(ctx context.Context, args []string) (err error) {
	if len(args) < 1 {
		return errors.New(lib.ErrBadArgs, "please provide a dataset reference for updating")
	}
	p := &update.ScheduleParams{
		Name:       args[0],
		SaveParams: client.saveParams(),
		RepoPath:   client.RepoPath,
	}
	if len(args) > 1 {
		p.Periodicity = args[1]
	}

	res := &update.Workflow{}
	if err := client.updates.Schedule(ctx, p, res); err != nil {
		return err
	}

	fmt.Fprintf(client.ErrOut, "update scheduled, next update: %s\n", res.NextRunStart)
	return nil
}

// Unschedule removes a workflow from the scheduler
func (client *ClientCommands) Unschedule(ctx context.Context, args []string) (err error) {
	if len(args) < 1 {
		return errors.New(lib.ErrBadArgs, "please provide a name to unschedule")
	}

	var (
		name = args[0]
		res  bool
	)
	if err := client.updates.Unschedule(ctx, &name, &res); err != nil {
		return err
	}

	fmt.Fprintf(client.ErrOut, "update unscheduled: %s\n", args[0])
	return nil
}

// List shows scheduled update workflows
func (client *ClientCommands) List(ctx context.Context) (err error) {
	// convert Page and PageSize to Limit and Offset
	page := util.NewPage(client.Page, client.PageSize)
	p := &lib.ListParams{
		Offset: page.Offset(),
		Limit:  page.Limit(),
	}
	res := []*update.Workflow{}
	if err = client.updates.List(ctx, p, &res); err != nil {
		return
	}

	items := make([]fmt.Stringer, len(res))
	// iterate in reverse to show upcoming items first
	// TODO (b5) - this will have wierd interaction with pagination,
	// should use a more proper fix
	j := 0
	for i := len(res) - 1; i >= 0; i-- {
		items[j] = workflowStringer(*res[i])
		j++
	}
	printItems(client.Out, items, page.Offset())
	return
}

// Runs shows a history of workflow events
func (client *ClientCommands) Runs(ctx context.Context, args []string) (err error) {
	if len(args) == 1 {
		return client.LogFile(ctx, args[0])
	}

	// convert Page and PageSize to Limit and Offset
	page := util.NewPage(client.Page, client.PageSize)
	p := &lib.ListParams{
		Offset: page.Offset(),
		Limit:  page.Limit(),
	}

	res := []*update.Run{}
	if err = client.updates.Runs(ctx, p, &res); err != nil {
		return
	}

	items := make([]fmt.Stringer, len(res))
	for i, r := range res {
		items[i] = runStringer(*r)
	}
	printItems(client.Out, items, page.Offset())
	return
}

// LogFile prints a log output file
func (client *ClientCommands) LogFile(ctx context.Context, logName string) error {
	// data := []byte{}
	// if err := client.updates.LogFile(ctx, &logName, &data); err != nil {
	// 	return err
	// }

	// client.Out.Write(data)
	// return nil
	return fmt.Errorf("unfinished: LogFile command")
}

// ServiceStatus gets the current status of the update daemon
func (client *ClientCommands) ServiceStatus() error {
	// var in bool
	// res := &update.ServiceStatus{}
	// if err := client.updates.ServiceStatus(ctx, &in, res); err != nil {
	// 	return err
	// }

	// fmt.Fprint(client.Out, res.Name)
	// return nil
	return fmt.Errorf("not finished")
}

// RunUpdate executes an update immediately
func (client *ClientCommands) RunUpdate(ctx context.Context, args []string) (err error) {
	if len(args) < 1 {
		return errors.New(lib.ErrBadArgs, "please provide the name of an update to run")
	}

	var (
		name     = args[0]
		workflow = &update.Workflow{
			Name: name,
		}
	)

	res := &reporef.DatasetRef{}
	if err := client.updates.Run(ctx, workflow, res); err != nil {
		return err
	}

	fmt.Fprintf(client.Out, "updated dataset %s", res.AliasString())
	return nil
}

func (client *ClientCommands) saveParams() *lib.SaveParams {
	p := &lib.SaveParams{
		Ref:                 client.Ref,
		Title:               client.Title,
		Message:             client.Message,
		BodyPath:            client.BodyPath,
		FilePaths:           client.FilePaths,
		Recall:              client.Recall,
		DryRun:              client.DryRun,
		ShouldRender:        !client.NoRender,
		Force:               client.Force,
		ConvertFormatToPrev: client.KeepFormat,
	}

	if sec, err := parseSecrets(client.Secrets...); err != nil {
		log.Errorf("invalid secrets: %s", err.Error())
	} else {
		p.Secrets = sec
	}
	return p
}

// parseSecrets turns a key,value sequence into a map[string]string
func parseSecrets(secrets ...string) (map[string]string, error) {
	if len(secrets)%2 != 0 {
		return nil, fmt.Errorf("expected even number of (key,value) pairs for secrets")
	}
	s := map[string]string{}
	for i := 0; i < len(secrets); i = i + 2 {
		s[secrets[i]] = secrets[i+1]
	}
	return s, nil
}

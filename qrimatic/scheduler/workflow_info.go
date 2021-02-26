package scheduler

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
)

// WorkflowInfo is a simplified data structure that can be built from a Workflow
// It is primarily used for the `workflow/list` endpoint
type WorkflowInfo struct {
	dsref.VersionInfo
	ID          string         `json:"id"` // CID string
	LatestStart *time.Time     `json:"latestStart"`
	LatestEnd   *time.Time     `json:"latestEnd"`
	Status      WorkflowStatus `json:"status"`
}

// ListCollection returns a union of datasets and workflows in the form of `WorkflowInfo`s
// TODO (ramfox): add pagination by timestamp
func (c *Cron) ListCollection(ctx context.Context, inst *lib.Instance, before, after time.Time) ([]*WorkflowInfo, error) {
	m := lib.NewDatasetMethods(inst)
	// TODO (ramfox): for now we are fetching everything.
	p := &lib.ListParams{
		Offset: 0,
		Limit:  100000000000,
	}

	// TODO (ramfox): when we add in pagination, we should be using `after` and `before`
	// as our metrics. We should use those to search for the correct interval of datasets
	// and the correct interval of workflows

	// TODO (ramfox): goal is eventually to get version infos list in reverse
	// chronological order by activity
	// However dataset list does not have the ability to sort in a specified way
	vis := []dsref.VersionInfo{}
	fetchNext := true
	for fetchNext {
		v, err := m.List(ctx, p)
		if err != nil {
			log.Errorf("error getting datasets: %w", err)
			return nil, fmt.Errorf("error getting datasets: %w", err)
		}
		vis = append(vis, v...)
		if len(v) < p.Limit {
			fetchNext = false
		}
		p.Offset++
	}

	// -1 limit returns all workflows
	ws, err := c.store.ListWorkflows(ctx, 0, -1)
	if err != nil {
		log.Errorf("error getting workflows: %w", err)
		return nil, fmt.Errorf("error getting workflows: %w", err)
	}

	wiMap := map[string]*Workflow{}

	for _, w := range ws {
		wiMap[w.DatasetID] = w
	}

	wis := []*WorkflowInfo{}
	for _, vi := range vis {
		// DatasetID is currently `username/name`
		viID := vi.Alias()
		w, ok := wiMap[viID]
		if ok {
			w.VersionInfo = vi
			wis = append(wis, w.Info())
			continue
		}
		// TODO (ramfox): HACK - because frontend has no concept of identity yet
		// all workflows created by the frontend are sent with `Username='me'`
		w, ok = wiMap[fmt.Sprintf("me/%s", vi.Name)]
		if ok {
			w.VersionInfo = vi
			wis = append(wis, w.Info())
			continue
		}
		// TODO (ramfox): using the dataset alias as the workflow id for now
		// this should be replaced with the the `InitID`, once that is surfaced
		// in the `VersionInfo`
		wis = append(wis, &WorkflowInfo{VersionInfo: vi, ID: vi.Alias()})
	}

	sort.Slice(wis, func(i, j int) bool {
		// sort by commit time in reverse chronological order
		// TODO (ramfox): when `activity time` is surfaced, we would prefer to sort
		// by that metric
		return wis[i].CommitTime.After(wis[j].CommitTime)
	})

	return wis, nil
}

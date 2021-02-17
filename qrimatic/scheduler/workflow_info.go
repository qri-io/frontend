package scheduler

import (
	"context"
	"fmt"

	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
)

// WorkflowInfo is a simplified data structure that can be built from a Workflow
// It is primarily used for the `workflow/list` endpoint
type WorkflowInfo struct {
	dsref.VersionInfo
	ID string `json:"id"` // CID string
}

func WorkflowInfoFromVersionInfo(vi dsref.VersionInfo, WorkflowID string) *WorkflowInfo {
	return &WorkflowInfo{
		VersionInfo: dsref.VersionInfo{
			InitID:      vi.InitID,
			Username:    vi.Username,
			ProfileID:   vi.ProfileID,
			Name:        vi.Name,
			Path:        vi.Path,
			Published:   vi.Published,
			Foreign:     vi.Foreign,
			MetaTitle:   vi.MetaTitle,
			ThemeList:   vi.ThemeList,
			BodySize:    vi.BodySize,
			BodyRows:    vi.BodyRows,
			BodyFormat:  vi.BodyFormat,
			NumErrors:   vi.NumErrors,
			FSIPath:     vi.FSIPath,
			RunID:       vi.RunID,
			RunStatus:   vi.RunStatus,
			RunDuration: vi.RunDuration,
		},
		ID: WorkflowID,
	}
}

// ListWorkflowInfos returns all the WorkflowInfos (including datasets that have
// been converted to WorkflowInfos). Future iterations will include pagination
func (c *Cron) ListWorkflowInfos(ctx context.Context, inst *lib.Instance, after, before int) ([]*WorkflowInfo, error) {
	m := lib.NewDatasetMethods(inst)
	// TODO (ramfox): for now we are fetching everything.
	p := &lib.ListParams{
		Limit:  100,
		Offset: 0,
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
		viID := fmt.Sprintf("%s/%s", vi.Username, vi.Name)
		w, ok := wiMap[viID]
		if ok {
			wis = append(wis, WorkflowInfoFromVersionInfo(vi, w.ID))
			continue
		}
		// TODO (ramfox): HACK - because frontend has no concept of identity yet
		// all workflows created by the frontend are sent with `Username='me'`
		w, ok = wiMap[fmt.Sprintf("me/%s", vi.Name)]
		if ok {
			wis = append(wis, WorkflowInfoFromVersionInfo(vi, w.ID))
			continue
		}
		wis = append(wis, WorkflowInfoFromVersionInfo(vi, ""))
	}

	return wis, nil
}

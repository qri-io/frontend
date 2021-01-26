package scheduler

// import (
// 	"context"
// 	"fmt"
// 	"io/ioutil"
// 	"os"
// 	"path/filepath"
// 	"testing"
// )

// func TestFbWorkflowStore(t *testing.T) {
// 	tmp, err := ioutil.TempDir(os.TempDir(), "TestFsWorkflowStore")
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	defer os.RemoveAll(tmp)
// 	newStore := func() WorkflowStore {
// 		return NewFlatbufferWorkflowStore(filepath.Join(tmp, "workflows.dat"))
// 	}
// 	RunWorkflowStoreTests(t, newStore)
// }

// func BenchmarkFbWorkflowStore(b *testing.B) {
// 	ctx := context.Background()
// 	js := make(workflows, 1000)
// 	for i := range js {
// 		js[i] = &Workflow{
// 			Name:        fmt.Sprintf("workflow_%d", i),
// 			Type:        JTDataset,
// 			Periodicity: mustRepeatingInterval("R/P1H"),
// 		}
// 	}

// 	tmp, err := ioutil.TempDir(os.TempDir(), "TestFsWorkflowStore")
// 	if err != nil {
// 		b.Fatal(err)
// 	}

// 	defer os.RemoveAll(tmp)
// 	store := NewFlatbufferWorkflowStore(filepath.Join(tmp, "workflows.dat"))

// 	b.ResetTimer()

// 	for i := 0; i < b.N; i++ {
// 		if err := store.PutWorkflows(ctx, js...); err != nil {
// 			b.Fatal(err)
// 		}
// 		if _, err := store.ListWorkflows(ctx, 0, -1); err != nil {
// 			b.Fatal(err)
// 		}
// 	}
// }

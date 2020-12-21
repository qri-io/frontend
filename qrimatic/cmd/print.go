package cmd

import (
	"bytes"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/dustin/go-humanize"
	"github.com/fatih/color"
	"github.com/qri-io/qrimatic/cron"
)

// StringerLocation is the function to retrieve the timezone location
var StringerLocation *time.Location

func init() {
	StringerLocation = time.Now().Location()
}

// print a slice of stringer items to io.Writer as an indented & numbered list
// offset specifies the number of items that have been skipped, index is 1-based
func printItems(w io.Writer, items []fmt.Stringer, offset int) error {
	buf := &bytes.Buffer{}
	prefix := []byte("    ")
	for i, item := range items {
		buf.WriteString(fmtItem(i+1+offset, item.String(), prefix))
	}
	_, err := w.Write(buf.Bytes())
	return err
}

type jobStringer cron.Job

// String assumes Name, Type, Periodicity, and PrevRunStart are present
func (j jobStringer) String() string {
	w := &bytes.Buffer{}
	name := color.New(color.Bold).SprintFunc()
	t := j.Periodicity.After(j.PrevRunStart)
	relTime := humanize.RelTime(time.Now().In(time.UTC), t, "", "")
	fmt.Fprintf(w, "%s\nin %sat %s | %s\n", name(j.Name), relTime, t.In(StringerLocation).Format(time.Kitchen), j.Type)
	if j.RepoPath != "" {
		fmt.Fprintf(w, "\nrepo: %s\n", j.RepoPath)
	}
	fmt.Fprintf(w, "\n")
	return w.String()
}

type finishedJobStringer cron.Job

// String assumes Name, Type, PrevRunStart and ExitStatus are present
func (j finishedJobStringer) String() string {
	w := &bytes.Buffer{}
	name := color.New(color.Bold, color.FgGreen).SprintFunc()
	msg := ""
	if j.RunError != "" {
		msg = oneLiner(j.RunError, 40)
		name = color.New(color.Bold, color.FgRed).SprintFunc()
		if j.RunError == "no changes to save" {
			name = color.New(color.Bold, color.Faint).SprintFunc()
		}
	} else {
		if j.Type == cron.JTDataset {
			msg = "dataset updated"
		} else if j.Type == cron.JTShellScript {
			msg = "script ran successfully"
		}
	}

	fmt.Fprintf(w, "%s\n%s | %s\n", name(j.Name), humanize.Time(j.PrevRunStart), msg)
	if j.RepoPath != "" {
		fmt.Fprintf(w, "\nrepo: %s\n", j.RepoPath)
	}
	fmt.Fprintf(w, "\n")
	return w.String()
}

func fmtItem(i int, item string, prefix []byte) string {
	var res []byte
	bol := true
	b := []byte(item)
	d := []byte(fmt.Sprintf("%d", i))
	prefix1 := append(d, prefix[len(d):]...)
	for i, c := range b {
		if bol && c != '\n' {
			if i == 0 {
				res = append(res, prefix1...)
			} else {
				res = append(res, prefix...)
			}
		}
		res = append(res, c)
		bol = c == '\n'
	}
	return string(res)
}

func oneLiner(str string, maxLen int) string {
	str = strings.Split(str, "\n")[0]
	if len(str) > maxLen-3 {
		str = str[:maxLen-3] + "..."
	}
	return str
}

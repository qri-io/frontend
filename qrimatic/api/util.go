package api

import (
	"net/http"
	"strings"
)

func idFromReq(prefix string, r *http.Request) string {
	path := strings.TrimPrefix(r.URL.Path, prefix)
	path = strings.TrimPrefix(path, "/")
	return path
}

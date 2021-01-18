package update

type Workflow struct {
	ID         string
	Config     map[string]string
	Secrets    map[string]string
	Triggers   []Trigger
	DatasetRef string
	OnComplete []OnComplete
}

type Trigger interface {
	Type() string
	Value() interface{}
}

type OnComplete interface {
	Type() string
	Value() interface{}
}

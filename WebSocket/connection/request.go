package connection

type RequestType string

type Request[T Object] struct {
	Type        RequestType  `json:"type"`
	Credentials *Credentials `json:"connection,omitempty"`
	Update      *T           `json:"update,omitempty"`
}

type RequestInterface interface {
	GetType() RequestType
	GetCredentials() Credentials
	GetUpdate() Object
}

type Credentials struct {
	PlayerID ClientIDType `json:"player_id"`
}

func (r Request[T]) GetType() RequestType {
	return r.Type
}

func (r Request[T]) GetCredentials() Credentials {
	return *r.Credentials
}

func (r Request[T]) GetUpdate() Object {
	return r.Update
}

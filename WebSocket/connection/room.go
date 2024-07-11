package connection

type InfoObject interface {
	AddPlayer(int32)
	RemovePlayer(int32)
}

type Room[T InfoObject] struct {
	ID         string
	Info       *T
	Players    map[*Player[T]]bool
	Connect    chan *Player[T]
	Disconnect chan *Player[T]
	Update     chan *T
	updates    chan *T
	HostIP     string
	Remove     chan *Room[T]
}

func New[T InfoObject](id, hostIP string, info *T, updates chan *T) *Room[T] {
	return &Room[T]{
		ID:         id,
		Info:       info,
		Players:    make(map[*Player[T]]bool),
		Connect:    make(chan *Player[T]),
		Disconnect: make(chan *Player[T]),
		Update:     make(chan *T),
		HostIP:     hostIP,
		Remove:     make(chan *Room[T]),
		updates:    updates,
	}
}

func (r *Room[T]) Start() {
	for {
		go func() {
			r.updates <- r.Info
		}()
		select {
		case player := <-r.Connect:
			r.Players[player] = true
		case player := <-r.Disconnect:
			if _, ok := r.Players[player]; ok {
				(*r.Info).RemovePlayer(player.ID)
				delete(r.Players, player)
				close(player.Send)
				player.Conn.Close()

				if player.IP == r.HostIP {
					r.Remove <- r
					return
				}
			}
		}
	}
}

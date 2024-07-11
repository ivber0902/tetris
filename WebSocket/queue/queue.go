package queue

type Queue[T any] struct {
	reader chan T
	writer chan T
	buffer []T
}

func New[T any]() *Queue[T] {
	e := &Queue[T]{
		reader: make(chan T),
		writer: make(chan T),
		buffer: make([]T, 1),
	}

	go e.run()

	return e
}

func (e *Queue[T]) Dispatch(data T) {
	e.writer <- data
}

func (e *Queue[T]) Dispatcher() chan<- T {
	return e.writer
}

func (e *Queue[T]) Receive() T {
	return <-e.reader
}

func (e *Queue[T]) Receiver() <-chan T {
	return e.reader
}

func (e *Queue[T]) run() {
	for {
		if len(e.buffer) > 0 {
			select {
			case e.reader <- e.buffer[0]:
				e.buffer = e.buffer[1:]
			case data := <-e.writer:
				e.buffer = append(e.buffer, data)
			}
		} else {
			data := <-e.writer
			e.buffer = append(e.buffer, data)
		}
	}
}

func (e *Queue[T]) Close() {
	close(e.reader)
	close(e.writer)
}

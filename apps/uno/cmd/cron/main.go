package main

import (
	"flag"
	"uno/bootstrap"
)

func main() {
	job := flag.String("job", "", "run a specific job by name and exit")
	flag.Parse()
	bootstrap.RunCron(*job)
}

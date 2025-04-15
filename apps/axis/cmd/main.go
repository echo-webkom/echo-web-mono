package main

import (
	"fmt"

	"github.com/echo-webkom/axis/server"
)

func main() {
	fmt.Println("Welcome to Axis!")
	fmt.Println("     _    __  _____ ____\n" +
		"    / \\   \\ \\/ /_ _/ ___|\n" +
		"   / _ \\   \\  / | |\\___ \\\n" +
		"  / ___ \\  /  \\ | | ___) |\n" +
		" /_/   \\_\\/_/\\_\\___|____/")

	fmt.Println()
	fmt.Println("Starting Axis server...")
	fmt.Println()

	server.Run()
}

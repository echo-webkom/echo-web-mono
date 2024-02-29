#!/usr/bin/env bash

function register() {
  # insert curl here
}

for i in {0..100}; do
  register $i &
done

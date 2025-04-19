variable "subscription_id" {
  description = "The ID of the Azure subscription to use"
  type        = string
}

variable "database_url" {
  description = "The URL of the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "postgres_version" {
  default = "15"
}

variable "location" {
  default = "West Europe"
}

variable "resource_group_name" {
  default = "echo-web"
}

variable "app_service_plan_name" {
  default = "echo-web-plan"
}

variable "app_service_name" {
  default = "echo-web"
}

variable "docker_owner" {
  default = "echo-webkom"
}

variable "axis_docker_image" {
  default = "axis"
}

variable "vertex_docker_image" {
  default = "vertex"
}

variable "docker_tag" {
  default = "latest"
}

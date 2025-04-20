variable "subscription_id" {
  description = "The ID of the Azure subscription to use"
  type        = string
}

variable "admin_key" {
  description = "The admin key for the application"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "The URL of the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "feide_client_id" {
  description = "The client ID for the Feide authentication"
  type        = string
  sensitive   = true
}

variable "feide_client_secret" {
  description = "The client secret for the Feide authentication"
  type        = string
  sensitive   = true
}

variable "sanity_dataset" {
  default = "production"
}

variable "sanity_project_id" {
  default = "pgq2pd26"
}

variable "axis_url" {
  default = "https://axis.echo-webkom.no"
}

variable "echogram_url" {
  default = "https://echogram.echo-webkom.no"
}

variable "public_vertex_feide_redirect_uri" {
  default = "http://beta.echo-webkom.no/auth/feide/callback"
}

variable "postgres_version" {
  default = "15"
}

variable "location" {
  default = "Norway East"
}

variable "resource_group_name" {
  default = "echo-web"
}

variable "app_service_plan_name" {
  default = "echo-web-plan"
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

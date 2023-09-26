variable "rg_name" {
  type        = string
  description = "The name of the resource group in which to create the resources."
}

variable "location" {
  type        = string
  description = "The Azure location where the resources should be created."
  default     = "norwayeast"
}

variable "db_name" {
  type        = string
  description = "The name of the database."
}

variable "db_user" {
  type        = string
  description = "The name of the admin database user."
}

variable "db_password" {
  type        = string
  description = "The password for the admin database user."
}

variable "environment" {
  type        = string
  description = "Descriptive name for the environment, used to tag resources."
}

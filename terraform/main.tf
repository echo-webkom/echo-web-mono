provider "azurerm" {
  subscription_id = var.subscription_id

  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "plan" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = var.database_name
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  administrator_login    = var.database_username
  administrator_password = var.database_password
  sku_name               = "Standard_B1ms"
  version                = var.database_password
  storage_mb             = 32768
  zone                   = "1"

  tags = {
    environment = "prod"
  }
}

resource "azurerm_linux_web_app" "echo-vertex" {
  name                = var.app_service_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  https_only = true

  logs {
    application_logs {
      file_system_level = "Information"
    }

    http_logs {
      file_system {
        retention_in_days = 2
        retention_in_mb   = 35
      }
    }

    detailed_error_messages = true
    failed_request_tracing  = true
  }

  site_config {
    always_on = false

    application_stack {
      docker_image_name   = "${var.docker_owner}/${var.vertex_docker_image}:${var.docker_tag}"
      docker_registry_url = "https://ghcr.io"
    }
  }

  app_settings = {
    DATABASE_URL = azurerm_postgresql_flexible_server.db.fqdn
  }
}

resource "azurerm_linux_web_app" "echo-axis" {
  name                = var.app_service_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  https_only = true

  logs {
    application_logs {
      file_system_level = "Information"
    }

    http_logs {
      file_system {
        retention_in_days = 2
        retention_in_mb   = 35
      }
    }

    detailed_error_messages = true
    failed_request_tracing  = true
  }

  site_config {
    always_on = false

    application_stack {
      docker_image_name   = "${var.docker_owner}/${var.axis_docker_image}:${var.docker_tag}"
      docker_registry_url = "https://ghcr.io"
    }
  }

  app_settings = {
    DATABASE_URL = azurerm_postgresql_flexible_server.db.fqdn
  }
}


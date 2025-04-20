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
        retention_in_days = 7
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
    WEBSITES_PORT = 3000

    DATABASE_URL        = var.database_url
    ADMIN_KEY           = var.admin_key
    FEIDE_CLIENT_ID     = var.feide_client_id
    FEIDE_CLIENT_SECRET = var.feide_client_secret

    PUBLIC_AXIS_URL           = var.axis_url
    PUBLIC_ECHOGRAM_URL       = var.echogram_url
    PUBLIC_FEIDE_REDIRECT_URI = var.public_vertex_feide_redirect_uri
    PUBLIC_SANITY_DATASET     = var.sanity_dataset
    PUBLIC_SANITY_PROJECT_ID  = var.sanity_project_id
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
        retention_in_days = 7
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
    WEBSITES_PORT = 8080

    DATABASE_URL = var.database_url
    ADMIN_KEY    = var.admin_key
  }
}


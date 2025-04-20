terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.26.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "echo-web"
    storage_account_name = "echowebtfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }

  required_version = ">= 1.11.0"
}

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
  name                = "echo-web-vertex"
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


    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.vertex_ai.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.vertex_ai.connection_string
  }
}

resource "azurerm_app_service_custom_hostname_binding" "vertex_custom_domain" {
  hostname            = "beta.echo-webkom.no"
  app_service_name    = azurerm_linux_web_app.echo-vertex.name
  resource_group_name = azurerm_linux_web_app.echo-vertex.resource_group_name
}

resource "azurerm_linux_web_app" "echo-axis" {
  name                = "echo-web-axis"
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

    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.axis_ai.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.axis_ai.connection_string
  }
}

resource "azurerm_app_service_custom_hostname_binding" "axis_custom_domain" {
  hostname            = "axis.echo-webkom.no"
  app_service_name    = azurerm_linux_web_app.echo-axis.name
  resource_group_name = azurerm_linux_web_app.echo-axis.resource_group_name
}

resource "azurerm_application_insights" "vertex_ai" {
  name                = "ai-echo-vertex"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "Node.JS"
}

resource "azurerm_application_insights" "axis_ai" {
  name                = "ai-echo-axis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "other"
}

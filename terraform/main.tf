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

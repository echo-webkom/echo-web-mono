terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.95.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "new-echo-web-tfstate"
    storage_account_name = "newechowebtfstatestore"
    container_name       = "newtfstate"
    key                  = "azure.terraform.newtfstate"
  }
}

provider "azurerm" {
  features {}

  subscription_id = "f16e6916-1e71-42a0-9df3-0246b805f432"
}

# Resource group

resource "azurerm_resource_group" "rg" {
  name     = var.rg_name
  location = var.location

  tags = {
    "environment" = var.environment
  }
}

# Database

resource "azurerm_postgresql_flexible_server" "db" {
  location            = var.location
  name                = var.db_name
  resource_group_name = azurerm_resource_group.rg.name

  administrator_login    = var.db_user
  administrator_password = var.db_password

  sku_name   = "B_Standard_B1ms"
  version    = "14"
  storage_mb = 32768

  backup_retention_days = 7

  zone = 1

  tags = {
    "environment" = var.environment
  }

  lifecycle {
    ignore_changes = [
      zone
    ]

    prevent_destroy = false
  }
}

# Firewall for Postgres, allows all traffic from Azure

resource "azurerm_postgresql_flexible_server_firewall_rule" "db_firewall" {
  name             = "${var.db_name}-firewall"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

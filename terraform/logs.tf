resource "azurerm_log_analytics_workspace" "vertex_log_ws" {
  name                = "echo-vertex-log-ws"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "vertex_ai" {
  name                = "ai-echo-vertex"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "Node.JS"
  workspace_id        = azurerm_log_analytics_workspace.vertex_log_ws.id
}

resource "azurerm_log_analytics_workspace" "axis_log_ws" {
  name                = "echo-axis-log-ws"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}


resource "azurerm_application_insights" "axis_ai" {
  name                = "ai-echo-axis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "other"
  workspace_id        = azurerm_log_analytics_workspace.axis_log_ws.id
}

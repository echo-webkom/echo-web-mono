output "vertex_url" {
  description = "The URL of the Vertex web app"
  value       = azurerm_linux_web_app.echo-axis.default_hostname
}

output "axis_url" {
  description = "The URL of the Axis web app"
  value       = azurerm_linux_web_app.echo-vertex.default_hostname
}

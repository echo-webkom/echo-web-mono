output "vertex_url" {
  description = "The URL of the Vertex web app"
  value       = azurerm_linux_web_app.echo_axis.default_hostname
}

output "axis_url" {
  description = "The URL of the Axis web app"
  value       = azurerm_linux_web_app.echo_vertex.default_hostname
}

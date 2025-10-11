package no.uib.echo

import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init(environment)
    configureHTTP()
    configureSecurity()
    configureRouting()
}

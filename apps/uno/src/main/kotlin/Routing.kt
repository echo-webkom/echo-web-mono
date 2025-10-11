package no.uib.echo

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.Instant
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }

        get("/happenings") {
            val happenings = DatabaseFactory.query {
                HappeningTable.selectAll().map { it.toHappeningResponse() }
            }

            call.respond(happenings)
        }
    }
}

@Serializable
data class HappeningResponse(
    val id: String,
    val slug: String,
    val title: String,
    val type: String,
    val date: String? = null,
    @SerialName("registration_start") val registrationStart: String? = null,
    @SerialName("registration_end") val registrationEnd: String? = null,
    @SerialName("registration_groups") val registrationGroups: String? = null,
    @SerialName("registration_start_groups") val registrationStartGroups: String? = null,
)

private fun ResultRow.toHappeningResponse(): HappeningResponse =
    HappeningResponse(
        id = this[HappeningTable.id],
        slug = this[HappeningTable.slug],
        title = this[HappeningTable.title],
        type = this[HappeningTable.type],
        date = this[HappeningTable.date].toIsoString(),
        registrationStart = this[HappeningTable.registrationStart].toIsoString(),
        registrationEnd = this[HappeningTable.registrationEnd].toIsoString(),
        registrationGroups = this[HappeningTable.registrationGroups],
        registrationStartGroups = this[HappeningTable.registrationStartGroups].toIsoString(),
    )

private fun Instant?.toIsoString(): String? = this?.toString()

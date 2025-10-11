package no.uib.echo

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object HappeningTable : Table("happening") {
    val id = varchar("id", 255)
    val slug = varchar("slug", 255)
    val title = varchar("title", 255)
    val type = varchar("type", 255)
    val date = timestamp("date").nullable()
    val registrationStart = timestamp("registration_start").nullable()
    val registrationEnd = timestamp("registration_end").nullable()
    val registrationGroups = text("registration_groups").nullable()
    val registrationStartGroups = timestamp("registration_start_groups").nullable()

    override val primaryKey = PrimaryKey(id, name = "happening_id_pk")
}

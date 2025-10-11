package no.uib.echo

import io.ktor.server.application.ApplicationEnvironment
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    private lateinit var databaseInstance: Database

    fun init(environment: ApplicationEnvironment) {
        if (::databaseInstance.isInitialized) return

        val postgresConfig = environment.config.config("postgres")
        databaseInstance = Database.connect(
            url = postgresConfig.property("url").getString(),
            driver = "org.postgresql.Driver",
            user = postgresConfig.property("user").getString(),
            password = postgresConfig.property("password").getString(),
        )
    }

    fun database(): Database {
        check(::databaseInstance.isInitialized) { "DatabaseFactory.init(environment) must be called before using the database." }
        return databaseInstance
    }

    fun <T> blockingQuery(block: Transaction.() -> T): T =
        transaction(database()) { block() }

    suspend fun <T> query(block: suspend Transaction.() -> T): T =
        newSuspendedTransaction(Dispatchers.IO, database()) { block() }
}

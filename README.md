# Rotterdam - Document Verzoek Plugin

## Description
This GZAC plugin handles events triggered from the open notificaties when documents are added to a Zaak in OpenZaak.

The plugin processes events from the Notifications API when an EnkelvoudigeInformatieobject is added to an existing Zaak outside of the running GZAC application. Each event contains references to both the Zaak and the ZaakInformatieobject that captures the relationship with the document.
When the plugin receives a notification from the Notifications API, it will retrieve the audit trail of the document (enkelvoudigeInformatieobject) to check if the document is added outside this GZAC Application and if so it will send a message to the process instance that is waiting on a message intermediate catch event. 

The Plugin only contains configuration and logic to configure abonnement filters. It does not contain any Plugin Actions.

## Usage

Using the plugin comes down to a simple steps:
* Create a configuration instance for the plugin and configure the following properties:
  * `notificatiesApiPluginConfiguration` - NotificatiesApiPlugin instance
  * `zakenApiPluginConfiguration` - ZakenApiPlugin instance
  * `documentenApiPluginConfiguration` - DocumentenApiPlugin instance
  * `eventMessage` - The message delivered to the process instance that is waiting on a message intermediate catch event.
  * `applicatieId` - The ID of the applicatie in OpenZaak used for authentication. When the plugin receives a notification from the Notifications API, it will ignore the events with this applicatie ID.
* Create a message intermediate catch event in a process for handling the message delivered to the process instance.

The message contains the following properties:
* `zaakinformatieobject` - The enkelvoudigeInformatieobject that is waiting on the message intermediate catch event.
* `enkelvoudigeInformatieobject` - The enkelvoudigeInformatieobject that is waiting on the message intermediate catch event

## Dependencies and running the application
* See [running example](documentation/example-application.md)
* See [dependencies](documentation/plugin.md)

## Development

### Adding a new version

You might need to add a new version of the plugin using other filters.

#### When adding a new version of the plugin:

1. Make the required changes to the action in the plugin
   [DocumentVerzoekPlugin](backend/plugin/src/main/kotlin/com/ritense/valtimoplugins/documentverzoek/plugin/DocumentVerzoekPlugin.kt).
2. Update the README if necessary.
3. Increase the plugin version in the [plugin.properties](backend/plugin/plugin.properties).

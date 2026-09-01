# Document Verzoek Plugin

## Overview

The Document Verzoek plugin lets a GZAC process react to documents that are added to a
Zaak **outside** of the running GZAC application (for example directly in OpenZaak or by
another connected application).

It works by subscribing to the Open Notificaties API. When an `EnkelvoudigInformatieobject`
is linked to an existing Zaak, the Notificaties API emits a `zaakinformatieobject`/`create`
event on the `zaken` kanaal. The plugin receives this event, retrieves the document's audit
trail, and determines whether the document was added by an application **other** than this
GZAC instance (by comparing the audit trail's `applicatieId` against the configured
`applicatieId`). If the document originated externally, the plugin correlates a BPMN message
to every process instance of the Zaak's document, allowing a waiting process to continue.

The plugin exposes **no plugin actions**. Its only job is to configure Notificaties API
abonnement filters and to publish a message into running processes. The abonnement filters
are derived automatically from all active case definitions that have a `ZaakTypeLink`, so the
plugin subscribes to notifications for exactly those zaaktypes.

## Dependencies

### Backend

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:document-verzoek:0.9.5")
}
```

### Frontend

```json
{
  "dependencies": {
    "@valtimo-plugins/document-verzoek": "0.9.5"
  }
}
```

In your `app.module.ts`:

```typescript
import {
    DocumentVerzoekPluginModule,
    documentVerzoekPluginSpecification,
} from '@valtimo-plugins/document-verzoek';

@NgModule({
    imports: [
        DocumentVerzoekPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                documentVerzoekPluginSpecification,
            ]
        }
    ]
})
```

## Configuration

Create a configuration instance of the plugin in the GZAC admin UI (Plugins) and set the
following properties. All properties are required.

| Property                            | Type   | Description                                                                                                                                                             |
|-------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `notificatiesApiPluginConfiguration`| plugin | The Notificaties API plugin configuration used to communicate between GZAC and other applications. The plugin registers its abonnement filters through this API.        |
| `zakenApiPlugin`                    | plugin | The Zaken API plugin configuration, used to retrieve the `ZaakInformatieObject` referenced by the notification.                                                         |
| `documentenApiPlugin`               | plugin | The Documenten API plugin configuration, used to retrieve the document's audit trail and the `EnkelvoudigInformatieobject`.                                              |
| `eventMessage`                      | string | The name of the BPMN message that is correlated to the waiting process instance when an external document is received. Must match the message name used in the process. |
| `applicatieId`                      | string | The applicatie ID in OpenZaak that identifies **this** GZAC application. Documents whose audit trail `applicatieId` equals this value are ignored (treated as internal). |

Example plugin configuration (from the example app,
`backend/app/src/main/resources/config/plugin/document-verzoek.pluginconfig.json`):

```json
{
    "pluginDefinitionKey": "document-verzoek",
    "properties": {
        "notificatiesApiPluginConfiguration": "020e6ca3-1c15-4496-a4cf-67bfaa36332f",
        "zakenApiPlugin": "3079d6fe-42e3-4f8f-a9db-52ce2507b7ee",
        "documentenApiPlugin": "5474fe57-532a-4050-8d89-32e62ca3e895",
        "eventMessage": "DOCUMENT_RECEIVED",
        "applicatieId": "377e8200-f9e0-4282-8167-e686baa8f08d"
    }
}
```

## Actions

This plugin has **no plugin actions**. It cannot be linked to a BPMN service task. Instead it
listens for Notificaties API events in the background and correlates a BPMN message when a
relevant external document is received.

### The message that is sent

When an external document is detected, the plugin correlates the configured `eventMessage` to
all process instances associated with the Zaak's document, setting the following process
variables:

| Variable              | Description                                                                          |
|-----------------------|--------------------------------------------------------------------------------------|
| `zaakInformatieObject`| The `ZaakInformatieObject` that links the document to the Zaak.                       |
| `informatieObject`    | The `EnkelvoudigInformatieobject` (the document metadata) that was added.             |

It also publishes an internal `InformatieObjectReceivedEvent` on the Spring application context.

## BPMN setup

Because the plugin delivers a BPMN message rather than executing an action, a process that
wants to wait for an external document must include a **message intermediate catch event** (or
any message-correlating construct) whose message name matches the plugin's `eventMessage`.

The example application demonstrates this in
`backend/app/src/main/resources/config/case/example/1-0-0/bpmn/example-process.bpmn`:

```
StartEvent ─▶ [WaitForDocument]  ─▶ (UserTask) ConfirmReceivedDocument ─▶ EndEvent
             intermediate catch
             message: DOCUMENT_RECEIVED
```

Key elements in that process:

- An **intermediate catch event** `WaitForDocument` ("Waiting for document added to case")
  with a `messageEventDefinition` referencing a message named `DOCUMENT_RECEIVED`.
- A **user task** `ConfirmReceivedDocument` that runs after the message is caught. It has a
  process link to the `external-document-event-received` form, which can display the
  `informatieObject` / `zaakInformatieObject` variables set by the plugin.

The BPMN message name **must** equal the `eventMessage` configured on the plugin
(`DOCUMENT_RECEIVED` in the example).

### Steps to set this up in your own process

1. Configure a Document Verzoek plugin instance with the properties described above, choosing
   an `eventMessage` name (e.g. `DOCUMENT_RECEIVED`).
2. Ensure the case definition for the relevant zaaktype has a `ZaakTypeLink` — this is what the
   plugin uses to build the Notificaties API abonnement filter for that zaaktype.
3. In your BPMN process, add a message intermediate catch event with a message whose name
   matches `eventMessage`.
4. (Optional) Add a following task/form that consumes the `informatieObject` and
   `zaakInformatieObject` process variables.
5. Start a process instance for a Zaak. When a document is added to that Zaak by an external
   application, the plugin correlates the message and the process continues past the catch event.

## Running the example

See [example-application.md](example-application.md) for how to start the demo backend,
frontend, and the required docker dependencies (OpenZaak, Open Notificaties, Keycloak, etc.).
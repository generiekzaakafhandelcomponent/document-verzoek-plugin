# @valtimo-plugins/document-verzoek

Angular admin-UI library for the **Document Verzoek** GZAC/Valtimo plugin. It contributes the plugin's
configuration screen to the Valtimo admin console so an administrator can create and manage
`document-verzoek` plugin configurations.

This is the frontend half of the plugin; the runtime logic lives in the backend Maven artifact. The
`pluginId` exported here (`document-verzoek`) matches the backend `@Plugin(key = "document-verzoek")`
so the admin UI and the backend definition line up.

## What the plugin does

The Document Verzoek plugin reacts to Open Notificaties events that are emitted when an
`EnkelvoudigInformatieobject` is linked to an existing Zaak in OpenZaak **outside** of this GZAC
instance. When such a document is detected as external, the plugin correlates a BPMN message to the
process instance that is waiting on a message intermediate catch event.

The plugin only holds configuration — it contributes **no plugin actions**
(`functionConfigurationComponents` is empty). All that this library exposes to the admin UI is a
single plugin configuration component.

## Installation

```bash
npm install @valtimo-plugins/document-verzoek
```

Peer dependencies (provided by the host Valtimo frontend):

- `@angular/common` `19.2.25`
- `@angular/core` `19.2.25`
- `@valtimo/plugin`, `@valtimo/components` (Valtimo platform packages)

## Usage

Register the plugin specification with Valtimo's `PluginManagementService` (or the
`pluginSpecifications` array wherever your host app collects them), typically in the host
application's app module:

```ts
import {documentVerzoekPluginSpecification} from '@valtimo-plugins/document-verzoek';

const pluginSpecifications = [
  // ...other plugin specifications
  documentVerzoekPluginSpecification,
];
```

If your host app registers plugin Angular modules explicitly, also import `DocumentVerzoekPluginModule`:

```ts
import {DocumentVerzoekPluginModule} from '@valtimo-plugins/document-verzoek';

@NgModule({
  imports: [
    // ...
    DocumentVerzoekPluginModule,
  ],
})
export class AppModule {}
```

## Public API

The package exports (see `src/public_api.ts`):

- `documentVerzoekPluginSpecification` — the `PluginSpecification` (id, configuration component, logo,
  and inline nl/en translations) registered with the Valtimo plugin system.
- `DocumentVerzoekPluginModule` — the Angular module that declares the configuration component.
- `DocumentVerzoekConfigurationComponent` — the configuration form component.
- `DocumentVerzoekPluginConfig` — the configuration model interface.

## Configuration properties

The configuration form (`DocumentVerzoekConfigurationComponent`) captures the following properties,
matching the `DocumentVerzoekPluginConfig` model:

| Property | Description |
| --- | --- |
| `configurationTitle` | Name of the plugin configuration, used to find it elsewhere in the application. |
| `notificatiesApiPluginConfiguration` | The Notificaties API plugin configuration used to communicate between GZAC and other applications. |
| `zakenApiPlugin` | The Zaken API plugin configuration used to retrieve the Zaak Informatie Object. |
| `documentenApiPlugin` | The Documenten API plugin configuration used to retrieve the information object. |
| `eventMessage` | Name of the BPMN message correlated to the process instance waiting on a message intermediate catch event. |
| `applicatieId` | The Applicatie Id in OpenZaak used for authentication. Notifications whose audit trail carries this id are ignored (they originate from this GZAC instance). |

The Zaken, Documenten, and Notificaties plugin instances are selected from dropdowns populated via
`PluginManagementService.getPluginConfigurationsByPluginDefinitionKey` for `zakenapi`, `documentenapi`,
and `notificatiesapi` respectively — so those plugins must already be configured in the host app.

The form is considered valid once `configurationTitle`, `notificatiesApiPluginConfiguration`,
`zakenApiPlugin`, `documentenApiPlugin`, and `eventMessage` are all set.

## Translations

nl (default) and en translations are bundled inline in the plugin specification, so no external
translation files are required.

## Building

From the `frontend/` directory:

```bash
npm install
npm run build   # builds the publishable library in projects/plugin
```

Or build only this library:

```bash
ng build @valtimo-plugins/document-verzoek
```

## Versioning

The frontend plugin version (`version` in `package.json`) is bumped together with the backend
`pluginVersion` in `backend/plugin/plugin.properties` on each release. See
`documentation/release-notes.md` in the repository root for the change history.

## License

EUPL-1.2

## Contact

Paul van Beukering (Ritense)
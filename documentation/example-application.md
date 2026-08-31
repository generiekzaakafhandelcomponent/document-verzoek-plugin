# Example Application

This project also contains a working example application which is meant to showcase the plugin.

## Running the example application

All commands below should be run from the **project root** directory.

### Prerequisites

- Java 21
- [Docker (Desktop)](https://www.docker.com/products/docker-desktop/)

### Start docker

Make sure docker is running.

Start with gradle script:

```shell
./gradlew :backend:app:composeUp
```

### Start backend

By gradle script:

```shell
./gradlew :backend:app:bootRun
```

### Start frontend

```shell
nvm use 20
npm run clean
npm install
npm run build
npm start
```

### Keycloak users

The example application has a few test users that are preconfigured.

| Name         | Role           | Username  | Password  |
|--------------|----------------|-----------|-----------|
| James Vance  | ROLE_USER      | user      | user      |
| Asha Miller  | ROLE_ADMIN     | admin     | admin     |
| Morgan Finch | ROLE_DEVELOPER | developer | developer |

## Triggering the plugin manually

The plugin only reacts when an `EnkelvoudigInformatieobject` is linked to an existing Zaak **outside** of this GZAC instance. To simulate that from your machine, the repo ships an HTTP request script that talks directly to OpenZaak:
[`backend/requests/openzaak/maak-en-koppel-document-aan-zaak.http`](/backend/requests/openzaak/maak-en-koppel-document-aan-zaak.http).

It can be run with an HTTP client that understands the `.http` format (IntelliJ IDEA's built-in HTTP client, or the VS Code REST Client extension).

### What it does

The script contains three requests that must be run top-to-bottom, because each one stores a value used by the next:

1. **Get zaken and set a zaak url** — fetches the list of Zaken from the Zaken API and stores the first Zaak's URL as `zaak_url` (rewriting `host.docker.internal` to `localhost` so it resolves from your machine).
2. **Create Enkelvoudiginformatieobjecten** — creates a document in the Documenten API from [`bodies/enkelvoudiginformatieobject.json`](/backend/requests/openzaak/bodies/enkelvoudiginformatieobject.json) and stores its URL as `informatieobject_url`.
3. **Maak zaakinformatie object aan en koppel enkelvoudiginformatieobject aan Zaak** — creates a `ZaakInformatieObject` (from [`bodies/zaakinformatieobject.json`](/backend/requests/openzaak/bodies/zaakinformatieobject.json)) that links the document from step 2 to the Zaak from step 1.

Step 3 is the action the plugin is waiting for: it produces the Open Notificaties `zaken`-kanaal event (resource `zaakinformatieobject`, actie `create`) that the plugin correlates to the waiting process instance. Because the document is created with a different `applicatieId` than the plugin's configured one, it is treated as "added externally" and the configured `eventMessage` is correlated.

### Configuration

Authentication is handled by [`backend/requests/openzaak-jwt.js`](/backend/requests/openzaak-jwt.js), which builds a signed OpenZaak JWT from the selected environment. The environments live in two files:

- [`backend/requests/http-client.env.json`](/backend/requests/http-client.env.json) — non-secret values per environment (`CLIENT_ID`, `USER_ID`, `openzaak_host`, `Informatieobjecttype`, …).
- `backend/requests/http-client.private.env.json` — the matching `SECRET` per environment, used to sign the JWT. Keep this file out of shared/public settings.

Pick the environment that matches your setup when running the requests. For the local example application use `valtimo-client-local`, which points at the dockerized OpenZaak on `host.docker.internal:8001`.

### Prerequisites

- The example application and its docker dependencies must be running (see above), so that OpenZaak, the Documenten API and Open Notificaties are reachable.
- At least one Zaak must already exist for the configured zaaktype (step 1 uses the first Zaak returned). Create one via the example application if the list is empty.
- The `Informatieobjecttype` in the selected environment must exist in the OpenZaak catalogus.

## Source code

The source code is split up into two modules:

1. [Frontend](/frontend/)
2. [Backend](/backend/)

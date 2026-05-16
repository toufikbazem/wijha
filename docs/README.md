# Wijha API Documentation

This folder contains the OpenAPI 3.0 specification for the Wijha REST API.
The spec lives entirely outside the server code — it is hand-maintained.

## Files

- **`openapi.yaml`** — the OpenAPI spec (single source of truth).
- **`index.html`** — a Redoc-powered viewer that renders `openapi.yaml`.

## Viewing the docs

### Option 1 — Open `index.html` directly

Just open `docs/index.html` in a browser.
For best results (and to avoid CORS issues with the `spec-url` fetch), serve the
folder over HTTP:

```bash
# from the repo root
npx http-server docs -p 8080
# then open http://localhost:8080
```

### Option 2 — Swagger Editor (online)

Open https://editor.swagger.io and paste the contents of `openapi.yaml`,
or use **File → Import file**. Live preview + validation as you type.

### Option 3 — VS Code

Install one of:
- **Swagger Viewer** (Arjun G)
- **OpenAPI (Swagger) Editor** (42Crunch)

Then right-click `openapi.yaml` → **Preview**.

### Option 4 — Local Swagger UI (Docker)

```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/spec/openapi.yaml \
  -v ${PWD}/docs:/spec \
  swaggerapi/swagger-ui
```

Then open http://localhost:8080.

## Validating the spec

Before committing changes, lint the spec:

```bash
npx @redocly/cli lint docs/openapi.yaml
```

Or use the online validator at https://editor.swagger.io (errors appear in red).

## Editing workflow

1. Edit `openapi.yaml` — add/update paths or schemas.
2. Reuse models under `components.schemas` and reference with `$ref`.
3. Lint before committing.
4. (Optional) Deploy `docs/` to GitHub Pages / Netlify / Vercel for a public docs site.

## Authentication

The API uses an HttpOnly JWT cookie named `token`, set on `/auth/login` and
`/admin/auth/login`. In the spec this is modeled as `securitySchemes.cookieAuth`.

When testing in Swagger UI, cookies are sent automatically by the browser if the
server is on the same origin or has CORS configured with `credentials: true`.

## Coverage

The spec currently documents these route groups:

- Auth, Users
- Job Seekers, Employers
- Job Posts, Applications, Saved Jobs
- Experiences, Educations, Languages
- Profile Access, Subscriptions
- Contact
- Admin Auth, Admin (dashboard, users, job posts, plans, subscriptions, audit)

Schemas (`User`, `JobSeekerProfile`, `EmployerProfile`, `JobPost`, `Application`,
`Experience`, `Education`, `Language`, `Plan`, `Subscription`) are stubs based on
the route handlers — refine field names/types against the actual database models
as you go.

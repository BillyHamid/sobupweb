// Run: node --test apps/web/tests/formations.test.cjs
// Exercise the real route handlers with an in-memory Supabase substitute.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const ts = require("typescript");

function load(relative, mocks = {}) {
  const filename = path.join(__dirname, "../src", relative);
  const js = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const result = { exports: {} };
  new Function("require", "module", "exports", js)(name => mocks[name] ?? require(name), result, result.exports);
  return result.exports;
}
const constants = load("lib/formations.ts");
function setup(options = {}) {
  const rows = [], files = new Map();
  let uploadCount = 0;
  const db = {
    from() {
      return {
        select() {
          return { eq(key, value) { return {
            maybeSingle: async () => ({ data: rows.find(r => r[key] === value) ?? null, error: options.lookupError ? { code: "missing" } : null }),
            gte: async () => ({ count: options.rateLimited ? 1 : 0, error: null }),
          }; } };
        },
        async insert(row) {
          if (options.insertError) return { error: { code: "database-error" } };
          rows.push(row);
          return { error: options.lostResponse ? { code: "network-error" } : null };
        },
      };
    },
    storage: { from(bucket) {
      assert.equal(bucket, "formation-applications");
      return {
        async upload(key, value) {
          uploadCount++;
          if (options.secondUploadError && uploadCount === 2) return { error: { code: "upload-error" } };
          files.set(key, value);
          return { error: null };
        },
        async remove(keys) { keys.forEach(k => files.delete(k)); return { error: null }; },
      };
    } },
  };
  const { POST } = load("app/api/formations/candidatures/route.ts", {
    "@/lib/formations": constants,
    "@/lib/supabase/admin": { createAdminClient: () => db },
  });
  return { POST, rows, files };
}
function request(overrides = {}) {
  const fields = { nom: "Test", prenom: "Candidat", contact: "test@example.invalid", requestId: randomUUID(), modules: "[1]", cv: new File(["%PDF-1.4\nTest fixture"], "cv.pdf", { type: "application/pdf" }), ...overrides };
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) if (value !== null) form.set(key, value);
  return new Request("http://localhost/api/formations/candidatures", { method: "POST", body: form });
}

test("one, two or all three modules; motivation is optional", async () => {
  for (const modules of ["[1]", "[1,3]", "[1,2,3]"]) {
    const app = setup();
    const response = await app.POST(request({ modules }));
    assert.equal(response.status, 201);
    assert.match((await response.json()).reference, /^RESPIRE-/);
    assert.deepEqual(app.rows[0].modules, JSON.parse(modules));
    assert.equal(app.rows[0].motivation_path, null);
    assert.equal(app.files.size, 1);
  }
});
test("optional letter is stored separately in the private bucket", async () => {
  const app = setup();
  assert.equal((await app.POST(request({ motivation: new File(["%PDF-1.4\nLetter"], "letter.pdf") }))).status, 201);
  assert.match(app.rows[0].motivation_path, /\/motivation.pdf$/);
  assert.equal(app.files.size, 2);
});
test("rejects invalid selection, missing CV, invalid contact and forged files before storage", async () => {
  const app = setup();
  for (const overrides of [{ modules: "[]" }, { modules: "[1,1]" }, { modules: "[4]" }, { modules: '["1"]' }, { modules: "null" }, { cv: null }, { contact: "abc" }, { nom: " " }, { cv: new File(["not PDF"], "fake.pdf") }, { cv: new File([new Uint8Array(2097153)], "large.pdf") }]) {
    assert.equal((await app.POST(request(overrides))).status, 422);
  }
  assert.equal(app.files.size, 0);
  assert.equal(app.rows.length, 0);
});
test("repeated request returns the same reference, but rejects changed payload", async () => {
  const app = setup();
  const requestId = randomUUID();
  const first = await (await app.POST(request({ requestId }))).json();
  assert.deepEqual(await (await app.POST(request({ requestId }))).json(), first);
  assert.equal((await app.POST(request({ requestId, modules: "[2]" }))).status, 409);
  assert.equal(app.rows.length, 1);
  assert.equal(app.files.size, 1);
});
test("database or second-upload failure removes unreferenced files", async () => {
  for (const options of [{ insertError: true }, { secondUploadError: true }]) {
    const app = setup(options);
    assert.equal((await app.POST(request({ motivation: new File(["%PDF-1.4\nLetter"], "letter.pdf") }))).status, 503);
    assert.equal(app.files.size, 0);
    assert.equal(app.rows.length, 0);
  }
});
test("lost insert response preserves a saved application's CV", async () => {
  const app = setup({ lostResponse: true });
  const response = await app.POST(request());
  assert.equal(response.status, 200);
  assert.equal(app.files.size, 1);
  assert.equal(app.rows.length, 1);
});
test("unavailable table and rate limit never report success or upload files", async () => {
  for (const [options, status] of [[{ lookupError: true }, 503], [{ rateLimited: true }, 429]]) {
    const app = setup(options);
    assert.equal((await app.POST(request())).status, status);
    assert.equal(app.files.size, 0);
  }
});
test("document download rejects unauthenticated callers before accessing storage", async () => {
  const { GET } = load("app/api/admin/formations/[id]/document/route.ts", {
    "@/lib/formations": constants,
    "@/lib/supabase/adminAuth": { isAdminAuthenticated: async () => false },
    "@/lib/supabase/admin": { createAdminClient: () => { throw new Error("Must not access storage"); } },
  });
  assert.equal((await GET(new Request("http://localhost/api/admin/formations/test/document?type=cv"), { params: Promise.resolve({ id: "test" }) })).status, 401);
});

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function load(relative, mocks) {
  const filename = path.join(__dirname, "../src", relative);
  const js = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const result = { exports: {} };
  new Function("require", "module", "exports", js)(name => mocks[name] ?? require(name), result, result.exports);
  return result.exports;
}

function setup(authenticated = true) {
  const state = { surveys: [], options: [], failOptions: false };
  const db = { from(table) {
    if (table === "member_surveys") return {
      insert(survey) { return { select() { return { async single() { const row = { ...survey, id: "01234567-89ab-4cde-8f01-234567890abc" }; state.surveys.push(row); return { data: row, error: null }; } }; } }; },
      update(patch) { return { eq() { state.surveys[0] = { ...state.surveys[0], ...patch }; return { select() { return { async single() { return { data: state.surveys[0], error: null }; } }; }, then(resolve) { resolve({ error: null }); } }; } }; },
      delete() { return { async eq() { state.surveys.length = 0; return { error: null }; } }; },
    };
    if (table === "member_survey_options") return { async insert(rows) { state.options.push(...rows); return { error: state.failOptions ? { code: "failure" } : null }; } };
    throw new Error(`Unexpected table ${table}`);
  } };
  const mocks = { "@/lib/supabase/admin": { createAdminClient: () => db }, "@/lib/supabase/adminAuth": { isAdminAuthenticated: async () => authenticated } };
  return { state, create: load("app/api/admin/sondages/route.ts", mocks).POST, change: load("app/api/admin/sondages/[id]/route.ts", mocks).PATCH };
}
const post = body => new Request("http://localhost/api/admin/sondages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const valid = { title: "Prix du mérite", question: "Pour qui votez-vous ?", options: ["Aminata", "Boureima"] };

test("une session admin est obligatoire pour créer ou fermer le vote", async () => {
  const app = setup(false);
  assert.equal((await app.create(post(valid))).status, 401);
  assert.equal((await app.change(new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ is_open: false }) }), { params: Promise.resolve({ id: "01234567-89ab-4cde-8f01-234567890abc" }) })).status, 401);
  assert.equal(app.state.surveys.length, 0);
});
test("titre, question et liste des personnes sont contrôlés avant publication", async () => {
  const app = setup();
  for (const body of [{ ...valid, options: ["Aminata"] }, { ...valid, options: ["Aminata", "aminata"] }, { ...valid, title: "X" }, { ...valid, options: ["Aminata", ""] }]) {
    assert.equal((await app.create(post(body))).status, 422);
  }
  assert.equal(app.state.surveys.length, 0);
});
test("la création publie un lien avec deux options puis l'admin peut clore", async () => {
  const app = setup();
  const response = await app.create(post(valid));
  assert.equal(response.status, 201);
  assert.match((await response.json()).url, /^\/sondages\//);
  assert.equal(app.state.surveys[0].published, true);
  assert.equal(app.state.options.length, 2);
  const changed = await app.change(new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ is_open: false }) }), { params: Promise.resolve({ id: app.state.surveys[0].id }) });
  assert.equal(changed.status, 200);
  assert.equal(app.state.surveys[0].is_open, false);
});

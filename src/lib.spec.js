import assert from "assert";
import {
  Pep621License,
  Pep621Version,
  Pep621PythonVersion,
  getAction,
} from "./lib.js";

describe("Pep621License", function () {
  it("throws if license is missing", async function () {
    const stub = new Pep621License();
    const responses = [{}, { project: {} }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message: "pyproject.toml does not contain '.project.license' property",
      });
    }
  });

  it("renders if file is valid", async function () {
    const stub = new Pep621License();
    stub.fetch = () => ({ project: { license: "MIT" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, { message: "MIT", messageColor: "blue" });
  });
});

describe("Pep621Version", function () {
  it("throws if version is missing", async function () {
    const stub = new Pep621Version();
    const responses = [{}, { project: {} }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message: "pyproject.toml does not contain '.project.version' property",
      });
    }
  });

  it("renders if file is valid (stable release)", async function () {
    const stub = new Pep621Version();
    stub.fetch = () => ({ project: { version: "1.0.1" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, { message: "v1.0.1", messageColor: "blue" });
  });

  it("renders if file is valid (pre release)", async function () {
    const stub = new Pep621Version();
    stub.fetch = () => ({ project: { version: "0.2.3" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, {
      message: "v0.2.3",
      messageColor: "orange",
    });
  });
});

describe("Pep621PythonVersion", function () {
  it("throws if version is missing", async function () {
    const stub = new Pep621PythonVersion();
    const responses = [{}, { project: {} }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message:
          "pyproject.toml does not contain '.project.requires-python' property",
      });
    }
  });

  it("renders if file is valid", async function () {
    const stub = new Pep621PythonVersion();
    stub.fetch = () => ({ project: { "requires-python": ">=3.8" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, { message: ">=3.8", messageColor: "blue" });
  });
});

describe("getAction", function () {
  afterEach(function () {
    delete process.env["INPUT_INTEGRATION"];
  });

  it("Returns the correct action class with expected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "license";
    assert.strictEqual(getAction(), Pep621License);

    process.env["INPUT_INTEGRATION"] = "python-version";
    assert.strictEqual(getAction(), Pep621PythonVersion);

    process.env["INPUT_INTEGRATION"] = "version";
    assert.strictEqual(getAction(), Pep621Version);
  });

  it("Throws an exception with unexpected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "invalid";
    assert.throws(() => getAction(), {
      name: "Error",
      message: "integration must be one of (license,python-version,version)",
    });
  });
});

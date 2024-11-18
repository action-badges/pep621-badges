import { promises as fs } from "fs";
import core from "@actions/core";
import { parse } from "smol-toml";
import { BaseAction } from "@action-badges/core";
import { addv, pep440VersionColor } from "./formatters.js";

class Pep621License extends BaseAction {
  get label() {
    return "license";
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml) {
    if (pyprojectToml.project && pyprojectToml.project.license) {
      return pyprojectToml;
    }
    throw new Error(
      "pyproject.toml does not contain '.project.license' property",
    );
  }

  async render() {
    const pyprojectToml = await this.validate(await this.fetch());
    return {
      message: pyprojectToml.project.license,
      messageColor: "blue",
    };
  }
}

class Pep621Version extends BaseAction {
  get label() {
    return "version";
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml) {
    if (pyprojectToml.project && pyprojectToml.project.version) {
      return pyprojectToml;
    }
    throw new Error(
      "pyproject.toml does not contain '.project.version' property",
    );
  }

  async render() {
    const pyprojectToml = await this.validate(await this.fetch());
    return {
      message: addv(pyprojectToml.project.version),
      messageColor: pep440VersionColor(pyprojectToml.project.version),
    };
  }
}

class Pep621PythonVersion extends BaseAction {
  get label() {
    return "python";
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml) {
    if (pyprojectToml.project && pyprojectToml.project["requires-python"]) {
      return pyprojectToml;
    }
    throw new Error(
      "pyproject.toml does not contain '.project.requires-python' property",
    );
  }

  async render() {
    const pyprojectToml = await this.validate(await this.fetch());
    return {
      message: pyprojectToml.project["requires-python"],
      messageColor: "blue",
    };
  }
}

function fail(message) {
  core.setFailed(message);
  throw new Error(message);
}

function getAction() {
  const integration = core.getInput("integration", { required: true });
  const validIntegrations = {
    license: Pep621License,
    "python-version": Pep621PythonVersion,
    version: Pep621Version,
  };
  if (integration in validIntegrations) {
    return validIntegrations[integration];
  }
  fail(`integration must be one of (${Object.keys(validIntegrations)})`);
}

export { Pep621License, Pep621Version, Pep621PythonVersion, getAction };

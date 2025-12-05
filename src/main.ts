import * as core from '@actions/core';
import fs from 'fs';
interface Config {
  runner: string;
  global: {
    ubuntu_packages?: string;
    toolchains: string[];
    features: string[];
    rustlog: string;
    fireblocks: {
      enabled: boolean;
    };
  };
  jobs: {
    coverage: {
      if: boolean;
      'continue-on-error': boolean;
      args: string;
      run: string;
      matrix: {
        os: string[];
        toolchains: string[];
        features: string[];
      };
    };
    fmt: {
      if: boolean;
      'continue-on-error': boolean;
      run: string;
    };
    clippy: {
      if: boolean;
      'continue-on-error': boolean;
      flags: string;
      matrix: {
        os: string[];
        toolchains: string[];
        features: string[];
      };
    };
    semver: {
      if: boolean;
      'continue-on-error': boolean;
    };
    hack: {
      if: boolean;
      'continue-on-error': boolean;
      run: string;
    };
    doc: {
      if: boolean;
      'continue-on-error': boolean;
      run: string;
    };
    'cargo-sort': {
      if: boolean;
      'continue-on-error': boolean;
      run: string;
    };
    dependencies: {
      if: boolean;
      'continue-on-error': boolean;
      run: string;
    };
  };
}

export async function run(): Promise<void> {
  try {
    const configFilePath: string = core.getInput('config');
    core.debug(`${configFilePath}`);
    let configRaw: string;
    if (configFilePath.includes('{')) {
      configRaw = configFilePath;
    } else {
      configRaw = fs.readFileSync(configFilePath, 'utf8');
    }
    const finalConfig: Config = JSON.parse(configRaw);
    finalConfig.runner = core.getInput('runner') || 'ubuntu-latest';
    if (!finalConfig.jobs.clippy.matrix.os) {
      finalConfig.jobs.clippy.matrix.os = [];
    }
    if (!finalConfig.jobs.coverage.matrix.os) {
      finalConfig.jobs.coverage.matrix.os = [];
    }
    if (finalConfig.jobs.clippy.matrix.os.length === 0) {
      finalConfig.jobs.clippy.matrix.os.push(finalConfig.runner);
    }
    if (finalConfig.jobs.coverage.matrix.os.length === 0) {
      finalConfig.jobs.coverage.matrix.os.push(finalConfig.runner);
    }
    core.setOutput('config', JSON.stringify(finalConfig));
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

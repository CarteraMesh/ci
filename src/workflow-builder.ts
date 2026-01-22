export class RustWorkflow {
  private config: any = {
    jobs: {
      clippy: {
        if: true,
        'continue-on-error': false,
        flags: '',
        matrix: {
          os: [],
          toolchains: ['stable', 'nightly'],
          features: ['default']
        }
      }
    }
  }

  clippy(opts?: { flags?: string; toolchains?: string[]; features?: string[] }) {
    if (opts?.flags) this.config.jobs.clippy.flags = opts.flags
    if (opts?.toolchains) this.config.jobs.clippy.matrix.toolchains = opts.toolchains
    if (opts?.features) this.config.jobs.clippy.matrix.features = opts.features
    return this
  }

  disableClippy() {
    this.config.jobs.clippy.if = false
    return this
  }

  build() {
    return this.config
  }
}

export function createRustWorkflow() {
  return new RustWorkflow()
}

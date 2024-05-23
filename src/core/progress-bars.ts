import type { MultiBar, SingleBar } from 'cli-progress'
import cliProgress from 'cli-progress'

export class ProgressBars {
  progressBars: MultiBar
  bars: {
    [key: string]: SingleBar
  }

  constructor() {
    // create new container
    this.progressBars = new cliProgress.MultiBar({
      format: ' {bar} {percentage}% | to ⇒ {name} | {value}/{total} | {humanSize}',
      hideCursor: false,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      clearOnComplete: false,
      stopOnComplete: true,
      forceRedraw: true,
    })
    this.bars = {}
  }

  add(name: string, size: number) {
    this.bars[name] = this.progressBars.create(size, 0, { name })
  }

  increment(name: string, updateValues?: any) {
    this.bars[name].increment()
    updateValues && this.update(name, updateValues)
  }

  update(name: string, values: any) {
    this.bars[name].update(values)
  }

  log(msg: string) {
    this.progressBars.log(msg)
  }
}

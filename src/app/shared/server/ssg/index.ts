import {promisify} from 'util'
import {resolve} from 'path'
import glob from 'glob'
import {merge} from "rxjs";
import {latestMergeMapProc, LifecyclePort, mergeMapProc, mount, sink, Socket, source, terminatedComplete} from "pkit";

type Params = [input: string, output?: string]

class Port extends LifecyclePort<Params> {
  files = new Socket<string[]>();
}

const circuit = (port: Port) =>
  merge(
    mergeMapProc(source(port.init), sink(port.files), (dir) =>
      promisify(glob)(`${dir}/**/[!_]*.tsx`)),
    latestMergeMapProc(source(port.files), sink(port.terminated),
      [source(port.init)], async ([files, [input, output]]) => {
      for (const file of files) {
        const fileName = resolve(file.slice(0, -4));
        const {createSsg} = require(fileName);
        if (createSsg && typeof createSsg === 'function') {
          await terminatedComplete(mount(createSsg(fileName, input, output))).toPromise();
        } else {
          console.log(`${fileName} has no Ssg.`);
        }
      }
    }))

export const exec = (...params: Params) =>
  terminatedComplete(mount({Port, circuit, params})).toPromise();

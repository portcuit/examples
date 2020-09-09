import {promisify} from 'util'
import {resolve} from 'path'
import glob, {IOptions} from 'glob'
import {LifecyclePort, mapProc, mapToProc, mergeMapProc, mount, sink, Socket, source, terminatedComplete} from "pkit";
import {merge} from "rxjs";

type GlobParams = [pattern: string, options?: IOptions]

export const ssg = (params: string) =>
  terminatedComplete(mount({Port, circuit, params})).toPromise();

class Port extends LifecyclePort<string> {
  files = new Socket<string[]>();
}

const circuit = (port: Port) =>
  merge(
    mergeMapProc(source(port.init), sink(port.files), (dir) =>
      promisify(glob)(`${dir}/**/[!_]*.tsx`)),
    mergeMapProc(source(port.files), sink(port.terminated), async (files) => {
      for (const file of files) {
        const fileName = resolve(file.slice(0, -4));
        const ssg = require(fileName)?.ssg;
        if (ssg && typeof ssg === 'function') {
          await terminatedComplete(mount(ssg(fileName))).toPromise();
        } else {
          console.log(`${fileName} has no Ssg.`);
        }
      }
    }))


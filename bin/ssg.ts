#!/usr/bin/env node

import {ssg} from '@pkit/experimental/ssg'

ssg(process.argv[2]).then(console.log)

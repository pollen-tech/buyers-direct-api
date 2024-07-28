import {argv} from 'process';
import {install} from 'source-map-support';
import {runMigrationsForTest, runSeedsForTest} from "../config/test.migration";

install();

async function run() {
    if (argv.includes('test:migration:run')) {
        await runMigrationsForTest();
        return;
    }
    if (argv.includes('test:migration:revert')) {
        await runMigrationsForTest();
        return;
    }
    if (argv.includes('test:seed:run')) {
        await runSeedsForTest();
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const main = require('src/main');

    await main.bootstrap();
}
run().then();

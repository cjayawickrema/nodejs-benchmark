const crypto = require('crypto');
const http = require('http');
const fs = require('fs');

const starts = [];
const mids = [];
const ends = [];

function doCpuIntensiveTask(i) {
    starts[i] = new Date();
    let c = 0;
    for (let i = 0; i < 100000000; i++) {
        c++;
    }
    ends[i] = new Date();
}

function workCpu() {
    let c = 0;
    for (let i = 0; i < 10000000; i++) {
        c++;
    }
}

function parseJson(i, sample) {
    starts[i] = new Date();
    JSON.parse(sample);
    ends[i] = new Date();
}

function readFile(i) {
    starts[i] = new Date();
    fs.readFile('json.string', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        ends[i] = new Date();
    });
}

function doCpuIntensiveAndHttp(i) {
    starts[i] = new Date();
    workCpu();
    mids[i] = new Date();
    http.request({
        host: 'www.random.org',
        path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    }, () => {
        ends[i] = new Date();
    }).end();
}

function doHttp(i) {
    starts[i] = new Date();
    http.request({
        host: 'www.random.org',
        path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    }, () => {
        ends[i] = new Date();
    }).end();
}

function doCpuIntensiveTaskAsync(t) {
    setImmediate(() => {
        starts[t] = new Date();
        let c = 0;
        for (let i = 0; i < (t % 3 === 0 ? 10000000 : 100000000); i++) {
            c++;
        }
        ends[t] = new Date();
    })
}

function doCryptoAsync(i) {
    starts[i] = new Date();
    const hash = crypto.pbkdf2('secret', 'salt', 10000, 512, 'sha512', () => {
        ends[i] = new Date();
    });
}

function doCryptoAsyncAndWorkCpu(i) {
    starts[i] = new Date();
    const hash = crypto.pbkdf2('secret', 'salt', 10000, 512, 'sha512', () => {
        mids[i] = new Date();
        workCpu();
        ends[i] = new Date();
    });
}

function doCryptoSync(i) {
    console.log('doCryptoSync')
    starts[i] = new Date();
    const hash = crypto.pbkdf2Sync('secret', 'salt', 10000, 512, 'sha512');
    ends[i] = new Date();
}

let origin;

// Json parse test
// fs.readFile('json.string', 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     origin = new Date();
//     for (let i = 0; i < 6; i++) {
//         parseJson(i, data);
//     }
// });

// all other tests
origin = new Date();
for (let i = 0; i < 6; i++) {
    // doCpuIntensiveTask(i);
    // doCpuIntensiveTaskAsync(i);
    // doCryptoAsyncAndWorkCpu(i);
    // doCryptoSync(i);
    // doCryptoAsync(i);
    // doHttp(i);
    // parseJsonStream(i);
    // readFile(i);
    doCpuIntensiveAndHttp(i);
}

console.log('Waiting...');
setTimeout(() => {
    console.log('Request\tStart\tDuration')
    for (let i = 0; i < starts.length; i++) {
        // console.log(`${i + 1}\t${starts[i].getTime() - origin.getTime()}\t${ends[i].getTime() - starts[i].getTime()}`);
        console.log(`${i + 1}\t${starts[i].getTime() - origin.getTime()}\t${mids[i].getTime() - starts[i].getTime()}\t${ends[i].getTime() - mids[i].getTime()}`);
    }
}, 3000);



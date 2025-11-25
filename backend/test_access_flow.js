const http = require('http');

function makeRequest(path, method, data, token) {
    return new Promise((resolve, reject) => {
        const dataStr = JSON.stringify(data || {});
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataStr.length
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: body,
                    parsed: (() => {
                        try {
                            return JSON.parse(body);
                        } catch (e) {
                            return null;
                        }
                    })()
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataStr);
        req.end();
    });
}

async function runTest() {
    console.log('=== ACCESS CONTROL BUG REPRODUCTION ===\n');

    // 1. Register User A (Patient)
    console.log('1. Registering User A (Patient)...');
    const emailA = `patientA_${Date.now()}@test.com`;
    const signupA = await makeRequest('/api/auth/signup', 'POST', {
        name: 'Patient A',
        email: emailA,
        password: 'password123',
        role: 'patient'
    });
    const tokenA = signupA.parsed.token;
    console.log(`   Status: ${signupA.statusCode}`);

    // 2. User A uploads content
    console.log('2. User A uploading content...');
    const upload = await makeRequest('/api/content/upload', 'POST', {
        data: 'Secret Medical Record',
        title: 'My Record',
        description: 'Private'
    }, tokenA);
    const contentHash = upload.parsed.contentHash;
    console.log(`   Status: ${upload.statusCode}`);
    console.log(`   Content Hash: ${contentHash}`);

    // 3. Register User B (Patient)
    console.log('3. Registering User B (Patient)...');
    const emailB = `patientB_${Date.now()}@test.com`;
    const signupB = await makeRequest('/api/auth/signup', 'POST', {
        name: 'Patient B',
        email: emailB,
        password: 'password123',
        role: 'patient'
    });
    const tokenB = signupB.parsed.token;
    console.log(`   Status: ${signupB.statusCode}`);

    // 4. User B requests access
    console.log('4. User B requesting access...');
    const request = await makeRequest('/api/access/request', 'POST', {
        contentHash: contentHash,
        purpose: 'Second Opinion'
    }, tokenB);
    console.log(`   Status: ${request.statusCode}`);

    // 5. User A tries to view pending requests
    console.log('5. User A checking pending requests (Should fail if bug exists)...');
    const pending = await makeRequest('/api/access/pending', 'GET', null, tokenA);
    console.log(`   Status: ${pending.statusCode}`);
    console.log(`   Response: ${pending.body}`);

    if (pending.statusCode === 403) {
        console.log('\n[SUCCESS] Bug reproduced: User A (Patient) cannot view pending requests.');
    } else if (pending.statusCode === 200) {
        console.log('\n[FAIL] Bug not reproduced: User A can view pending requests.');
    } else {
        console.log(`\n[?] Unexpected status: ${pending.statusCode}`);
    }
}

runTest().catch(console.error);

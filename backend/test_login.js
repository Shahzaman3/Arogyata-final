const http = require('http');

// Test user login
async function testUserLogin() {
    const data = JSON.stringify({
        email: 'test_script_1732359423315@example.com', // Use an email from previous signup
        password: 'password123'
    });

    const options = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`\n=== USER LOGIN TEST ===`);
            console.log(`STATUS: ${res.statusCode}`);
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log('BODY:', body);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// Test institution login (should fail if no institution exists)
async function testInstitutionLogin() {
    const data = JSON.stringify({
        email: 'test_institution@example.com',
        password: 'password123'
    });

    const options = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`\n=== INSTITUTION LOGIN TEST ===`);
            console.log(`STATUS: ${res.statusCode}`);
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log('BODY:', body);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    try {
        await testUserLogin();
        await testInstitutionLogin();
        console.log('\n=== TESTS COMPLETE ===');
    } catch (error) {
        console.error('Test error:', error);
    }
}

runTests();

const http = require('http');

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const dataStr = JSON.stringify(data);
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

async function runTests() {
    console.log('=== COMPREHENSIVE LOGIN FLOW TEST ===\n');

    // Test 1: Register a patient
    console.log('1. Testing Patient Signup...');
    const patientEmail = `patient_${Date.now()}@test.com`;
    const patientSignup = await makeRequest('/api/auth/signup', 'POST', {
        name: 'Test Patient',
        username: 'testpatient',
        email: patientEmail,
        password: 'password123',
        role: 'patient'
    });
    console.log(`   Status: ${patientSignup.statusCode}`);
    console.log(`   Response: ${patientSignup.body}`);
    console.log('');

    // Test 2: Register an institution
    console.log('2. Testing Institution Signup...');
    const institutionEmail = `institution_${Date.now()}@test.com`;
    const institutionSignup = await makeRequest('/api/auth/signup', 'POST', {
        name: 'Test Hospital',
        email: institutionEmail,
        password: 'password123',
        role: 'institution'
    });
    console.log(`   Status: ${institutionSignup.statusCode}`);
    console.log(`   Response: ${institutionSignup.body}`);
    console.log('');

    // Test 3: Login as patient
    console.log('3. Testing Patient Login...');
    const patientLogin = await makeRequest('/api/auth/login', 'POST', {
        email: patientEmail,
        password: 'password123'
    });
    console.log(`   Status: ${patientLogin.statusCode}`);
    console.log(`   Response: ${patientLogin.body}`);
    if (patientLogin.parsed && patientLogin.parsed.user) {
        console.log(`   User Role: ${patientLogin.parsed.user.role}`);
    }
    console.log('');

    // Test 4: Login as institution
    console.log('4. Testing Institution Login...');
    const institutionLogin = await makeRequest('/api/auth/login', 'POST', {
        email: institutionEmail,
        password: 'password123'
    });
    console.log(`   Status: ${institutionLogin.statusCode}`);
    console.log(`   Response: ${institutionLogin.body}`);
    if (institutionLogin.parsed && institutionLogin.parsed.user) {
        console.log(`   User Role: ${institutionLogin.parsed.user.role}`);
    }
    console.log('');

    // Test 5: Try login with wrong password
    console.log('5. Testing Login with Wrong Password...');
    const wrongPassword = await makeRequest('/api/auth/login', 'POST', {
        email: patientEmail,
        password: 'wrongpassword'
    });
    console.log(`   Status: ${wrongPassword.statusCode}`);
    console.log(`   Response: ${wrongPassword.body}`);
    console.log('');

    // Test 6: Try login with non-existent user
    console.log('6. Testing Login with Non-existent User...');
    const nonExistent = await makeRequest('/api/auth/login', 'POST', {
        email: 'nonexistent@test.com',
        password: 'password123'
    });
    console.log(`   Status: ${nonExistent.statusCode}`);
    console.log(`   Response: ${nonExistent.body}`);
    console.log('');

    console.log('=== ALL TESTS COMPLETE ===');
}

runTests().catch(console.error);

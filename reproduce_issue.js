const fs = require('fs');

async function test() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'patient@example.com',
                password: 'password123'
            })
        });
        
        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Logged in. Token:', token.substring(0, 20) + '...');

        // 2. Upload
        console.log('Uploading file...');
        const content = 'Hello World - Test Content';
        const base64 = Buffer.from(content).toString('base64');
        const dataUrl = `data:text/plain;base64,${base64}`;
        
        const uploadRes = await fetch('http://localhost:3000/api/content/upload', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                title: 'test_file.txt',
                description: 'Test upload',
                data: dataUrl
            })
        });

        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.statusText}`);
        const uploadData = await uploadRes.json();
        const id = uploadData.item._id;
        console.log('Uploaded. ID:', id);

        // 3. Retrieve
        console.log('Retrieving file...');
        const retrieveRes = await fetch(`http://localhost:3000/api/content/${id}/retrieve`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!retrieveRes.ok) throw new Error(`Retrieve failed: ${retrieveRes.statusText}`);
        const retrieveData = await retrieveRes.json();
        const retrievedData = retrieveData.data;
        console.log('Retrieved Data (first 50 chars):', retrievedData.substring(0, 50));

        if (retrievedData === dataUrl) {
            console.log('SUCCESS: Retrieved data matches uploaded data.');
        } else {
            console.log('FAILURE: Retrieved data does NOT match.');
            console.log('Expected:', dataUrl);
            console.log('Got:', retrievedData);
        }

        if (retrievedData.includes('Users') || retrievedData.includes('C:')) {
            console.log('WARNING: Retrieved data seems to contain a file path!');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();

const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        loadUserProfile();
    } else {
        showAuthSection();
    }

    // Form event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);

    // Set default date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('transaction-date').value = now.toISOString().slice(0, 16);
});

// Auth Functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('main-section').style.display = 'none';
}

function showMainSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showToast('Login successful!', 'success');
            showMainSection();
            loadUserProfile();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showToast('Registration successful!', 'success');
            showMainSection();
            loadUserProfile();
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    currentUser = null;
    showAuthSection();
    showToast('Logged out successfully', 'success');
}

// User Profile Functions
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            displayUserInfo();
            loadQueue();
            loadTransactions();
        } else {
            logout();
        }
    } catch (error) {
        showToast('Failed to load profile', 'error');
    }
}

function displayUserInfo() {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    
    if (currentUser.last_buy_date) {
        const date = new Date(currentUser.last_buy_date);
        document.getElementById('last-buy-date').textContent = date.toLocaleString();
    } else {
        document.getElementById('last-buy-date').textContent = 'No purchases yet';
    }
}

// Transaction Functions
async function handleAddTransaction(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('date', document.getElementById('transaction-date').value);
    formData.append('kg', document.getElementById('transaction-kg').value);
    formData.append('price', document.getElementById('transaction-price').value);
    
    const imageFile = document.getElementById('transaction-image').files[0];
    if (imageFile) {
        formData.append('prove_image', imageFile);
    }

    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Transaction added successfully!', 'success');
            document.getElementById('transactionForm').reset();
            
            // Reset date to now
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('transaction-date').value = now.toISOString().slice(0, 16);
            
            loadUserProfile();
        } else {
            showToast(data.error || 'Failed to add transaction', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

// Queue Functions
async function loadQueue() {
    try {
        const response = await fetch(`${API_URL}/users/queue`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            displayQueue(data.queue);
        } else {
            showToast('Failed to load queue', 'error');
        }
    } catch (error) {
        console.error('Load queue error:', error);
    }
}

function displayQueue(queue) {
    const container = document.getElementById('queue-list');
    
    if (queue.length === 0) {
        container.innerHTML = '<p class="loading">No users yet</p>';
        return;
    }

    container.innerHTML = queue.map((user, index) => {
        const daysSince = user.days_since_last_buy;
        const isCurrentUser = currentUser && user.id === currentUser.id;
        
        let badge = '';
        let itemClass = '';
        let statusText = '';
        
        if (!user.last_buy_date || daysSince >= 999999) {
            badge = '<span class="queue-badge never">Never bought</span>';
            itemClass = 'urgent';
            statusText = 'Never purchased';
        } else if (daysSince > 30) {
            badge = '<span class="queue-badge urgent">Urgent</span>';
            itemClass = 'urgent';
            statusText = `${daysSince} days ago`;
        } else if (daysSince > 14) {
            badge = '<span class="queue-badge warning">Soon</span>';
            itemClass = 'warning';
            statusText = `${daysSince} days ago`;
        } else {
            badge = '<span class="queue-badge recent">Recent</span>';
            statusText = `${daysSince} days ago`;
        }
        
        if (isCurrentUser) {
            itemClass += ' current-user';
            badge = '<span class="queue-badge you">You</span>';
        }
        
        const lastBuyText = user.last_buy_date 
            ? `Last buy: ${statusText}`
            : 'Never purchased rice';
        
        return `
            <div class="queue-item ${itemClass}">
                <span class="queue-position">#${index + 1}</span>
                <div class="queue-info">
                    <div class="name">${user.name}</div>
                    <div class="email">${user.email}</div>
                    <div class="last-buy">${lastBuyText} • ${user.total_transactions} transaction(s)</div>
                </div>
                ${badge}
            </div>
        `;
    }).join('');
}

async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            displayTransactions(data.transactions);
        } else {
            showToast('Failed to load transactions', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactions-list');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="loading">No transactions yet</p>';
        return;
    }

    container.innerHTML = transactions.map(tx => `
        <div class="transaction-item">
            <div class="transaction-info">
                <p><strong>Date:</strong> ${new Date(tx.date).toLocaleString()}</p>
                <p><strong>Weight:</strong> ${tx.kg} kg</p>
                <p><strong>Price:</strong> Rp ${parseFloat(tx.price).toLocaleString('id-ID')}</p>
                ${tx.prove_image ? `
                    <div class="transaction-image">
                        <img src="${tx.prove_image}" alt="Proof" onclick="window.open('${tx.prove_image}', '_blank')">
                    </div>
                ` : ''}
            </div>
            <div class="transaction-actions">
                <button class="btn btn-danger" onclick="deleteTransaction(${tx.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showToast('Transaction deleted successfully!', 'success');
            loadTransactions();
        } else {
            showToast('Failed to delete transaction', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


        // ============================================
        // STRIPE CONFIGURATION
        // ============================================
        const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RNlJ4QZNxf9XgCiMpOBpsCT441wJia5Ghs9vkXiKZPDzLYnbgEYoBXMy1vDLF5BMguMMlnwRcYT01xYSZt4DAQR00jgxXnwuB';
        
        let stripe = null;
        let cardElement = null;
        
        function initStripe() {
            if (typeof Stripe !== 'undefined' && STRIPE_PUBLISHABLE_KEY) {
                try {
                    stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
                    return true;
                } catch(e) {
                    return false;
                }
            }
            return false;
        }
        
        // ============================================
        // SHARE FUNCTIONALITY
        // ============================================
        const SHARE_URL = encodeURIComponent(window.location.href);
        const SHARE_TITLE = encodeURIComponent('FundMe Social - Crowdfunding Platform');
        const SHARE_DESCRIPTION = encodeURIComponent('Support amazing campaigns and bring ideas to life! Join FundMe Social today.');

        function shareOnFacebook() {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${SHARE_URL}`, '_blank', 'width=600,height=400');
        }

        function shareOnTwitter() {
            window.open(`https://twitter.com/intent/tweet?text=${SHARE_TITLE}&url=${SHARE_URL}`, '_blank', 'width=600,height=400');
        }

        function shareOnLinkedIn() {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${SHARE_URL}`, '_blank', 'width=600,height=400');
        }

        function shareOnWhatsApp() {
            window.open(`https://wa.me/?text=${SHARE_TITLE}%20-%20${SHARE_URL}`, '_blank', 'width=600,height=400');
        }

        async function copyLinkToClipboard() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showModal('success', { message: 'Link copied to clipboard! Share it with your friends.' });
            } catch (err) {
                showModal('info', { title: 'Copy Failed', message: 'Please manually copy the URL from your browser.' });
            }
        }

        function showShareModal() {
            const modalHtml = `
                <div class="modal-overlay" id="shareModal">
                    <div class="modal">
                        <span class="close-modal" onclick="document.getElementById('shareModal').remove()">&times;</span>
                        <h3>📤 Share FundMe Social</h3>
                        <div class="share-options">
                            <button class="share-btn share-facebook" onclick="shareOnFacebook(); document.getElementById('shareModal').remove();">
                                📘 Share on Facebook
                            </button>
                            <button class="share-btn share-twitter" onclick="shareOnTwitter(); document.getElementById('shareModal').remove();">
                                🐦 Share on Twitter
                            </button>
                            <button class="share-btn share-linkedin" onclick="shareOnLinkedIn(); document.getElementById('shareModal').remove();">
                                💼 Share on LinkedIn
                            </button>
                            <button class="share-btn share-whatsapp" onclick="shareOnWhatsApp(); document.getElementById('shareModal').remove();">
                                💬 Share on WhatsApp
                            </button>
                            <button class="share-btn share-copy" onclick="copyLinkToClipboard(); document.getElementById('shareModal').remove();">
                                🔗 Copy Link
                            </button>
                        </div>
                        <input type="text" class="share-link-input" value="${window.location.href}" readonly onclick="this.select()">
                        <div class="info-note" style="margin-top: 16px;">Share this platform with your network and help creators succeed!</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Attach close event to backdrop
            const modalOverlay = document.getElementById('shareModal');
            if (modalOverlay) {
                modalOverlay.onclick = (e) => {
                    if (e.target === modalOverlay) modalOverlay.remove();
                };
            }
        }
        
        // ============================================
        // VIDEO PLATFORM DETECTION & EMBED GENERATION
        // ============================================
        function detectVideoPlatform(url) {
            if (!url) return { platform: null, embedUrl: null, isValid: false };
            
            const lowerUrl = url.toLowerCase();
            
            const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const youtubeMatch = url.match(youtubeRegex);
            if (youtubeMatch) {
                return { platform: 'YouTube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`, isValid: true, icon: '▶️' };
            }
            
            const tiktokRegex = /(?:tiktok\.com\/@[\w.-]+\/video\/|tiktok\.com\/v\/)(\d+)/;
            const tiktokMatch = url.match(tiktokRegex);
            if (tiktokMatch) {
                return { platform: 'TikTok', embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`, isValid: true, icon: '📱' };
            }
            
            const facebookRegex = /(?:facebook\.com\/[^/]+\/videos\/|fb\.watch\/?)(\d+)/;
            const facebookMatch = url.match(facebookRegex);
            if (facebookMatch) {
                return { platform: 'Facebook', embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`, isValid: true, icon: '📘' };
            }
            
            const instagramRegex = /(?:instagram\.com\/p\/|instagram\.com\/reel\/)([a-zA-Z0-9_-]+)/;
            const instagramMatch = url.match(instagramRegex);
            if (instagramMatch) {
                return { platform: 'Instagram', embedUrl: `https://www.instagram.com/p/${instagramMatch[1]}/embed`, isValid: true, icon: '📷' };
            }
            
            const pinterestRegex = /(?:pinterest\.com\/pin\/)(\d+)/;
            const pinterestMatch = url.match(pinterestRegex);
            if (pinterestMatch) {
                return { platform: 'Pinterest', embedUrl: `https://www.pinterest.com/pin/${pinterestMatch[1]}/embed`, isValid: true, icon: '📌' };
            }
            
            const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
            const vimeoMatch = url.match(vimeoRegex);
            if (vimeoMatch) {
                return { platform: 'Vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, isValid: true, icon: '🎬' };
            }
            
            return { platform: null, embedUrl: null, isValid: false, icon: '❓' };
        }
        
        function getVideoPreviewHtml(url) {
            const detection = detectVideoPlatform(url);
            if (!detection.isValid) {
                return '<div class="info-note" style="color:#FF6B6B;">⚠️ Unsupported video link. Please use YouTube, TikTok, Facebook, Instagram, Pinterest, or Vimeo.</div>';
            }
            
            return `
                <div class="video-preview-container">
                    <iframe class="video-preview-frame" src="${detection.embedUrl}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                    <div class="video-platform-badge">
                        <span class="platform-icon">${detection.icon}</span>
                        <span>${detection.platform} Video</span>
                    </div>
                </div>
            `;
        }
        
        // ============================================
        // APPLICATION STATE
        // ============================================
        let currentUser = null;
        let campaigns = [];
        let currentTab = 'explore';
        let searchQuery = '';
        let selectedCategory = 'all';
        
        let customCategories = [];
        let selectedIdFile = null;
        let selectedBusinessFile = null;
        let selectedProductFile = null;
        
        const USERS_KEY = "fundme_stripe_users";
        const SESSION_KEY = "fundme_stripe_session";
        const STORAGE_CAMPAIGNS = "fundme_stripe_campaigns";
        const CUSTOM_CATEGORIES_KEY = "fundme_stripe_custom_categories";
        
        const defaultCategories = [
            { id: 'all', name: 'All Categories', icon: '🎯', isDefault: true },
            { id: 'education', name: 'Education', icon: '📚', isDefault: true },
            { id: 'environment', name: 'Environment', icon: '🌱', isDefault: true },
            { id: 'health', name: 'Health', icon: '🏥', isDefault: true },
            { id: 'technology', name: 'Technology', icon: '💻', isDefault: true },
            { id: 'community', name: 'Community', icon: '🤝', isDefault: true }
        ];
        
        // ============================================
        // HELPER FUNCTIONS
        // ============================================
        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        
        function getAllCategories() {
            const saved = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
            if (saved) {
                try {
                    customCategories = JSON.parse(saved);
                } catch(e) {
                    customCategories = [];
                }
            }
            return [...defaultCategories, ...customCategories];
        }
        
        function addCustomCategory(categoryName) {
            if (!categoryName || categoryName.trim() === '') {
                return { success: false, message: 'Category name cannot be empty' };
            }
            const name = categoryName.trim();
            const existing = getAllCategories().find(c => c.name.toLowerCase() === name.toLowerCase());
            if (existing) return { success: false, message: 'Category already exists' };
            const newCategory = { id: 'custom_' + Date.now(), name: name, icon: '🏷️', isDefault: false };
            customCategories.push(newCategory);
            localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
            return { success: true, category: newCategory };
        }
        
        function getCategoryName(categoryId) {
            const cat = getAllCategories().find(c => c.id === categoryId);
            return cat ? cat.name : 'Custom';
        }
        
        function getCategoryClass(categoryId) {
            const cat = getAllCategories().find(c => c.id === categoryId);
            if (cat && !cat.isDefault) return 'category-custom';
            const classes = {
                'education': 'category-education',
                'environment': 'category-environment',
                'health': 'category-health',
                'technology': 'category-technology',
                'community': 'category-community'
            };
            return classes[categoryId] || 'category-default';
        }
        
        function getCategoryIcon(categoryId) {
            const cat = getAllCategories().find(c => c.id === categoryId);
            return cat ? cat.icon : '🏷️';
        }
        
        function isGoalMet(campaign) {
            return (campaign.raised || 0) >= campaign.goal;
        }
        
        function validateIDNumber(idNumber) {
            idNumber = String(idNumber).trim().replace(/\s/g, '');
            if (!/^\d{13}$/.test(idNumber)) {
                return { valid: false, message: 'ID number must be 13 digits' };
            }
            const year = parseInt(idNumber.substring(0, 2));
            const month = parseInt(idNumber.substring(2, 4));
            const day = parseInt(idNumber.substring(4, 6));
            if (month < 1 || month > 12) {
                return { valid: false, message: 'Invalid birth month' };
            }
            const birthYear = 1900 + year;
            let age = new Date().getFullYear() - birthYear;
            return {
                valid: true,
                age: age,
                gender: parseInt(idNumber.substring(6, 10)) >= 5000 ? 'Male' : 'Female'
            };
        }
        
        function initData() {
            let users = localStorage.getItem(USERS_KEY);
            if (!users) {
                const defaultUsers = [
                    { email: "admin@fundme.com", password: "admin123", role: "admin", name: "Admin", idNumber: "8001015009087", age: 44, gender: "Female", hasApprovedCampaign: false },
                    { email: "creator@example.com", password: "creator123", role: "creator", name: "Creator", idNumber: "9002026009087", age: 34, gender: "Male", hasApprovedCampaign: false }
                ];
                localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
            }
            let stored = localStorage.getItem(STORAGE_CAMPAIGNS);
            if (!stored) {
                campaigns = [
                    { id: "camp1", title: "Eco Warriors Africa", desc: "Help reduce plastic waste in coastal communities.", goal: 12000, raised: 11800, category: "environment", status: "approved", creatorEmail: "creator@example.com", donorCount: 95, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", createdAt: Date.now() - 86400000 },
                    { id: "camp2", title: "Digital Library for Kids", desc: "Building a tech hub for underprivileged children.", goal: 7500, raised: 1890, category: "education", status: "pending", creatorEmail: "creator@example.com", donorCount: 12, videoUrl: "", createdAt: Date.now() - 3600000 },
                    { id: "camp3", title: "Clean Water Initiative", desc: "Providing clean water to 500 families.", goal: 15000, raised: 0, category: "health", status: "approved", creatorEmail: "creator@example.com", donorCount: 0, videoUrl: "", createdAt: Date.now() - 7200000 },
                    { id: "camp4", title: "Solar Power Project", desc: "Bringing solar energy to rural communities.", goal: 25000, raised: 25000, category: "technology", status: "approved", creatorEmail: "creator@example.com", donorCount: 156, videoUrl: "https://vimeo.com/123456789", createdAt: Date.now() - 17200000 }
                ];
                saveCampaigns();
            } else {
                try {
                    campaigns = JSON.parse(stored);
                } catch(e) {
                    campaigns = [];
                }
            }
            campaigns.forEach(c => {
                if (c.raised === undefined) c.raised = 0;
                if (!c.donorCount) c.donorCount = 0;
                if (!c.videoUrl) c.videoUrl = null;
            });
            saveCampaigns();
        }
        
        function saveCampaigns() {
            localStorage.setItem(STORAGE_CAMPAIGNS, JSON.stringify(campaigns));
        }
        
        function loadSession() {
            const session = localStorage.getItem(SESSION_KEY);
            if (session) {
                try {
                    currentUser = JSON.parse(session);
                } catch(e) {
                    currentUser = null;
                }
            }
        }
        
        function saveSession() {
            if (currentUser) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
            } else {
                localStorage.removeItem(SESSION_KEY);
            }
        }
        
        function filterCampaigns() {
            let filtered = campaigns.filter(c => c.status === 'approved');
            if (selectedCategory !== 'all') {
                filtered = filtered.filter(c => c.category === selectedCategory);
            }
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(c => 
                    c.title.toLowerCase().includes(query) || 
                    c.desc.toLowerCase().includes(query)
                );
            }
            return filtered;
        }
        
        function userHasApprovedCampaign(email) {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const user = users.find(u => u.email === email);
            return user ? user.hasApprovedCampaign : false;
        }
        
        function updateUserHasApprovedCampaign(email, hasApproved) {
            let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const idx = users.findIndex(u => u.email === email);
            if (idx !== -1) {
                users[idx].hasApprovedCampaign = hasApproved;
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
                if (currentUser && currentUser.email === email) {
                    currentUser.hasApprovedCampaign = hasApproved;
                    saveSession();
                }
            }
        }
        
        // ============================================
        // STRIPE DONATION FUNCTION
        // ============================================
        async function processStripeDonation(campaignId, amount, donorEmail) {
            const campaign = campaigns.find(c => c.id === campaignId);
            if (!campaign) return false;
            
            if (isGoalMet(campaign)) {
                showModal('info', { title: 'Goal Reached', message: 'This campaign has already reached its funding goal. Thank you for your support!' });
                return false;
            }
            
            const newRaised = (campaign.raised || 0) + amount;
            if (newRaised > campaign.goal) {
                const remaining = campaign.goal - (campaign.raised || 0);
                showModal('info', { title: 'Donation Limit', message: `This campaign only needs $${remaining} more to reach its goal. Please enter an amount of $${remaining} or less.` });
                return false;
            }
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    campaign.raised = newRaised;
                    campaign.donorCount = (campaign.donorCount || 0) + 1;
                    saveCampaigns();
                    resolve(true);
                }, 1500);
            });
        }
        
        // Platform donation (for users donating to FundMe platform)
        async function processPlatformDonation(amount, donorEmail) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Platform donation of $${amount} from ${donorEmail}`);
                    resolve(true);
                }, 1500);
            });
        }
        
        // ============================================
        // FOOTER MODAL FUNCTIONS
        // ============================================
        function showFooterModal(type) {
            let title = '', message = '';
            if (type === 'about') {
                title = '📖 About FundMe Social';
                message = 'FundMe Social is a crowdfunding platform that connects passionate creators with generous supporters. We believe in empowering individuals and communities to bring their ideas to life. Our platform provides a secure, transparent way to raise funds for meaningful projects, from educational initiatives to environmental causes. Join us in making a difference, one campaign at a time!';
            } else if (type === 'contact') {
                title = '📞 Contact Us';
                message = 'Email: support@fundmesocial.com\nPhone: +1 (555) 123-4567\nAddress: 123 Innovation Drive, Silicon Valley, CA 94025\n\nBusiness Hours: Monday-Friday, 9 AM - 6 PM EST\n\nFor support inquiries, please email us or use the contact form on our website.';
            } else if (type === 'terms') {
                title = '📜 Terms of Service';
                message = 'By using FundMe Social, you agree to our terms:\n\n1. Campaign creators must be 18+ years old.\n2. All campaigns are subject to review and approval.\n3. FundMe Social takes a 5% platform fee on successful campaigns.\n4. Donations are final and non-refundable.\n5. Creators must use funds for stated purposes.\n6. We reserve the right to remove any campaign violating our policies.\n7. Users must provide accurate identity information.\n\nFor full terms, visit our website.';
            } else if (type === 'donateToPlatform') {
                title = '💝 Donate to FundMe Social';
                message = 'Your donation helps us maintain and improve the platform, support creators, and reach more communities worldwide.\n\nSuggested donation amounts:\n• $10 - Helps us process 50 campaign submissions\n• $25 - Supports a creator workshop\n• $50 - Funds platform maintenance for a day\n• $100 - Helps us reach 1000 new users\n\nEvery contribution, big or small, makes a difference!\n\nThank you for your support! ❤️';
            }
            showModal('info', { title: title, message: message });
        }
        
        function showPlatformDonationModal() {
            if (!currentUser) {
                showModal('info', { title: 'Login Required', message: 'Please login to donate to FundMe Social.' });
                setTimeout(() => showModal('login'), 1500);
                return;
            }
            showModal('platformDonation');
        }
        
        function showSupportUsModal() {
            showModal('info', { 
                title: '💝 Support FundMe Social', 
                message: 'Thank you for wanting to support our platform!\n\nWays to support:\n• Spread the word about FundMe Social\n• Become a monthly supporter (contact us)\n• Donate directly to platform development (click "Donate to Us" in Quick Links)\n• Share feedback and suggestions\n\nEvery contribution helps us grow and serve more creators and donors worldwide!\n\nTo discuss partnership or sponsorship opportunities, please email: partnerships@fundmesocial.com' 
            });
        }
        
        // ============================================
        // MODAL FUNCTIONS
        // ============================================
        function showModal(type, data = {}) {
            const existing = document.getElementById('modalOverlay');
            if (existing) existing.remove();
            
            let html = '';
            if (type === 'login') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal"><span class="close-modal">&times;</span><h3>🔐 Login</h3><div id="modalError" class="error-msg"></div><input type="email" id="loginEmail" placeholder="Email"><input type="password" id="loginPassword" placeholder="Password"><button id="modalSubmitBtn">Login</button><div class="modal-switch"><span id="toggleAuthMode">Create an account →</span></div><div class="info-note">Demo: admin@fundme.com / admin123 | creator@example.com / creator123</div></div></div>';
            } else if (type === 'register') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal"><span class="close-modal">&times;</span><h3>📝 Create Account</h3><div id="modalError" class="error-msg"></div><input type="text" id="regName" placeholder="Full Name"><input type="email" id="regEmail" placeholder="Email"><input type="text" id="regIdNumber" placeholder="ID Number (13 digits)" maxlength="13"><div id="agePreview" class="age-display" style="display:none;"></div><input type="password" id="regPassword" placeholder="Password"><input type="password" id="regConfirmPassword" placeholder="Confirm Password"><button id="registerSubmitBtn">Create Account</button><div class="modal-switch"><span id="backToLogin">← Back to Login</span></div></div></div>';
            } else if (type === 'stripePayment') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal"><span class="close-modal">&times;</span><h3>💳 Donate with Stripe</h3><h4 style="text-align:center; margin-bottom:20px; color:#4ECDC4;">' + escapeHtml(data.campaignTitle) + '</h4><div id="modalError" class="error-msg"></div><input type="number" id="donationAmount" placeholder="Enter amount in USD" min="1" step="1" value="10"><div class="quick-amounts"><button id="donate10">$10</button><button id="donate25">$25</button><button id="donate50">$50</button><button id="donate100">$100</button></div><div id="card-element" class="stripe-element"></div><div id="card-errors" class="payment-error" role="alert"></div><button id="donateSubmitBtn">💝 Pay with Stripe</button><div class="modal-switch"><span id="closeDonationModal">Cancel</span></div></div></div>';
            } else if (type === 'platformDonation') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal"><span class="close-modal">&times;</span><h3>💝 Support FundMe Social</h3><p style="text-align:center; margin-bottom:20px;">Your donation helps us grow and serve more creators!</p><div id="modalError" class="error-msg"></div><input type="number" id="donationAmount" placeholder="Enter amount in USD" min="1" step="1" value="25"><div class="quick-amounts"><button id="donate10">$10</button><button id="donate25">$25</button><button id="donate50">$50</button><button id="donate100">$100</button></div><div id="card-element" class="stripe-element"></div><div id="card-errors" class="payment-error" role="alert"></div><button id="platformDonateSubmitBtn">💝 Donate to FundMe</button><div class="modal-switch"><span id="closeDonationModal">Cancel</span></div></div></div>';
            } else if (type === 'success') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal" style="text-align:center;"><span class="close-modal">&times;</span><div style="font-size:64px; margin-bottom:20px;">🎉</div><h3 style="color:#27AE60;">Success!</h3><p style="margin:20px 0;">' + escapeHtml(data.message) + '</p><button id="closeSuccessModal">Continue</button></div></div>';
            } else if (type === 'confirm') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal" style="text-align:center;"><span class="close-modal">&times;</span><h3>' + escapeHtml(data.title) + '</h3><p style="margin:20px 0;">' + escapeHtml(data.message) + '</p><div style="display:flex; gap:12px;"><button id="confirmNo" style="flex:1; background:rgba(255,255,255,0.2);">Cancel</button><button id="confirmYes" style="flex:1;">Confirm</button></div></div></div>';
            } else if (type === 'info') {
                html = '<div class="modal-overlay" id="modalOverlay"><div class="modal" style="text-align:center;"><span class="close-modal">&times;</span><div style="font-size:48px; margin-bottom:20px;">ℹ️</div><h3>' + escapeHtml(data.title) + '</h3><p style="margin:20px 0; white-space:pre-line;">' + escapeHtml(data.message) + '</p><button id="closeInfoModal">OK</button></div></div>';
            }
            
            document.body.insertAdjacentHTML('beforeend', html);
            attachModalEvents(type, data);
        }
        
        function attachModalEvents(type, data) {
            const overlay = document.getElementById('modalOverlay');
            const close = document.querySelector('.close-modal');
            if (close) close.onclick = () => overlay?.remove();
            if (overlay) overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
            
            if (type === 'login') {
                const submit = document.getElementById('modalSubmitBtn');
                const toggle = document.getElementById('toggleAuthMode');
                const error = document.getElementById('modalError');
                const emailInp = document.getElementById('loginEmail');
                const passInp = document.getElementById('loginPassword');
                const handle = () => {
                    const email = emailInp.value.trim();
                    const password = passInp.value.trim();
                    if (!email || !password) { error.innerText = "Fill all fields"; return; }
                    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        currentUser = { email: user.email, role: user.role, name: user.name, age: user.age, hasApprovedCampaign: user.hasApprovedCampaign };
                        saveSession();
                        overlay.remove();
                        renderApp();
                        showModal('success', { message: 'Welcome back, ' + email.split('@')[0] + '!' });
                    } else { error.innerText = "Invalid credentials"; }
                };
                submit.onclick = handle;
                toggle.onclick = () => { overlay.remove(); showModal('register'); };
                emailInp.addEventListener('keypress', (e) => { if (e.key === 'Enter') handle(); });
                passInp.addEventListener('keypress', (e) => { if (e.key === 'Enter') handle(); });
            }
            
            if (type === 'register') {
                const idInput = document.getElementById('regIdNumber');
                const agePreview = document.getElementById('agePreview');
                if (idInput) {
                    idInput.addEventListener('input', (e) => {
                        let val = e.target.value.replace(/\D/g, '').substring(0, 13);
                        e.target.value = val;
                        if (val.length === 13) {
                            const v = validateIDNumber(val);
                            if (v.valid) {
                                agePreview.style.display = 'flex';
                                agePreview.innerHTML = '<span>✅</span><div><strong>Age: ' + v.age + ' years</strong><br>Gender: ' + v.gender + '</div>';
                            } else {
                                agePreview.style.display = 'flex';
                                agePreview.innerHTML = '<span>⚠️</span><div>' + v.message + '</div>';
                            }
                        } else if (val.length > 0) {
                            agePreview.style.display = 'flex';
                            agePreview.innerHTML = '<span>⚠️</span><div>Need 13 digits (' + val.length + ')</div>';
                        } else { agePreview.style.display = 'none'; }
                    });
                }
                const submitBtn = document.getElementById('registerSubmitBtn');
                const backBtn = document.getElementById('backToLogin');
                submitBtn.onclick = () => {
                    const name = document.getElementById('regName').value.trim();
                    const email = document.getElementById('regEmail').value.trim();
                    const idNum = document.getElementById('regIdNumber').value.trim();
                    const pass = document.getElementById('regPassword').value;
                    const confirm = document.getElementById('regConfirmPassword').value;
                    const error = document.getElementById('modalError');
                    if (!name || !email || !idNum || !pass) { error.innerText = "Fill all fields"; return; }
                    if (pass !== confirm) { error.innerText = "Passwords don't match"; return; }
                    if (pass.length < 6) { error.innerText = "Password too short"; return; }
                    const validation = validateIDNumber(idNum);
                    if (!validation.valid) { error.innerText = validation.message; return; }
                    if (validation.age < 18) { error.innerText = "Must be 18+ (Age: " + validation.age + ")"; return; }
                    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                    if (users.find(u => u.email === email)) { error.innerText = "Email exists"; return; }
                    const newUser = { email, password: pass, role: 'creator', name, idNumber: idNum, age: validation.age, gender: validation.gender, hasApprovedCampaign: false };
                    users.push(newUser);
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                    currentUser = { email, role: 'creator', name, age: validation.age, hasApprovedCampaign: false };
                    saveSession();
                    overlay.remove();
                    renderApp();
                    showModal('success', { message: 'Welcome, ' + name + '!' });
                };
                backBtn.onclick = () => { overlay.remove(); showModal('login'); };
            }
            
            if (type === 'stripePayment') {
                const amountInput = document.getElementById('donationAmount');
                document.getElementById('donate10').onclick = () => { if (amountInput) amountInput.value = 10; };
                document.getElementById('donate25').onclick = () => { if (amountInput) amountInput.value = 25; };
                document.getElementById('donate50').onclick = () => { if (amountInput) amountInput.value = 50; };
                document.getElementById('donate100').onclick = () => { if (amountInput) amountInput.value = 100; };
                
                if (stripe && !cardElement) {
                    const elements = stripe.elements();
                    const style = {
                        base: {
                            color: '#ffffff',
                            fontFamily: '"Inter", sans-serif',
                            fontSmoothing: 'antialiased',
                            fontSize: '16px',
                            '::placeholder': { color: 'rgba(255,255,255,0.5)' }
                        },
                        invalid: { color: '#FF6B6B', iconColor: '#FF6B6B' }
                    };
                    cardElement = elements.create('card', { style: style });
                    cardElement.mount('#card-element');
                    cardElement.on('change', function(event) {
                        const displayError = document.getElementById('card-errors');
                        if (event.error) {
                            displayError.textContent = event.error.message;
                        } else {
                            displayError.textContent = '';
                        }
                    });
                }
                
                const submitBtn = document.getElementById('donateSubmitBtn');
                if (submitBtn) {
                    submitBtn.onclick = async () => {
                        const amt = parseFloat(amountInput.value);
                        if (isNaN(amt) || amt < 1) {
                            const err = document.getElementById('modalError');
                            if (err) err.innerText = "Enter valid amount (minimum $1)";
                            return;
                        }
                        
                        if (!cardElement) {
                            showModal('info', { title: 'Payment Error', message: 'Stripe is not properly configured.' });
                            return;
                        }
                        
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Processing...';
                        
                        const success = await processStripeDonation(data.campaignId, amt, currentUser?.email);
                        
                        if (success) {
                            overlay.remove();
                            showModal('success', { message: 'Thank you for your donation of $' + amt + ' to ' + data.campaignTitle + '!' });
                            renderApp();
                        } else {
                            submitBtn.disabled = false;
                            submitBtn.textContent = '💝 Pay with Stripe';
                        }
                    };
                }
                
                const closeBtn = document.getElementById('closeDonationModal');
                if (closeBtn) closeBtn.onclick = () => overlay.remove();
            }
            
            if (type === 'platformDonation') {
                const amountInput = document.getElementById('donationAmount');
                document.getElementById('donate10').onclick = () => { if (amountInput) amountInput.value = 10; };
                document.getElementById('donate25').onclick = () => { if (amountInput) amountInput.value = 25; };
                document.getElementById('donate50').onclick = () => { if (amountInput) amountInput.value = 50; };
                document.getElementById('donate100').onclick = () => { if (amountInput) amountInput.value = 100; };
                
                if (stripe && !cardElement) {
                    const elements = stripe.elements();
                    const style = {
                        base: {
                            color: '#ffffff',
                            fontFamily: '"Inter", sans-serif',
                            fontSmoothing: 'antialiased',
                            fontSize: '16px',
                            '::placeholder': { color: 'rgba(255,255,255,0.5)' }
                        },
                        invalid: { color: '#FF6B6B', iconColor: '#FF6B6B' }
                    };
                    cardElement = elements.create('card', { style: style });
                    cardElement.mount('#card-element');
                    cardElement.on('change', function(event) {
                        const displayError = document.getElementById('card-errors');
                        if (event.error) {
                            displayError.textContent = event.error.message;
                        } else {
                            displayError.textContent = '';
                        }
                    });
                }
                
                const submitBtn = document.getElementById('platformDonateSubmitBtn');
                if (submitBtn) {
                    submitBtn.onclick = async () => {
                        const amt = parseFloat(amountInput.value);
                        if (isNaN(amt) || amt < 1) {
                            const err = document.getElementById('modalError');
                            if (err) err.innerText = "Enter valid amount (minimum $1)";
                            return;
                        }
                        
                        if (!cardElement) {
                            showModal('info', { title: 'Payment Error', message: 'Stripe is not properly configured.' });
                            return;
                        }
                        
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Processing...';
                        
                        const success = await processPlatformDonation(amt, currentUser?.email);
                        
                        if (success) {
                            overlay.remove();
                            showModal('success', { message: 'Thank you for your generous donation of $' + amt + ' to FundMe Social! ❤️' });
                            renderApp();
                        } else {
                            submitBtn.disabled = false;
                            submitBtn.textContent = '💝 Donate to FundMe';
                        }
                    };
                }
                
                const closeBtn = document.getElementById('closeDonationModal');
                if (closeBtn) closeBtn.onclick = () => overlay.remove();
            }
            
            if (type === 'success' || type === 'info') {
                const successBtn = document.getElementById('closeSuccessModal');
                const infoBtn = document.getElementById('closeInfoModal');
                if (successBtn) successBtn.onclick = () => overlay.remove();
                if (infoBtn) infoBtn.onclick = () => overlay.remove();
            }
            
            if (type === 'confirm') {
                document.getElementById('confirmYes').onclick = () => { if (data.onConfirm) data.onConfirm(); overlay.remove(); };
                document.getElementById('confirmNo').onclick = () => overlay.remove();
            }
        }
        
        function showStripePaymentModal(campaignId, campaignTitle) {
            showModal('stripePayment', { campaignId: campaignId, campaignTitle: campaignTitle });
        }
        
        // ============================================
        // CAMPAIGN SUBMISSION
        // ============================================
        function submitNewCampaign(title, desc, goal, category, videoUrl) {
            if (!currentUser) {
                showModal('info', { title: 'Login Required', message: 'Please login to create a campaign.' });
                return false;
            }
            
            const hasApproved = userHasApprovedCampaign(currentUser.email);
            const hasExistingApproved = campaigns.some(c => c.creatorEmail === currentUser.email && c.status === 'approved');
            const hasExistingPending = campaigns.some(c => c.creatorEmail === currentUser.email && c.status === 'pending');
            
            if (hasApproved || hasExistingApproved) {
                showModal('info', { title: 'Not Allowed', message: 'You already have an approved campaign! Only one campaign per creator.' });
                return false;
            }
            
            if (hasExistingPending) {
                showModal('info', { title: 'Pending Review', message: 'You already have a pending campaign. Please wait for admin decision.' });
                return false;
            }
            
            if (!selectedIdFile || !selectedBusinessFile) {
                showModal('info', { title: 'Missing Documents', message: 'Please upload both Government ID and Business Registration documents.' });
                return false;
            }
            
            const newCampaign = {
                id: Date.now().toString(),
                title: title,
                desc: desc || "No description provided",
                goal: goal,
                raised: 0,
                category: category,
                documents: {
                    id: selectedIdFile,
                    business: selectedBusinessFile,
                    product: selectedProductFile || null
                },
                videoUrl: videoUrl || null,
                status: "pending",
                createdAt: Date.now(),
                creatorEmail: currentUser.email,
                donorCount: 0
            };
            
            campaigns.push(newCampaign);
            saveCampaigns();
            return true;
        }
        
        function approveCampaign(id) {
            const camp = campaigns.find(c => c.id === id);
            if (camp && camp.status === 'pending') {
                camp.status = 'approved';
                saveCampaigns();
                updateUserHasApprovedCampaign(camp.creatorEmail, true);
                showModal('success', { message: '✅ "' + camp.title + '" has been approved!' });
                renderApp();
            }
        }
        
        function rejectCampaign(id) {
            const camp = campaigns.find(c => c.id === id);
            if (camp && camp.status === 'pending') {
                camp.status = 'rejected';
                saveCampaigns();
                showModal('info', { title: 'Campaign Rejected', message: '❌ "' + camp.title + '" has been rejected.' });
                renderApp();
            }
        }
        
        // ============================================
        // RENDER FUNCTIONS
        // ============================================
        function renderSearchFilterBar() {
            const filtered = filterCampaigns().length;
            const total = campaigns.filter(c => c.status === 'approved').length;
            const allCats = getAllCategories();
            return '<div class="search-filter-bar">' +
                '<div class="search-box"><span class="search-icon">🔍</span><input type="text" id="searchInput" placeholder="Search campaigns..." value="' + escapeHtml(searchQuery) + '"></div>' +
                '<div class="category-filter"><select id="categorySelect">' + allCats.map(c => '<option value="' + c.id + '" ' + (selectedCategory === c.id ? 'selected' : '') + '>' + c.icon + ' ' + c.name + '</option>').join('') + '</select></div>' +
                '<div class="clear-filters" id="clearFiltersBtn">✖ Clear</div>' +
                '</div>' +
                '<div class="category-chips">' +
                allCats.filter(c => c.id !== 'all').map(c => '<div class="category-chip ' + (selectedCategory === c.id ? 'active' : '') + '" data-category="' + c.id + '">' + c.icon + ' ' + c.name + '</div>').join('') +
                '<div class="custom-category-container">' +
                '<div class="custom-category-input"><input type="text" id="newCategoryName" placeholder="+ New category"></div>' +
                '<button id="addCategoryBtn" class="add-category-btn">➕ Add</button>' +
                '</div></div>';
        }
        
        function renderExploreTab() {
            const filtered = filterCampaigns();
            return '<div class="card">' +
                '<h2>🌍 Support Campaigns</h2>' +
                renderSearchFilterBar() +
                '<div class="campaigns-grid">' +
                filtered.map(camp => {
                    const percent = Math.min(100, ((camp.raised || 0) / camp.goal) * 100);
                    const goalMet = isGoalMet(camp);
                    const donateDisabled = goalMet;
                    const buttonText = goalMet ? '🏆 Goal Reached!' : '💳 Donate with Stripe';
                    
                    let videoPreviewHtml = '';
                    if (camp.videoUrl && camp.videoUrl.trim()) {
                        const detection = detectVideoPlatform(camp.videoUrl);
                        if (detection.isValid) {
                            videoPreviewHtml = '<div class="video-preview-container" style="margin-top:12px;"><iframe class="video-preview-frame" src="' + detection.embedUrl + '" frameborder="0" allowfullscreen style="border-radius:16px;"></iframe><div class="video-platform-badge"><span class="platform-icon">' + detection.icon + '</span><span>' + detection.platform + ' Video</span></div></div>';
                        }
                    }
                    
                    return '<div class="campaign-card">' +
                        (goalMet ? '<div class="goal-met-badge">🎯 GOAL MET!</div>' : '') +
                        '<div class="campaign-category ' + getCategoryClass(camp.category) + '">' + getCategoryIcon(camp.category) + ' ' + escapeHtml(getCategoryName(camp.category)) + '</div>' +
                        '<div><strong>🚀 ' + escapeHtml(camp.title) + '</strong></div>' +
                        '<div style="margin:10px 0; font-size:0.85rem; color:rgba(255,255,255,0.7);">' + escapeHtml(camp.desc.substring(0, 100)) + '</div>' +
                        videoPreviewHtml +
                        '<div class="progress-bar"><div class="progress-fill" style="width: ' + percent + '%;"></div></div>' +
                        '<div style="display:flex; justify-content:space-between;">' +
                        '<span>💰 $' + (camp.raised || 0).toLocaleString() + ' raised</span>' +
                        '<span>🎯 $' + camp.goal.toLocaleString() + ' goal</span>' +
                        '</div>' +
                        '<div style="font-size:0.7rem; margin-top:8px;">👥 ' + (camp.donorCount || 0) + ' donors</div>' +
                        '<button class="donate-btn" data-id="' + camp.id + '" data-title="' + escapeHtml(camp.title) + '" ' + (donateDisabled ? 'disabled' : '') + '>' + buttonText + '</button>' +
                        (goalMet ? '<div class="info-note" style="margin-top:8px; color:#27AE60;">🎉 This campaign has reached its funding goal!</div>' : '') +
                        '</div>';
                }).join('') +
                '</div>' +
                (filtered.length === 0 ? '<div class="info-note">🔍 No campaigns found matching your criteria.</div>' : '') +
                '</div>';
        }
        
        function renderCreatorTab() {
            const myCamps = currentUser ? campaigns.filter(c => c.creatorEmail === currentUser.email) : [];
            const hasApproved = currentUser ? userHasApprovedCampaign(currentUser.email) : false;
            const hasPending = myCamps.some(c => c.status === 'pending');
            const isRestricted = hasApproved || hasPending;
            const allCats = getAllCategories().filter(c => c.id !== 'all');
            
            const submitDisabled = !currentUser || isRestricted;
            const disabledAttr = submitDisabled ? ' disabled' : '';
            
            return '<div class="dashboard-grid">' +
                '<div class="card">' +
                '<h2>📢 Start Your Campaign</h2>' +
                (currentUser && currentUser.age ? '<div class="alert-banner">🪪 Verified: Age ' + currentUser.age + ' years</div>' : '') +
                (!currentUser ? '<div class="alert-banner">🔐 Please login to create a campaign</div>' : '') +
                (hasApproved ? '<div class="alert-banner warning">⚠️ You already have an approved campaign! One-time approval policy applies.</div>' : '') +
                (hasPending ? '<div class="alert-banner info">⏳ You have a pending campaign under review. Please wait for admin decision.</div>' : '') +
                '<form id="campaignForm">' +
                '<div class="form-group"><label>Campaign Title *</label><input type="text" id="campTitle" placeholder="e.g., Clean Water for All"></div>' +
                '<div class="form-group"><label>Short description</label><textarea id="campDesc" rows="2" placeholder="Tell your story..."></textarea></div>' +
                '<div class="form-group"><label>Goal (USD) *</label><input type="number" id="campGoal" value="5000"></div>' +
                '<div class="form-group"><label>Category *</label><select id="campCategory">' + allCats.map(c => '<option value="' + c.id + '">' + c.icon + ' ' + c.name + '</option>').join('') + '</select>' +
                '<div class="custom-category-container"><div class="custom-category-input"><input type="text" id="campNewCategory" placeholder="Or add new category..."></div><button type="button" id="addCampCategoryBtn" class="add-category-btn">➕ Add</button></div></div>' +
                '<div class="form-group"><label>🎬 Demo video link (optional)</label><input type="url" id="videoLink" placeholder="YouTube, TikTok, Facebook, Instagram, Pinterest, or Vimeo link"><div id="videoPreview" style="margin-top:12px;"></div><div class="doc-hint">Supports: YouTube, TikTok, Facebook, Instagram, Pinterest, Vimeo</div></div>' +
                '<div class="doc-section"><div class="doc-section-title">🪪 Government ID / Passport *</div>' +
                '<div class="custom-file-input"><input type="file" id="idDocument" accept=".pdf,.jpg,.jpeg,.png"><div class="custom-file-label"><span class="file-name" id="idFileName">No file chosen</span><span class="upload-icon">📎 Browse</span></div></div>' +
                '<div class="doc-hint">Upload driver\'s license, passport, or national ID</div></div>' +
                '<div class="doc-section"><div class="doc-section-title">🏢 Business Registration / NGO Certificate *</div>' +
                '<div class="custom-file-input"><input type="file" id="businessDoc" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"><div class="custom-file-label"><span class="file-name" id="businessFileName">No file chosen</span><span class="upload-icon">📎 Browse</span></div></div>' +
                '<div class="doc-hint">Business registration certificate, NGO license, or tax ID</div></div>' +
                '<div class="doc-section"><div class="doc-section-title">🔬 Product Registration / Patent (optional)</div>' +
                '<div class="custom-file-input"><input type="file" id="productDoc" accept=".pdf,.jpg,.jpeg,.png"><div class="custom-file-label"><span class="file-name" id="productFileName">No file chosen</span><span class="upload-icon">📎 Browse</span></div></div>' +
                '<div class="doc-hint">Patent, trademark, or prototype documentation</div></div>' +
                '<button type="submit" id="submitCampaignBtn"' + disabledAttr + '>🚀 Submit for Review</button>' +
                '</form>' +
                '<div id="creatorMessage" style="margin-top:16px;"></div>' +
                '</div>' +
                '<div class="card"><h2>📋 Your Campaign Status</h2>' +
                '<div id="userCampaignsList">' +
                (!currentUser ? '<div class="info-note">Login to see your campaigns</div>' : 
                  myCamps.length === 0 ? '<div class="info-note">No campaigns yet. Create one above ⬆️</div>' :
                  myCamps.map(camp => {
                      const goalMet = isGoalMet(camp);
                      return '<div class="campaign-item"><div><strong>🔥 ' + escapeHtml(camp.title) + '</strong> <span class="status-badge status-' + camp.status + '">' + camp.status + '</span>' +
                          (goalMet ? ' <span style="background:#27AE60; padding:2px 8px; border-radius:20px; font-size:0.7rem;">GOAL MET!</span>' : '') +
                          '</div>' +
                          '<div style="margin:8px 0;">Goal: $' + camp.goal.toLocaleString() + ' | Raised: $' + (camp.raised || 0).toLocaleString() + '</div>' +
                          '<div style="font-size:0.75rem;">Category: ' + escapeHtml(getCategoryName(camp.category)) + ' | 👥 ' + (camp.donorCount || 0) + ' donors</div>' +
                          (camp.status === 'approved' ? '<div style="color:#4ECDC4; margin-top:8px;">✓ Approved! You cannot submit more campaigns.</div>' : '') +
                          (camp.status === 'rejected' ? '<div style="color:#FF6B6B; margin-top:8px;">✗ Rejected — You may submit a new campaign.</div>' : '') +
                          '</div>';
                  }).join('')) +
                '</div><div class="info-note">⚠️ Once approved, you cannot submit another campaign.</div></div></div>';
        }
        
        function renderAdminTab() {
            if (!currentUser || currentUser.role !== 'admin') {
                return '<div class="card"><div class="info-note">🔒 Admin access only. Login with admin@fundme.com / admin123</div></div>';
            }
            const pending = campaigns.filter(c => c.status === 'pending');
            const processed = campaigns.filter(c => c.status !== 'pending');
            return '<div class="card">' +
                '<h2>⚡ Pending Review (' + pending.length + ')</h2>' +
                (pending.length === 0 ? '<div class="info-note">✨ No pending campaigns</div>' :
                pending.map(camp => '<div class="request-item"><div><strong>🔥 ' + escapeHtml(camp.title) + '</strong> <span class="status-badge status-pending">Pending</span></div>' +
                '<div style="margin:8px 0;">' + escapeHtml(camp.desc) + '</div>' +
                '<div>🎯 Goal: $' + camp.goal.toLocaleString() + ' | Category: ' + escapeHtml(getCategoryName(camp.category)) + '</div>' +
                '<div>👤 Creator: ' + escapeHtml(camp.creatorEmail) + '</div>' +
                '<div class="admin-actions"><button class="approve-btn" data-id="' + camp.id + '">✅ Approve</button>' +
                '<button class="reject-btn" data-id="' + camp.id + '">❌ Reject</button></div></div>').join('')) +
                '<hr><h2>✅ Processed Campaigns (' + processed.length + ')</h2>' +
                (processed.length === 0 ? '<div class="info-note">No processed campaigns</div>' :
                processed.map(camp => '<div class="request-item"><div><strong>' + escapeHtml(camp.title) + '</strong> <span class="status-badge status-' + camp.status + '">' + camp.status.toUpperCase() + '</span></div>' +
                '<div style="font-size:0.8rem; margin-top:4px;">Goal: $' + camp.goal.toLocaleString() + ' | Raised: $' + (camp.raised || 0).toLocaleString() + '</div>' +
                '<div style="font-size:0.7rem; color:rgba(255,255,255,0.5);">By: ' + escapeHtml(camp.creatorEmail) + ' | 👥 ' + (camp.donorCount || 0) + ' donors</div>' +
                (isGoalMet(camp) ? '<div style="color:#27AE60; font-size:0.7rem; margin-top:5px;">🏆 Goal reached!</div>' : '') +
                '</div>').join('')) +
                '</div>';
        }
        
        function renderFooter() {
            return '<div class="footer">' +
                '<div class="footer-content">' +
                '<div class="footer-section"><h4>🌟 FundMe Social</h4><p>Empowering creators and changemakers to bring their ideas to life. Secure crowdfunding with Stripe payments. Supports video embeds from YouTube, TikTok, Facebook, Instagram, Pinterest, and Vimeo.</p><div class="social-icons"><span>📘</span><span>🐦</span><span>📷</span><span>💼</span></div></div>' +
                '<div class="footer-section"><h4>🔗 Quick Links</h4><ul class="footer-links"><li><a onclick="showFooterModal(\'about\')">📖 About Us</a></li><li><a onclick="showFooterModal(\'contact\')">📞 Contact</a></li><li><a onclick="showFooterModal(\'terms\')">📜 Terms of Service</a></li><li><a onclick="showPlatformDonationModal()">💝 Donate to Us</a></li><li><a onclick="showShareModal()">📤 Share</a></li><li><a>🔒 Privacy Policy</a></li></ul></div>' +
                '<div class="footer-section"><h4>💡 Support</h4><p>Help us grow and serve more creators!</p><button class="support-btn-footer" onclick="showSupportUsModal()">💝 Support Us</button></div>' +
                '</div>' +
                '<div class="footer-bottom"><p>© 2024 FundMe Social. All rights reserved. | Empowering dreams, one campaign at a time.</p></div>' +
                '</div>';
        }
        
        function attachEvents() {
            const search = document.getElementById('searchInput');
            if (search) search.addEventListener('input', (e) => { searchQuery = e.target.value; if (currentTab === 'explore') renderApp(); });
            const catSelect = document.getElementById('categorySelect');
            if (catSelect) catSelect.addEventListener('change', (e) => { selectedCategory = e.target.value; if (currentTab === 'explore') renderApp(); });
            const clearBtn = document.getElementById('clearFiltersBtn');
            if (clearBtn) clearBtn.addEventListener('click', () => { searchQuery = ''; selectedCategory = 'all'; if (currentTab === 'explore') renderApp(); });
            document.querySelectorAll('.category-chip').forEach(chip => {
                chip.addEventListener('click', () => { selectedCategory = chip.dataset.category; if (currentTab === 'explore') renderApp(); });
            });
            
            const addCatBtn = document.getElementById('addCategoryBtn');
            if (addCatBtn) addCatBtn.addEventListener('click', () => {
                const input = document.getElementById('newCategoryName');
                const name = input.value.trim();
                if (name) {
                    const res = addCustomCategory(name);
                    if (res.success) { input.value = ''; showModal('success', { message: 'Added category "' + name + '"' }); if (currentTab === 'explore') renderApp(); }
                    else showModal('info', { title: 'Error', message: res.message });
                }
            });
            
            const addCampCat = document.getElementById('addCampCategoryBtn');
            if (addCampCat) addCampCat.addEventListener('click', () => {
                const input = document.getElementById('campNewCategory');
                const name = input.value.trim();
                if (name) {
                    const res = addCustomCategory(name);
                    if (res.success) {
                        input.value = '';
                        const allCats = getAllCategories().filter(c => c.id !== 'all');
                        const select = document.getElementById('campCategory');
                        if (select) { select.innerHTML = allCats.map(c => '<option value="' + c.id + '">' + c.icon + ' ' + c.name + '</option>').join(''); select.value = res.category.id; }
                        showModal('success', { message: 'Added category "' + name + '"' });
                    } else showModal('info', { title: 'Error', message: res.message });
                }
            });
            
            document.querySelectorAll('.donate-btn').forEach(btn => {
                if (!btn.disabled) {
                    btn.onclick = () => {
                        if (!currentUser) { showModal('info', { title: 'Login Required', message: 'Please login to donate' }); setTimeout(() => showModal('login'), 1500); return; }
                        showStripePaymentModal(btn.dataset.id, btn.dataset.title);
                    };
                }
            });
            document.querySelectorAll('.approve-btn').forEach(btn => {
                btn.onclick = () => showModal('confirm', { title: 'Approve Campaign?', message: 'Approve this campaign? The creator will not be able to submit new campaigns.', onConfirm: () => approveCampaign(btn.dataset.id) });
            });
            document.querySelectorAll('.reject-btn').forEach(btn => {
                btn.onclick = () => showModal('confirm', { title: 'Reject Campaign?', message: 'Reject this campaign? The creator may submit a new one.', onConfirm: () => rejectCampaign(btn.dataset.id) });
            });
        }
        
        function setupFileInputs() {
            const idInp = document.getElementById('idDocument');
            if (idInp) idInp.onchange = (e) => { if (e.target.files && e.target.files.length) { selectedIdFile = { name: e.target.files[0].name }; document.getElementById('idFileName').innerText = e.target.files[0].name; } };
            const bizInp = document.getElementById('businessDoc');
            if (bizInp) bizInp.onchange = (e) => { if (e.target.files && e.target.files.length) { selectedBusinessFile = { name: e.target.files[0].name }; document.getElementById('businessFileName').innerText = e.target.files[0].name; } };
            const prodInp = document.getElementById('productDoc');
            if (prodInp) prodInp.onchange = (e) => { if (e.target.files && e.target.files.length) { selectedProductFile = { name: e.target.files[0].name }; document.getElementById('productFileName').innerText = e.target.files[0].name; } };
            
            const vidLink = document.getElementById('videoLink');
            const vidPreview = document.getElementById('videoPreview');
            if (vidLink) {
                vidLink.addEventListener('input', (e) => {
                    const url = e.target.value.trim();
                    if (url) {
                        const previewHtml = getVideoPreviewHtml(url);
                        vidPreview.innerHTML = previewHtml;
                    } else {
                        vidPreview.innerHTML = '';
                    }
                });
            }
            
            const campaignForm = document.getElementById('campaignForm');
            if (campaignForm) {
                campaignForm.removeEventListener('submit', handleFormSubmit);
                campaignForm.addEventListener('submit', handleFormSubmit);
            }
        }
        
        function handleFormSubmit(e) {
            e.preventDefault();
            
            const title = document.getElementById('campTitle').value.trim();
            const desc = document.getElementById('campDesc').value.trim();
            const goal = parseInt(document.getElementById('campGoal').value);
            const category = document.getElementById('campCategory').value;
            const videoUrl = document.getElementById('videoLink').value.trim();
            
            if (!title) {
                showModal('info', { title: 'Missing Field', message: 'Please enter a campaign title.' });
                return;
            }
            if (isNaN(goal) || goal <= 0) {
                showModal('info', { title: 'Invalid Goal', message: 'Please enter a valid goal amount.' });
                return;
            }
            if (!selectedIdFile || !selectedBusinessFile) {
                showModal('info', { title: 'Missing Documents', message: 'Please upload both Government ID and Business Registration documents.' });
                return;
            }
            
            if (videoUrl) {
                const detection = detectVideoPlatform(videoUrl);
                if (!detection.isValid) {
                    showModal('info', { title: 'Unsupported Video Link', message: 'Please use a supported platform: YouTube, TikTok, Facebook, Instagram, Pinterest, or Vimeo.' });
                    return;
                }
            }
            
            const success = submitNewCampaign(title, desc, goal, category, videoUrl);
            if (success) {
                document.getElementById('campaignForm').reset();
                document.getElementById('idFileName').innerText = 'No file chosen';
                document.getElementById('businessFileName').innerText = 'No file chosen';
                document.getElementById('productFileName').innerText = 'No file chosen';
                const vidPreview = document.getElementById('videoPreview');
                if (vidPreview) vidPreview.innerHTML = '';
                selectedIdFile = null;
                selectedBusinessFile = null;
                selectedProductFile = null;
                
                showModal('success', { message: '✅ Campaign submitted! Admin will review your documents.' });
                renderApp();
            }
        }
        
        function renderApp() {
            const root = document.getElementById('app-root');
            if (!root) return;
            
            if (!stripe) {
                initStripe();
            }
            
            const ageShow = currentUser && currentUser.age ? ' (' + currentUser.age + 'y)' : '';
            const greeting = currentUser ? '🔥 ' + currentUser.email.split('@')[0] + ageShow + ' (' + (currentUser.role === 'admin' ? 'Admin' : 'Creator') + ')' : '👋 Welcome';
            const btnText = currentUser ? '🚪 Logout' : '🔐 Login / Register';
            let content = '';
            if (currentTab === 'creator') content = renderCreatorTab();
            else if (currentTab === 'admin') content = renderAdminTab();
            else content = renderExploreTab();
            
            const html = '<div class="header">' +
                '<div class="logo-container"><div class="logo-icon"><span>FM</span></div><div class="logo-text"><div class="logo-main">FundMe Social</div><div class="logo-tagline">Share & Support</div></div></div>' +
                '<div class="badge">⚡ Stripe | Share | Multi-Platform</div>' +
                '<div class="user-info"><span class="user-greeting">' + greeting + '</span><button class="login-btn" id="showLoginBtn">' + btnText + '</button></div></div>' +
                '<div class="tab-bar">' +
                '<button class="tab-btn ' + (currentTab === 'creator' ? 'active' : '') + '" data-tab="creator">✨ Create Campaign</button>' +
                '<button class="tab-btn ' + (currentTab === 'admin' ? 'active' : '') + '" data-tab="admin" id="adminTabBtn" style="' + (!currentUser || currentUser.role !== 'admin' ? 'display:none;' : '') + '">🛡️ Admin Review</button>' +
                '<button class="tab-btn ' + (currentTab === 'explore' ? 'active' : '') + '" data-tab="explore">🌍 Explore & Donate</button></div>' +
                content +
                renderFooter();
            root.innerHTML = html;
            
            const loginBtn = document.getElementById('showLoginBtn');
            if (loginBtn) loginBtn.onclick = () => {
                if (currentUser) {
                    showModal('confirm', { title: 'Logout?', message: 'Are you sure you want to logout?', onConfirm: () => { currentUser = null; saveSession(); renderApp(); showModal('success', { message: 'Logged out successfully!' }); } });
                } else showModal('login');
            };
            document.querySelectorAll('.tab-btn').forEach(btn => { btn.onclick = () => { currentTab = btn.getAttribute('data-tab'); renderApp(); }; });
            attachEvents();
            setupFileInputs();
            
            // Make footer functions globally accessible
            window.showFooterModal = showFooterModal;
            window.showSupportUsModal = showSupportUsModal;
            window.showPlatformDonationModal = showPlatformDonationModal;
            window.showShareModal = showShareModal;
            window.shareOnFacebook = shareOnFacebook;
            window.shareOnTwitter = shareOnTwitter;
            window.shareOnLinkedIn = shareOnLinkedIn;
            window.shareOnWhatsApp = shareOnWhatsApp;
            window.copyLinkToClipboard = copyLinkToClipboard;
        }
        
        initData();
        loadSession();
        renderApp();

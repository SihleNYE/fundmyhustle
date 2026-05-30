        // ============================================
        // PARTIAL COMPONENT SYSTEM
        // ============================================
        
        // Component Registry - defines all reusable UI components
        const Components = {
            // Header Component with Logo
            Header: {
                template: `
                    <div class="header">
                        <div class="logo-container">
                            <div class="logo-icon"><span>FM</span></div>
                            <div class="logo-text">
                                <div class="logo-main">FundMe Social</div>
                                <div style="font-size:0.7rem; color:rgba(255,255,255,0.6);">Empower Change Together</div>
                            </div>
                        </div>
                        <div style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); padding:6px 18px; border-radius:40px; font-size:0.75rem; font-weight:700;">⚡ One-Time Approval | Paystack</div>
                        <div class="user-info" style="display:flex; align-items:center; gap:16px; background:rgba(0,0,0,0.3); padding:6px 20px; border-radius:50px;">
                            <span class="user-greeting" id="greetingText" style="font-weight:600;">👋 Welcome</span>
                            <button class="login-btn" id="showLoginBtn" style="background:linear-gradient(135deg, #FF6B6B, #FF8E53); padding:8px 22px; border-radius:40px; border:none; color:white; font-weight:700; cursor:pointer;">🔐 Login / Register</button>
                        </div>
                    </div>
                `,
                events: {
                    loginClick: () => { if(window.currentUser) window.logout(); else window.showLoginModal(); }
                }
            },
            
            // Tab Bar Component
            TabBar: {
                template: `
                    <div class="tab-bar">
                        <button class="tab-btn active" data-tab="creator">✨ Create Campaign</button>
                        <button class="tab-btn" data-tab="admin" id="adminTabBtn">🛡️ Admin Review</button>
                        <button class="tab-btn" data-tab="explore">🌍 Explore & Donate</button>
                    </div>
                `,
                events: {
                    tabClick: (tabId) => window.switchTab(tabId)
                }
            },
            
            // Campaign Form Component
            CampaignForm: {
                template: `
                    <div class="card">
                        <h2 style="font-size:1.6rem; margin-bottom:24px; background:linear-gradient(135deg, #FFE66D, #FF6B6B, #4ECDC4); background-clip:text; -webkit-background-clip:text; color:transparent;">📢 Start Your Campaign</h2>
                        <div id="creatorRestrictionAlert"></div>
                        <form id="campaignForm">
                            <div style="margin-bottom:20px;">
                                <label style="font-weight:600; display:block; margin-bottom:8px; color:#FFE66D;">Campaign Title *</label>
                                <input type="text" id="campTitle" placeholder="e.g., Clean Water for All" style="width:100%; padding:14px 18px; border:2px solid rgba(255,255,255,0.15); border-radius:24px; background:rgba(0,0,0,0.3); color:white;">
                            </div>
                            <div style="margin-bottom:20px;">
                                <label style="font-weight:600; display:block; margin-bottom:8px; color:#FFE66D;">Short description</label>
                                <textarea id="campDesc" rows="2" placeholder="Tell your story..." style="width:100%; padding:14px 18px; border:2px solid rgba(255,255,255,0.15); border-radius:24px; background:rgba(0,0,0,0.3); color:white;"></textarea>
                            </div>
                            <div style="margin-bottom:20px;">
                                <label style="font-weight:600; display:block; margin-bottom:8px; color:#FFE66D;">Goal (USD) *</label>
                                <input type="number" id="campGoal" placeholder="5000" value="5000" style="width:100%; padding:14px 18px; border:2px solid rgba(255,255,255,0.15); border-radius:24px; background:rgba(0,0,0,0.3); color:white;">
                            </div>
                            <div style="margin-bottom:20px;">
                                <label style="font-weight:600; display:block; margin-bottom:8px; color:#FFE66D;">🎬 Demo video link (optional)</label>
                                <input type="url" id="videoLink" placeholder="https://www.youtube.com/watch?v=..." style="width:100%; padding:14px 18px; border:2px solid rgba(255,255,255,0.15); border-radius:24px; background:rgba(0,0,0,0.3); color:white;">
                                <div id="videoPreview" style="margin-top:8px;"></div>
                            </div>
                            <button type="submit" id="submitCampaignBtn" style="margin-top:20px;">🚀 Submit for Review</button>
                        </form>
                        <div id="creatorMessage" style="margin-top:16px;"></div>
                    </div>
                `
            },
            
            // User Campaigns Component
            UserCampaigns: {
                template: `
                    <div class="card">
                        <h2 style="font-size:1.6rem; margin-bottom:24px; background:linear-gradient(135deg, #FFE66D, #FF6B6B, #4ECDC4); background-clip:text; -webkit-background-clip:text; color:transparent;">📋 Your Campaign Status</h2>
                        <div id="userCampaignsList"><div class="info-note">No campaigns yet.</div></div>
                        <div class="info-note">⚠️ Once approved, you cannot submit another campaign.</div>
                    </div>
                `
            },
            
            // Admin Panel Component
            AdminPanel: {
                template: `
                    <div class="card">
                        <h2 style="font-size:1.6rem; margin-bottom:24px; background:linear-gradient(135deg, #FFE66D, #FF6B6B, #4ECDC4); background-clip:text; -webkit-background-clip:text; color:transparent;">⚡ Pending Review</h2>
                        <div id="pendingRequestsContainer"><div class="info-note">Loading...</div></div>
                        <hr style="margin:25px 0; border-color:rgba(255,255,255,0.1);">
                        <h2 style="font-size:1.6rem; margin-bottom:24px; background:linear-gradient(135deg, #FFE66D, #FF6B6B, #4ECDC4); background-clip:text; -webkit-background-clip:text; color:transparent;">✅ Processed Campaigns</h2>
                        <div id="processedRequestsContainer"><div class="info-note">No processed campaigns.</div></div>
                    </div>
                `
            },
            
            // Explore Feed Component
            ExploreFeed: {
                template: `
                    <div class="card">
                        <h2 style="font-size:1.6rem; margin-bottom:24px; background:linear-gradient(135deg, #FFE66D, #FF6B6B, #4ECDC4); background-clip:text; -webkit-background-clip:text; color:transparent;">🌍 Support Campaigns</h2>
                        <div id="approvedCampaignsList"><div class="info-note">No approved campaigns yet.</div></div>
                    </div>
                `
            }
        };
        
        // Page/View Components - compose partials
        const Views = {
            creator: () => `
                <div class="dashboard-grid">
                    ${Components.CampaignForm.template}
                    ${Components.UserCampaigns.template}
                </div>
            `,
            admin: () => Components.AdminPanel.template,
            explore: () => Components.ExploreFeed.template
        };
        
        // Main App Component - assembles all partials
        class App {
            constructor() {
                this.currentView = 'creator';
                this.rootElement = document.getElementById('app-root');
            }
            
            render() {
                // Assemble the complete page from partials
                const html = `
                    ${Components.Header.template}
                    ${Components.TabBar.template}
                    <div id="view-container">${Views[this.currentView]()}</div>
                `;
                this.rootElement.innerHTML = html;
                this.attachEvents();
            }
            
            attachEvents() {
                // Header events
                const loginBtn = document.getElementById('showLoginBtn');
                if(loginBtn) loginBtn.onclick = () => {
                    if(window.currentUser) window.logout();
                    else window.showLoginModal();
                };
                
                // Tab events
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.onclick = () => {
                        const tabId = btn.getAttribute('data-tab');
                        this.switchView(tabId);
                    };
                });
            }
            
            switchView(viewId) {
                this.currentView = viewId;
                const viewContainer = document.getElementById('view-container');
                if(viewContainer) {
                    viewContainer.innerHTML = Views[viewId]();
                }
                // Re-attach dynamic content events after view change
                if(window.onViewChange) window.onViewChange(viewId);
            }
        }
        
        // ============================================
        // BUSINESS LOGIC (same as before, but modular)
        // ============================================
        
        let currentUser = null;
        let campaigns = [];
        const USERS_KEY = "fundme_partials_users";
        const SESSION_KEY = "fundme_partials_session";
        const STORAGE_CAMPAIGNS = "fundme_partials_campaigns";
        const PAYSTACK_PUBLIC_KEY = "pk_test_d0e5b5f2e1a4b9c8d7e6f5a4b3c2d1e0f9a8b7c6";
        
        // Initialize and start app
        function initApp() {
            initUsers();
            loadSession();
            loadCampaigns();
            
            const app = new App();
            app.render();
            
            // Expose necessary functions globally
            window.currentUser = currentUser;
            window.switchTab = (tabId) => app.switchView(tabId);
            window.showLoginModal = showLoginModal;
            window.logout = logout;
            window.onViewChange = (view) => {
                if(view === 'admin') renderAdminPanel();
                if(view === 'creator') { renderUserCampaigns(); updateCreatorFormRestriction(); }
                if(view === 'explore') renderApprovedCampaignsFeed();
                attachDynamicEvents();
            };
            
            attachDynamicEvents();
        }
        
        function attachDynamicEvents() {
            // Campaign form submission
            const form = document.getElementById('campaignForm');
            if(form) {
                form.onsubmit = handleCampaignSubmit;
            }
            
            // Donation buttons
            document.querySelectorAll('.donate-btn').forEach(btn => {
                btn.onclick = () => donateToCampaign(btn.dataset.id, btn.dataset.title);
            });
            
            // Admin approval buttons
            document.querySelectorAll('.approve-btn').forEach(btn => {
                btn.onclick = () => approveCampaign(btn.dataset.id);
            });
            document.querySelectorAll('.reject-btn').forEach(btn => {
                btn.onclick = () => rejectCampaign(btn.dataset.id);
            });
        }
        
        // All the original functions (initUsers, loadSession, handleCampaignSubmit, etc.)
        // ... (keep all previous business logic functions here)
        
        // Simplified version of key functions for demo:
        function initUsers() {
            let users = localStorage.getItem(USERS_KEY);
            if(!users) {
                users = [{ email: "admin@fundme.com", password: "admin123", role: "admin", hasApprovedCampaign: false }];
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
        }
        
        function loadSession() {
            const session = localStorage.getItem(SESSION_KEY);
            if(session) currentUser = JSON.parse(session);
        }
        
        function loadCampaigns() {
            const stored = localStorage.getItem(STORAGE_CAMPAIGNS);
            campaigns = stored ? JSON.parse(stored) : [];
        }
        
        function showLoginModal() {
            alert("Login modal would appear here. Demo credentials: admin@fundme.com / admin123");
        }
        
        function logout() { currentUser = null; localStorage.removeItem(SESSION_KEY); location.reload(); }
        
        function handleCampaignSubmit(e) {
            e.preventDefault();
            alert("Campaign submitted! (Demo - full implementation would save data)");
        }
        
        function renderAdminPanel() { document.getElementById('pendingRequestsContainer').innerHTML = '<div class="info-note">Admin panel ready</div>'; }
        function renderUserCampaigns() { document.getElementById('userCampaignsList').innerHTML = '<div class="info-note">Your campaigns will appear here</div>'; }
        function renderApprovedCampaignsFeed() { document.getElementById('approvedCampaignsList').innerHTML = '<div class="info-note">Approved campaigns appear here</div>'; }
        function updateCreatorFormRestriction() {}
        function approveCampaign(id) { alert("Campaign approved!"); }
        function rejectCampaign(id) { alert("Campaign rejected!"); }
        function donateToCampaign(id, title) { alert(`Donate to ${title} with Paystack`); }
        
        // Start the app
        initApp();

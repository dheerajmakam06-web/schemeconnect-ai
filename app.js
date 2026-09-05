const schemes = [
  { id: 1, category: 'education', categoryLabel: 'Education', title: 'MahaDBT Education Scholarship', description: 'Financial support for children of low-income families studying in Maharashtra.', benefit: 'Up to ₹50,000 / year', documents: '4 documents', match: '96% match', keywords: 'education children scholarship maharashtra', tone: 'blue', latest: true },
  { id: 2, category: 'business', categoryLabel: 'Business', title: 'PM SVANidhi Working Capital', description: 'Collateral-free working capital loans to help street vendors grow their business.', benefit: 'Loans up to ₹50,000', documents: '3 documents', match: '92% match', keywords: 'business loan vendor working capital', tone: 'gold', latest: true },
  { id: 3, category: 'family', categoryLabel: 'Family support', title: 'Ladki Bahin Maharashtra', description: 'Monthly financial assistance for eligible women to support household needs.', benefit: '₹1,500 / month', documents: '5 documents', match: '89% match', keywords: 'family women monthly financial assistance', tone: '', latest: false },
  { id: 4, category: 'business', categoryLabel: 'Business', title: 'PMEGP Business Credit', description: 'Credit-linked subsidy to help entrepreneurs set up new micro-enterprises.', benefit: 'Up to ₹25 lakh', documents: '6 documents', match: '86% match', keywords: 'business entrepreneur enterprise subsidy', tone: 'gold', latest: false },
  { id: 5, category: 'education', categoryLabel: 'Education', title: 'National Means-cum-Merit', description: 'Scholarship support for bright students continuing secondary education.', benefit: '₹12,000 / year', documents: '3 documents', match: '78% match', keywords: 'education student scholarship school', tone: 'blue', latest: true },
  { id: 6, category: 'family', categoryLabel: 'Family support', title: 'Ayushman Bharat PM-JAY', description: 'Cashless health cover for eligible families at empanelled hospitals.', benefit: '₹5 lakh health cover', documents: '2 documents', match: '74% match', keywords: 'family health hospital medical cover', tone: '', latest: false }
];

const grid = document.querySelector('#schemeGrid');
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');
const searchInput = document.querySelector('#searchInput');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const appShell = document.querySelector('.app-shell');
const loginPage = document.querySelector('#loginPage');
const lockModal = document.querySelector('#lockModal');
const forgotModal = document.querySelector('#forgotModal');
let profileUnlocked = false;
let activeFilter = 'all';
let resetOtp = '';
const navItems = [...document.querySelectorAll('.nav-item')];
const statePortalOverrides = {
  'Andhra Pradesh': 'https://ap.gov.in/',
  Chhattisgarh: 'https://www.cgstate.gov.in/',
  Gujarat: 'https://gujaratindia.gov.in/',
  Maharashtra: 'https://www.maharashtra.gov.in/'
};
const accountStorageKey = 'schemeconnect.account.v1';
const stateSchemes = {
  ap: [
    { title: 'Post-Matric Fee Reimbursement (RTF / MTF)', description: 'Full fee reimbursement and maintenance support for eligible students.', href: 'https://jnanabhumi.ap.gov.in/', label: 'Student support', icon: '₹' },
    { title: 'Amma Vodi', description: 'Education assistance information for eligible mothers and school-going children.', href: 'https://jaganannaammavodi.ap.gov.in/', label: 'Education support', icon: '⌂' },
    { title: 'Ambedkar Overseas Vidya Nidhi', description: 'Overseas education scholarship information for eligible students.', href: 'https://jnanabhumi.ap.gov.in/', label: 'Higher education', icon: '↗' },
    { title: 'Residential Schools & Hostels', description: 'Official residential school and hostel services for students.', href: 'https://nivas.apcfss.in/', label: 'Hostels', icon: '▦' },
    { title: 'AP Citizen Services', description: 'Government service requests and welfare service access.', href: 'https://gramawardsachivalayam.ap.gov.in/', label: 'Citizen services', icon: '✓' },
    { title: 'YSR Rythu Bharosa', description: 'Official agriculture support information for eligible farmers.', href: 'https://ysrrythubharosa.ap.gov.in/', label: 'Agriculture', icon: '⌁' }
  ],
  ts: [
    { title: 'Telangana ePASS Scholarships', description: 'Post-matric and pre-matric scholarship and fee reimbursement services.', href: 'https://telanganaepass.cgg.gov.in/', label: 'Student support', icon: '₹' },
    { title: 'ePASS Schemes & Policies', description: 'Official list of scholarship schemes, policies, and eligibility information.', href: 'https://telanganaepass.cgg.gov.in/SchemesPolicies.do', label: 'Scheme directory', icon: '▦' },
    { title: 'Kalyana Lakshmi / Shaadi Mubarak', description: 'Official marriage assistance services for eligible applicants.', href: 'https://telanganaepass.cgg.gov.in/KalyanaLakshmiLinks.do', label: 'Family support', icon: '♡' },
    { title: 'Telangana MeeSeva', description: 'Online citizen services and government applications.', href: 'https://ts.meeseva.telangana.gov.in/meeseva/home.htm', label: 'Citizen services', icon: '✓' },
    { title: 'Overseas Scholarship Services', description: 'Official overseas education scholarship services and application links.', href: 'https://telanganaepass.cgg.gov.in/OverseasLinks.do', label: 'Higher education', icon: '↗' },
    { title: 'Telangana State Portal', description: 'Government initiatives, departments, services, and welfare updates.', href: 'https://www.telangana.gov.in/', label: 'State directory', icon: '⌂' }
  ]
};

const translations = {
  en: { workspace: 'Workspace', discover: 'Discover schemes', saved: 'Saved for later', applications: 'My applications', heroTitle: 'Find support that fits your life.', found: 'We found', schemesRelevant: 'schemes that may be relevant to your profile.', editProfile: 'Edit my profile' },
  hi: { workspace: 'कार्यस्थल', discover: 'योजनाएं खोजें', saved: 'बाद के लिए सुरक्षित', applications: 'मेरे आवेदन', heroTitle: 'अपने जीवन के लिए सही सहायता खोजें।', found: 'हमें मिले', schemesRelevant: 'योजनाएं आपके प्रोफ़ाइल के लिए उपयोगी हो सकती हैं।', editProfile: 'प्रोफ़ाइल संपादित करें' },
  mr: { workspace: 'कार्यस्थळ', discover: 'योजना शोधा', saved: 'नंतरसाठी जतन', applications: 'माझे अर्ज', heroTitle: 'तुमच्या जीवनाला योग्य मदत शोधा.', found: 'आम्हाला सापडल्या', schemesRelevant: 'योजना तुमच्या प्रोफाइलसाठी उपयुक्त असू शकतात.', editProfile: 'माझे प्रोफाइल संपादित करा' },
  ta: { workspace: 'பணியிடம்', discover: 'திட்டங்களைத் தேடுங்கள்', saved: 'பின்னர் பார்க்க சேமித்தவை', applications: 'என் விண்ணப்பங்கள்', heroTitle: 'உங்கள் வாழ்க்கைக்கு ஏற்ற உதவியை கண்டறியுங்கள்.', found: 'கிடைத்தவை', schemesRelevant: 'திட்டங்கள் உங்கள் சுயவிவரத்திற்கு பொருந்தலாம்.', editProfile: 'சுயவிவரத்தைத் திருத்து' }
};

function applyLanguage(language) {
  const copy = translations[language] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = copy[element.dataset.i18n]; });
  document.documentElement.lang = language;
  showToast(language === 'en' ? 'Language changed to English.' : 'Language preference updated.');
}

function setProfileName(name) {
  const cleanName = name.trim() || 'Aarav Mehta';
  document.querySelector('#profileName').textContent = cleanName;
  document.querySelector('#profileNameInput').value = cleanName;
  document.querySelector('#profileAvatar').textContent = cleanName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

async function hashCredentials(phone, password) {
  const input = new TextEncoder().encode(`${phone}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

document.querySelector('#registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.querySelector('#registerName').value.trim();
  const phone = document.querySelector('#registerPhone').value.trim();
  const password = document.querySelector('#registerPassword').value;
  const confirmation = document.querySelector('#registerConfirmPassword').value;
  if (password !== confirmation) { showToast('Passwords do not match.'); return; }
  if (localStorage.getItem(accountStorageKey)) { showToast('This device already has an account. Please log in.'); return; }
  const passwordHash = await hashCredentials(phone, password);
  localStorage.setItem(accountStorageKey, JSON.stringify({ phone, passwordHash, name }));
  document.querySelector('#registerForm').hidden = true;
  document.querySelector('#loginForm').hidden = false;
  document.querySelector('#loginName').value = name;
  document.querySelector('#loginPhone').value = phone;
  document.querySelector('#loginPassword').value = '';
  showToast('Registration complete. Log in with the same phone and password.');
});

document.querySelector('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const phone = document.querySelector('#loginPhone').value.trim();
  const password = document.querySelector('#loginPassword').value;
  const credentialHash = await hashCredentials(phone, password);
  const storedAccount = localStorage.getItem(accountStorageKey);
  if (!storedAccount) { showToast('Register first to create your account.'); return; }
  const account = JSON.parse(storedAccount);
  if (account.phone !== phone || account.passwordHash !== credentialHash) { showToast('Phone number or password is incorrect.'); return; }
  setProfileName(document.querySelector('#loginName').value);
  loginPage.hidden = true;
  appShell.hidden = false;
  showToast('Welcome back. Your matches are ready.');
});

document.querySelector('#forgotPassword').addEventListener('click', () => {
  forgotModal.hidden = false;
  document.querySelector('#forgotPhone').value = document.querySelector('#loginPhone').value;
  document.querySelector('#forgotPhone').focus();
});
forgotModal.querySelector('.modal-close').addEventListener('click', () => { forgotModal.hidden = true; });
forgotModal.addEventListener('click', (event) => { if (event.target === forgotModal) forgotModal.hidden = true; });
document.querySelector('#sendOtp').addEventListener('click', () => {
  const storedAccount = localStorage.getItem(accountStorageKey);
  const phone = document.querySelector('#forgotPhone').value.trim();
  if (!storedAccount || JSON.parse(storedAccount).phone !== phone) { showToast('That phone number is not registered on this device.'); return; }
  resetOtp = '123456';
  document.querySelector('#otpArea').hidden = false;
  document.querySelector('#otpHint').textContent = 'Demo OTP sent: 123456';
  document.querySelector('#otpInput').focus();
});
document.querySelector('#forgotForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const phone = document.querySelector('#forgotPhone').value.trim();
  const otp = document.querySelector('#otpInput').value.trim();
  const password = document.querySelector('#resetPassword').value;
  const confirmation = document.querySelector('#resetConfirmPassword').value;
  if (otp !== resetOtp) { showToast('The OTP is not correct.'); return; }
  if (password !== confirmation) { showToast('Passwords do not match.'); return; }
  const account = JSON.parse(localStorage.getItem(accountStorageKey));
  account.passwordHash = await hashCredentials(phone, password);
  localStorage.setItem(accountStorageKey, JSON.stringify(account));
  forgotModal.hidden = true;
  document.querySelector('#loginForm').hidden = false;
  document.querySelector('#registerForm').hidden = true;
  document.querySelector('#loginName').value = account.name || '';
  document.querySelector('#loginPhone').value = phone;
  document.querySelector('#loginPassword').value = '';
  document.querySelector('#otpArea').hidden = true;
  document.querySelector('#forgotForm').reset();
  showToast('Password reset successfully. Log in with your new password.');
});

if (localStorage.getItem(accountStorageKey)) {
  const savedAccount = JSON.parse(localStorage.getItem(accountStorageKey));
  document.querySelector('#registerForm').hidden = true;
  document.querySelector('#loginForm').hidden = false;
  document.querySelector('#loginName').value = savedAccount.name || '';
  document.querySelector('#loginPhone').value = savedAccount.phone || '';
}

document.querySelector('#languageSelect').addEventListener('change', (event) => applyLanguage(event.target.value));
const aiMessages = document.querySelector('#aiMessages');
function askAssistant(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  const userMessage = document.createElement('div');
  userMessage.className = 'ai-message user';
  userMessage.textContent = cleanQuestion;
  aiMessages.appendChild(userMessage);
  const normalizedQuestion = cleanQuestion.toLowerCase();
  let answer = 'I can help you search by state, compare eligibility, or prepare documents. Try asking about students, fee reimbursement, or family benefits.';
  if (normalizedQuestion.includes('document') || normalizedQuestion.includes('fee')) answer = 'For fee reimbursement, start with your student ID, income or caste certificate if applicable, Aadhaar, bank details, and college admission or fee records. Check the official student portal for the exact list.';
  if (normalizedQuestion.includes('student') || normalizedQuestion.includes('scholar')) answer = 'I found education support including fee reimbursement, scholarships, hostels, and overseas study support. Use the AP or Telangana shortcuts to open the official student portal.';
  if (normalizedQuestion.includes('family') || normalizedQuestion.includes('mother')) answer = 'Family support may include health cover, education assistance, women and child support, and state welfare schemes. Your profile details help narrow the list.';
  window.setTimeout(() => { const response = document.createElement('div'); response.className = 'ai-message assistant'; response.textContent = answer; aiMessages.appendChild(response); aiMessages.scrollTop = aiMessages.scrollHeight; }, 250);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
document.querySelector('#aiForm').addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#aiInput'); askAssistant(input.value); input.value = ''; });
document.querySelectorAll('[data-ai-question]').forEach((button) => button.addEventListener('click', () => askAssistant(button.dataset.aiQuestion)));
document.querySelector('#logoutButton').addEventListener('click', () => {
  appShell.hidden = true;
  loginPage.hidden = false;
  document.querySelector('#loginPassword').value = '';
  document.querySelector('#loginForm').hidden = false;
  document.querySelector('#registerForm').hidden = true;
  showToast('You have been logged out.');
});
document.querySelectorAll('[data-state-schemes]').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-state-schemes]').forEach((item) => item.classList.toggle('active', item === tab));
  renderStateSchemes(tab.dataset.stateSchemes);
}));
navItems.forEach((item) => item.addEventListener('click', () => {
  navItems.forEach((navItem) => navItem.classList.toggle('active', navItem === item));
}));

function renderSchemes() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = schemes.filter((scheme) => {
    const matchesFilter = activeFilter === 'all' || activeFilter === 'high' && Number.parseInt(scheme.match) >= 85 || activeFilter === 'latest' && scheme.latest || scheme.category === activeFilter;
    return matchesFilter && (!query || `${scheme.title} ${scheme.description} ${scheme.keywords}`.toLowerCase().includes(query));
  });
  resultCount.textContent = filtered.length;
  grid.innerHTML = filtered.map((scheme) => `
    <article class="scheme-card">
      <div class="card-top"><span class="category-label"><i class="category-dot ${scheme.tone}"></i>${scheme.categoryLabel}</span><span class="match-badge ${scheme.match.startsWith('7') ? 'medium' : ''}">${scheme.match}</span></div>
      <h3>${scheme.title}</h3><p class="description">${scheme.description}</p>
      <p class="benefit"><strong>${scheme.benefit}</strong><br>Estimated support</p>
      <div class="card-footer"><span class="documents">▧ ${scheme.documents}</span><div class="card-actions"><button class="save-button" type="button" data-save="${scheme.id}">♡ Save</button><button class="details-button" type="button" data-details="${scheme.id}">Official details ↗</button></div></div>
    </article>`).join('');
  emptyState.hidden = filtered.length !== 0;
}

function renderStateSchemes(state = 'ap') {
  document.querySelector('#stateSchemeGrid').innerHTML = stateSchemes[state].map((scheme) => `<a class="state-scheme-card" href="${scheme.href}" target="_blank" rel="noreferrer"><span class="state-scheme-icon">${scheme.icon}</span><span class="state-scheme-copy"><strong>${scheme.title}</strong><small>${scheme.description}</small><em>${scheme.label} ↗</em></span></a>`).join('');
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle('active', item === button));
  renderSchemes();
}));
searchInput.addEventListener('input', renderSchemes);
grid.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save]');
  const detailsButton = event.target.closest('[data-details]');
  if (saveButton) { saveButton.textContent = saveButton.textContent.includes('Save') ? '♥ Saved' : '♡ Save'; showToast(saveButton.textContent.includes('Saved') ? 'Scheme saved to your shortlist.' : 'Removed from your shortlist.'); }
  if (detailsButton) { window.open('https://www.myscheme.gov.in/', '_blank', 'noopener,noreferrer'); }
});

document.querySelector('.close-banner').addEventListener('click', (event) => event.currentTarget.closest('.insight-banner').remove());
document.querySelector('#guideButton').addEventListener('click', () => showToast('A local guide will be available shortly.'));
document.querySelector('#openStatePortal').addEventListener('click', () => {
  const select = document.querySelector('#stateSelect');
  const stateName = select.options[select.selectedIndex].textContent;
  const portal = statePortalOverrides[stateName] || select.value || 'https://www.india.gov.in/my-government/government-directory/states-uts';
  window.location.assign(portal);
});
document.querySelector('#refreshSources').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.innerHTML = '<span>↻</span> Checking official sources...';
  window.setTimeout(() => { button.disabled = false; button.innerHTML = '<span>↻</span> Refresh sources'; showToast('Official directories checked. Latest review: 05 Sep 2026.'); }, 900);
});
function requestProfileAccess() {
  if (profileUnlocked) { showModal(); return; }
  lockModal.hidden = false;
  document.querySelector('#profilePinInput').focus();
}
document.querySelector('#completeProfile').addEventListener('click', requestProfileAccess);
document.querySelector('#editProfile').addEventListener('click', requestProfileAccess);
document.querySelector('.profile-button').addEventListener('click', requestProfileAccess);
const modal = document.querySelector('#profileModal');
function showModal() { modal.hidden = false; modal.querySelector('select').focus(); }
function closeModal() { modal.hidden = true; }
modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
lockModal.querySelector('.modal-close').addEventListener('click', () => { lockModal.hidden = true; });
lockModal.addEventListener('click', (event) => { if (event.target === lockModal) lockModal.hidden = true; });
lockModal.querySelector('#unlockForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (document.querySelector('#profilePinInput').value !== '1234') { showToast('That PIN is not correct. Try again.'); return; }
  profileUnlocked = true;
  lockModal.hidden = true;
  document.querySelector('#profilePinInput').value = '';
  showModal();
});
modal.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#profileNameInput').value.trim() || 'Aarav Mehta';
  const income = document.querySelector('#profileIncomeInput').value;
  const family = document.querySelector('#familySizeInput').value;
  const occupation = document.querySelector('#occupationInput').value;
  const district = document.querySelector('#profileDistrictInput').value.trim() || 'Maharashtra';
  setProfileName(name);
  document.querySelector('#profileLocation').innerHTML = `<i>⌂</i> ${district}`;
  document.querySelector('#profileFamily').innerHTML = `<i>♙</i> ${family}`;
  document.querySelector('#profileIncome').innerHTML = `<i>₹</i> ${income} income`;
  document.querySelector('#profileOccupation').innerHTML = `<i>⌁</i> ${occupation}`;
  closeModal();
  showToast('Profile updated. Your recommendations are now more precise.');
});
document.querySelectorAll('.view-button').forEach((button) => button.addEventListener('click', (event) => { document.querySelectorAll('.view-button').forEach((item) => item.classList.remove('active')); event.currentTarget.classList.add('active'); showToast('View preference updated.'); }));
document.querySelector('#addApplication').addEventListener('click', () => showToast('Choose a scheme above to add it to your application tracker.'));
document.querySelectorAll('[data-application]').forEach((button) => button.addEventListener('click', () => showToast(`${button.dataset.application}: application steps are ready.`)));
renderSchemes();
renderStateSchemes();

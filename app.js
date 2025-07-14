// 物品借用管理系統 - 最終完整修復版本
class ItemBorrowingSystem {
  constructor() {
    this.currentUser = null;
    this.users = [
      { id: 'admin', username: 'admin', displayName: '系統管理員', password: 'admin123', role: 'admin' },
      { id: 'user001', username: 'user001', displayName: '一般用戶', password: 'user123', role: 'user' }
    ];
    this.items = [
      { id: 'item001', name: '筆記型電腦', description: 'Dell Inspiron 15', category: '電子設備', status: '可借用' },
      { id: 'item002', name: '數位相機', description: 'Canon EOS 80D', category: '攝影設備', status: '可借用' },
      { id: 'item003', name: '投影機', description: 'Epson EB-X41', category: '辦公用品', status: '可借用' }
    ];
    this.borrowRecords = [];
    this.returnRecords = [];
    this.currentTab = 'items';
    this.editingItem = null;
    this.editingAccount = null;
    this.nextId = 1000;
  }

  // 初始化系統
  init() {
    console.log('系統初始化中...');
    // 延遲綁定事件，確保DOM完全載入
    setTimeout(() => {
      this.bindEvents();
      this.showAuth();
      console.log('系統初始化完成');
    }, 100);
  }

  // 綁定所有事件
  bindEvents() {
    console.log('開始綁定事件...');
    
    // 使用更強健的事件綁定方式
    this.bindFormEvents();
    this.bindNavigationEvents();
    this.bindModalEvents();
    this.bindDynamicEvents();
    
    console.log('事件綁定完成');
  }

  // 綁定表單相關事件
  bindFormEvents() {
    // 登入表單
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('登入表單提交');
        this.handleLogin();
        return false;
      };
    }

    // 註冊表單
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('註冊表單提交');
        this.handleRegister();
        return false;
      };
    }

    // 物品表單
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
      itemForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('物品表單提交');
        this.handleItemSubmit();
        return false;
      };
    }

    // 借用表單
    const borrowForm = document.getElementById('borrowForm');
    if (borrowForm) {
      borrowForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('借用表單提交');
        this.handleBorrowSubmit();
        return false;
      };
    }

    // 歸還表單
    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
      returnForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('歸還表單提交');
        this.handleReturnSubmit();
        return false;
      };
    }

    // 帳戶表單
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
      accountForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('帳戶表單提交');
        this.handleAccountSubmit();
        return false;
      };
    }
  }

  // 綁定導航相關事件
  bindNavigationEvents() {
    // 切換到註冊頁面
    const toRegisterBtn = document.getElementById('toRegister');
    if (toRegisterBtn) {
      toRegisterBtn.onclick = (e) => {
        e.preventDefault();
        console.log('切換到註冊頁面');
        this.switchToRegister();
        return false;
      };
    }

    // 返回登入頁面
    const backToLoginBtn = document.getElementById('backToLogin');
    if (backToLoginBtn) {
      backToLoginBtn.onclick = (e) => {
        e.preventDefault();
        console.log('返回登入頁面');
        this.switchToLogin();
        return false;
      };
    }

    // 登出按鈕
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        console.log('登出');
        this.logout();
        return false;
      };
    }

    // 標籤切換
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        console.log('切換標籤:', tab);
        this.switchTab(tab);
        return false;
      };
    });

    // 主要操作按鈕
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
      addItemBtn.onclick = (e) => {
        e.preventDefault();
        console.log('新增物品');
        this.showItemModal();
        return false;
      };
    }

    const applyBorrowBtn = document.getElementById('applyBorrowBtn');
    if (applyBorrowBtn) {
      applyBorrowBtn.onclick = (e) => {
        e.preventDefault();
        console.log('申請借用');
        this.showBorrowModal();
        return false;
      };
    }

    const applyReturnBtn = document.getElementById('applyReturnBtn');
    if (applyReturnBtn) {
      applyReturnBtn.onclick = (e) => {
        e.preventDefault();
        console.log('申請歸還');
        this.showReturnModal();
        return false;
      };
    }

    const addAccountBtn = document.getElementById('addAccountBtn');
    if (addAccountBtn) {
      addAccountBtn.onclick = (e) => {
        e.preventDefault();
        console.log('新增帳戶');
        this.showAccountModal();
        return false;
      };
    }
  }

  // 綁定模態框相關事件
  bindModalEvents() {
    // 模態框關閉事件
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        if (modal) {
          console.log('關閉模態框:', modal.id);
          this.hideModal(modal.id);
        }
        return false;
      };
    });

    // 模態框背景點擊關閉
    document.querySelectorAll('.modal').forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) {
          console.log('背景點擊關閉模態框:', modal.id);
          this.hideModal(modal.id);
        }
      };
    });
  }

  // 綁定動態事件
  bindDynamicEvents() {
    // 使用事件委派處理動態生成的按鈕
    document.onclick = (e) => {
      this.handleDynamicClick(e);
    };
  }

  // 處理動態生成的按鈕點擊
  handleDynamicClick(e) {
    const target = e.target;
    let handled = false;

    // 物品編輯
    if (target.classList.contains('btn-edit-item')) {
      e.preventDefault();
      const itemId = target.dataset.id;
      console.log('編輯物品:', itemId);
      const item = this.items.find(i => i.id === itemId);
      if (item) {
        this.showItemModal(item);
      }
      handled = true;
    }

    // 物品刪除
    if (target.classList.contains('btn-delete-item')) {
      e.preventDefault();
      const itemId = target.dataset.id;
      console.log('刪除物品:', itemId);
      this.deleteItem(itemId);
      handled = true;
    }

    // 申請借用
    if (target.classList.contains('btn-borrow-item')) {
      e.preventDefault();
      const itemId = target.dataset.id;
      console.log('申請借用物品:', itemId);
      this.showBorrowModal(itemId);
      handled = true;
    }

    // 批准借用
    if (target.classList.contains('btn-approve-borrow')) {
      e.preventDefault();
      const borrowId = target.dataset.id;
      console.log('批准借用:', borrowId);
      this.approveBorrowing(borrowId);
      handled = true;
    }

    // 拒絕借用
    if (target.classList.contains('btn-reject-borrow')) {
      e.preventDefault();
      const borrowId = target.dataset.id;
      console.log('拒絕借用:', borrowId);
      this.rejectBorrowing(borrowId);
      handled = true;
    }

    // 確認歸還
    if (target.classList.contains('btn-confirm-return')) {
      e.preventDefault();
      const returnId = target.dataset.id;
      console.log('確認歸還:', returnId);
      this.confirmReturn(returnId);
      handled = true;
    }

    // 重設密碼
    if (target.classList.contains('btn-reset-password')) {
      e.preventDefault();
      const userId = target.dataset.id;
      console.log('重設密碼:', userId);
      this.resetPassword(userId);
      handled = true;
    }

    // 刪除帳戶
    if (target.classList.contains('btn-delete-account')) {
      e.preventDefault();
      const userId = target.dataset.id;
      console.log('刪除帳戶:', userId);
      this.deleteAccount(userId);
      handled = true;
    }

    if (handled) {
      return false;
    }
  }

  // 用戶登入
  handleLogin() {
    console.log('處理登入...');
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    
    console.log('登入資料:', { username, password });

    if (!username || !password) {
      this.showAlert('請輸入帳號和密碼', 'error');
      return;
    }

    const user = this.users.find(u => u.username === username && u.password === password);
    console.log('找到用戶:', user);

    if (user) {
      this.currentUser = user;
      console.log('登入成功，當前用戶:', this.currentUser);
      this.showDashboard();
      this.showAlert('登入成功！');
    } else {
      console.log('登入失敗：帳號或密碼錯誤');
      this.showAlert('帳號或密碼錯誤', 'error');
    }
  }

  // 用戶註冊
  handleRegister() {
    console.log('處理註冊...');
    const username = document.getElementById('registerUser').value.trim();
    const displayName = document.getElementById('displayName').value.trim();
    const password = document.getElementById('registerPass').value.trim();
    const confirmPassword = document.getElementById('confirmPass').value.trim();

    if (!username || !displayName || !password || !confirmPassword) {
      this.showAlert('請完整填寫所有欄位', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showAlert('兩次輸入的密碼不一致', 'error');
      return;
    }

    if (password.length < 6) {
      this.showAlert('密碼長度至少需要6個字符', 'error');
      return;
    }

    if (this.users.some(u => u.username === username)) {
      this.showAlert('用戶名已存在', 'error');
      return;
    }

    const newUser = {
      id: this.generateId(),
      username,
      displayName,
      password,
      role: 'user'
    };

    this.users.push(newUser);
    console.log('註冊成功，新用戶:', newUser);
    this.showAlert('註冊成功！請登入');
    this.switchToLogin();
  }

  // 登出
  logout() {
    console.log('用戶登出');
    this.currentUser = null;
    this.showAuth();
  }

  // 切換到登入頁面
  switchToLogin() {
    console.log('切換到登入頁面');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.classList.remove('hidden');
    if (registerForm) registerForm.classList.add('hidden');
    
    if (loginForm) loginForm.reset();
  }

  // 切換到註冊頁面
  switchToRegister() {
    console.log('切換到註冊頁面');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
    
    if (registerForm) registerForm.reset();
  }

  // 顯示認證頁面
  showAuth() {
    console.log('顯示認證頁面');
    const authLayer = document.getElementById('authLayer');
    const dashboardLayer = document.getElementById('dashboardLayer');
    
    if (authLayer) authLayer.classList.remove('hidden');
    if (dashboardLayer) dashboardLayer.classList.add('hidden');
    
    this.switchToLogin();
  }

  // 顯示儀表板
  showDashboard() {
    console.log('顯示儀表板');
    const authLayer = document.getElementById('authLayer');
    const dashboardLayer = document.getElementById('dashboardLayer');
    
    if (authLayer) authLayer.classList.add('hidden');
    if (dashboardLayer) dashboardLayer.classList.remove('hidden');

    // 更新歡迎文字
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText && this.currentUser) {
      welcomeText.textContent = `歡迎, ${this.currentUser.displayName}`;
    }

    // 設置用戶角色
    document.body.setAttribute('data-role', this.currentUser.role);
    console.log('設置用戶角色:', this.currentUser.role);

    // 重新綁定導航事件以確保正常工作
    this.bindNavigationEvents();

    // 初始化儀表板
    this.switchTab('items');
    this.updateNotificationBadges();
  }

  // 切換標籤
  switchTab(tabName) {
    console.log('切換標籤:', tabName);
    
    // 隱藏所有標籤頁
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    
    // 移除所有標籤按鈕的活動狀態
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // 顯示選定的標籤頁
    const targetTab = document.getElementById(`${tabName}Tab`);
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) {
      targetTab.classList.add('active');
      console.log('激活標籤頁:', `${tabName}Tab`);
    }
    if (targetBtn) {
      targetBtn.classList.add('active');
      console.log('激活標籤按鈕:', tabName);
    }

    this.currentTab = tabName;
    this.renderCurrentTab();
  }

  // 渲染當前標籤
  renderCurrentTab() {
    console.log('渲染當前標籤:', this.currentTab);
    switch (this.currentTab) {
      case 'items':
        this.renderItems();
        break;
      case 'borrowings':
        this.renderBorrowings();
        break;
      case 'returns':
        this.renderReturns();
        break;
      case 'accounts':
        this.renderAccounts();
        break;
    }
  }

  // 渲染物品列表
  renderItems() {
    console.log('渲染物品列表');
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;

    if (this.items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h3>尚無物品</h3><p>點擊右上角新增物品開始管理</p></div>';
      return;
    }

    grid.innerHTML = this.items.map(item => `
      <div class="item-card">
        <h3>${item.name}</h3>
        <p>${item.description || '無描述'}</p>
        <div class="item-meta">
          <span class="status status--${this.getStatusClass(item.status)}">${item.status}</span>
          <span class="item-category">${item.category}</span>
        </div>
        <div class="item-actions">
          ${this.currentUser && this.currentUser.role === 'admin' ? `
            <button class="btn btn--sm btn--secondary btn-edit-item" data-id="${item.id}">編輯</button>
            <button class="btn btn--sm btn--outline btn-delete-item" data-id="${item.id}">刪除</button>
          ` : ''}
          ${this.currentUser && this.currentUser.role === 'user' && item.status === '可借用' ? `
            <button class="btn btn--sm btn--primary btn-borrow-item" data-id="${item.id}">申請借用</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // 渲染借用記錄
  renderBorrowings() {
    console.log('渲染借用記錄');
    const tbody = document.getElementById('borrowingsTableBody');
    if (!tbody) return;

    let records = this.borrowRecords;
    if (this.currentUser && this.currentUser.role === 'user') {
      records = records.filter(r => r.userId === this.currentUser.id);
    }

    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">尚無借用記錄</td></tr>';
      return;
    }

    tbody.innerHTML = records.map(record => {
      const item = this.items.find(i => i.id === record.itemId);
      const user = this.users.find(u => u.id === record.userId);

      return `
        <tr>
          <td>${item ? item.name : '未知物品'}</td>
          <td>${user ? user.displayName : '未知用戶'}</td>
          <td>${this.formatDate(record.requestDate)}</td>
          <td>${this.formatDate(record.returnDate)}</td>
          <td><span class="status status--${this.getStatusClass(record.status)}">${this.getStatusText(record.status)}</span></td>
          <td class="admin-only">
            <div class="table-actions">
              ${this.currentUser && this.currentUser.role === 'admin' && record.status === 'pending' ? `
                <button class="btn btn--sm btn--primary btn-approve-borrow" data-id="${record.id}">批准</button>
                <button class="btn btn--sm btn--outline btn-reject-borrow" data-id="${record.id}">拒絕</button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 渲染歸還記錄
  renderReturns() {
    console.log('渲染歸還記錄');
    const tbody = document.getElementById('returnsTableBody');
    if (!tbody) return;

    let records = this.returnRecords;
    if (this.currentUser && this.currentUser.role === 'user') {
      records = records.filter(r => r.userId === this.currentUser.id);
    }

    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">尚無歸還記錄</td></tr>';
      return;
    }

    tbody.innerHTML = records.map(record => {
      const item = this.items.find(i => i.id === record.itemId);
      const user = this.users.find(u => u.id === record.userId);

      return `
        <tr>
          <td>${item ? item.name : '未知物品'}</td>
          <td>${user ? user.displayName : '未知用戶'}</td>
          <td>${this.formatDate(record.returnDate)}</td>
          <td><span class="status status--${this.getStatusClass(record.status)}">${this.getStatusText(record.status)}</span></td>
          <td class="admin-only">
            <div class="table-actions">
              ${this.currentUser && this.currentUser.role === 'admin' && record.status === 'pending' ? `
                <button class="btn btn--sm btn--primary btn-confirm-return" data-id="${record.id}">確認歸還</button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 渲染帳戶列表
  renderAccounts() {
    console.log('渲染帳戶列表');
    const tbody = document.getElementById('accountsTableBody');
    if (!tbody) return;

    if (this.users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">尚無帳戶</td></tr>';
      return;
    }

    tbody.innerHTML = this.users.map(user => `
      <tr>
        <td>${user.username}</td>
        <td>${user.displayName}</td>
        <td>${user.role === 'admin' ? '管理員' : '一般用戶'}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn--sm btn--secondary btn-reset-password" data-id="${user.id}">重設密碼</button>
            ${user.username !== 'admin' ? `
              <button class="btn btn--sm btn--outline btn-delete-account" data-id="${user.id}">刪除</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 更新通知徽章
  updateNotificationBadges() {
    const pendingBorrows = this.borrowRecords.filter(r => r.status === 'pending').length;
    const pendingReturns = this.returnRecords.filter(r => r.status === 'pending').length;

    const borrowBadge = document.getElementById('borrowingBadge');
    const returnBadge = document.getElementById('returnBadge');

    if (borrowBadge) {
      if (pendingBorrows > 0) {
        borrowBadge.textContent = pendingBorrows;
        borrowBadge.classList.remove('hidden');
      } else {
        borrowBadge.classList.add('hidden');
      }
    }

    if (returnBadge) {
      if (pendingReturns > 0) {
        returnBadge.textContent = pendingReturns;
        returnBadge.classList.remove('hidden');
      } else {
        returnBadge.classList.add('hidden');
      }
    }
  }

  // 顯示物品模態框
  showItemModal(item = null) {
    console.log('顯示物品模態框', item);
    this.editingItem = item;
    const modal = document.getElementById('itemModal');
    const title = document.getElementById('itemModalTitle');

    if (item) {
      title.textContent = '編輯物品';
      document.getElementById('itemName').value = item.name;
      document.getElementById('itemDescription').value = item.description || '';
      document.getElementById('itemCategory').value = item.category;
      document.getElementById('itemStatus').value = item.status;
    } else {
      title.textContent = '新增物品';
      document.getElementById('itemForm').reset();
    }

    modal.classList.remove('hidden');
  }

  // 處理物品表單提交
  handleItemSubmit() {
    console.log('處理物品表單提交');
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const category = document.getElementById('itemCategory').value;
    const status = document.getElementById('itemStatus').value;

    if (!name || !category || !status) {
      this.showAlert('請填寫所有必填欄位', 'error');
      return;
    }

    if (this.editingItem) {
      const item = this.items.find(i => i.id === this.editingItem.id);
      if (item) {
        item.name = name;
        item.description = description;
        item.category = category;
        item.status = status;
        this.showAlert('物品更新成功！');
      }
    } else {
      const newItem = {
        id: this.generateId(),
        name,
        description,
        category,
        status
      };
      this.items.push(newItem);
      this.showAlert('物品新增成功！');
    }

    this.hideModal('itemModal');
    this.renderItems();
  }

  // 刪除物品
  async deleteItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const confirmed = await this.showConfirm(`確定要刪除物品「${item.name}」嗎？`);
    if (confirmed) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.showAlert('物品刪除成功！');
      this.renderItems();
    }
  }

  // 顯示借用模態框
  showBorrowModal(itemId = null) {
    console.log('顯示借用模態框', itemId);
    const modal = document.getElementById('borrowModal');
    const select = document.getElementById('borrowItemSelect');

    const availableItems = this.items.filter(i => i.status === '可借用');

    if (availableItems.length === 0) {
      this.showAlert('目前沒有可借用的物品', 'info');
      return;
    }

    select.innerHTML = '<option value="">請選擇物品</option>' +
      availableItems.map(item => `
        <option value="${item.id}" ${item.id === itemId ? 'selected' : ''}>${item.name}</option>
      `).join('');

    // 設置預設歸還日期（7天後）
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);
    document.getElementById('borrowReturnDate').value = returnDate.toISOString().split('T')[0];

    modal.classList.remove('hidden');
  }

  // 處理借用表單提交
  handleBorrowSubmit() {
    console.log('處理借用表單提交');
    const itemId = document.getElementById('borrowItemSelect').value;
    const returnDate = document.getElementById('borrowReturnDate').value;

    if (!itemId || !returnDate) {
      this.showAlert('請完整填寫表單', 'error');
      return;
    }

    const newBorrow = {
      id: this.generateId(),
      itemId,
      userId: this.currentUser.id,
      requestDate: new Date().toISOString().split('T')[0],
      returnDate,
      status: 'pending'
    };

    this.borrowRecords.push(newBorrow);
    this.hideModal('borrowModal');
    this.showAlert('借用申請提交成功！');
    this.updateNotificationBadges();
    this.renderBorrowings();
  }

  // 批准借用
  approveBorrowing(borrowId) {
    console.log('批准借用', borrowId);
    const record = this.borrowRecords.find(r => r.id === borrowId);
    if (!record) return;

    record.status = 'approved';
    record.approvedDate = new Date().toISOString().split('T')[0];

    const item = this.items.find(i => i.id === record.itemId);
    if (item) {
      item.status = '已借出';
    }

    this.showAlert('借用申請已批准！');
    this.updateNotificationBadges();
    this.renderBorrowings();
    if (this.currentTab === 'items') {
      this.renderItems();
    }
  }

  // 拒絕借用
  rejectBorrowing(borrowId) {
    console.log('拒絕借用', borrowId);
    const record = this.borrowRecords.find(r => r.id === borrowId);
    if (!record) return;

    record.status = 'rejected';
    record.rejectedDate = new Date().toISOString().split('T')[0];

    this.showAlert('借用申請已拒絕！');
    this.updateNotificationBadges();
    this.renderBorrowings();
  }

  // 顯示歸還模態框
  showReturnModal() {
    console.log('顯示歸還模態框');
    const modal = document.getElementById('returnModal');
    const select = document.getElementById('returnItemSelect');

    const userBorrows = this.borrowRecords.filter(r =>
      r.userId === this.currentUser.id && r.status === 'approved'
    );

    const availableItems = userBorrows.filter(borrow => {
      return !this.returnRecords.some(ret =>
        ret.itemId === borrow.itemId && ret.userId === this.currentUser.id && ret.status === 'pending'
      );
    });

    if (availableItems.length === 0) {
      this.showAlert('目前沒有可歸還的物品', 'info');
      return;
    }

    select.innerHTML = '<option value="">請選擇物品</option>' +
      availableItems.map(borrow => {
        const item = this.items.find(i => i.id === borrow.itemId);
        return `<option value="${item.id}">${item.name}</option>`;
      }).join('');

    modal.classList.remove('hidden');
  }

  // 處理歸還表單提交
  handleReturnSubmit() {
    console.log('處理歸還表單提交');
    const itemId = document.getElementById('returnItemSelect').value;

    if (!itemId) {
      this.showAlert('請選擇要歸還的物品', 'error');
      return;
    }

    const newReturn = {
      id: this.generateId(),
      itemId,
      userId: this.currentUser.id,
      returnDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    this.returnRecords.push(newReturn);
    this.hideModal('returnModal');
    this.showAlert('歸還申請提交成功！');
    this.updateNotificationBadges();
    this.renderReturns();
  }

  // 確認歸還
  confirmReturn(returnId) {
    console.log('確認歸還', returnId);
    const record = this.returnRecords.find(r => r.id === returnId);
    if (!record) return;

    record.status = 'confirmed';
    record.confirmedDate = new Date().toISOString().split('T')[0];

    const item = this.items.find(i => i.id === record.itemId);
    if (item) {
      item.status = '可借用';
    }

    this.showAlert('歸還已確認！');
    this.updateNotificationBadges();
    this.renderReturns();
    if (this.currentTab === 'items') {
      this.renderItems();
    }
  }

  // 顯示帳戶模態框
  showAccountModal(account = null) {
    console.log('顯示帳戶模態框', account);
    this.editingAccount = account;
    const modal = document.getElementById('accountModal');
    const title = document.getElementById('accountModalTitle');

    if (account) {
      title.textContent = '編輯帳戶';
      document.getElementById('accountUserId').value = account.username;
      document.getElementById('accountUserId').disabled = true;
      document.getElementById('accountDisplayName').value = account.displayName;
      document.getElementById('accountPassword').value = account.password;
      document.getElementById('accountRole').value = account.role;
    } else {
      title.textContent = '新增帳戶';
      document.getElementById('accountForm').reset();
      document.getElementById('accountUserId').disabled = false;
    }

    modal.classList.remove('hidden');
  }

  // 處理帳戶表單提交
  handleAccountSubmit() {
    console.log('處理帳戶表單提交');
    const username = document.getElementById('accountUserId').value.trim();
    const displayName = document.getElementById('accountDisplayName').value.trim();
    const password = document.getElementById('accountPassword').value.trim();
    const role = document.getElementById('accountRole').value;

    if (!username || !displayName || !password || !role) {
      this.showAlert('請填寫所有欄位', 'error');
      return;
    }

    if (password.length < 6) {
      this.showAlert('密碼長度至少需要6個字符', 'error');
      return;
    }

    if (this.editingAccount) {
      const account = this.users.find(u => u.id === this.editingAccount.id);
      if (account) {
        account.displayName = displayName;
        account.password = password;
        account.role = role;
        this.showAlert('帳戶更新成功！');
      }
    } else {
      if (this.users.some(u => u.username === username)) {
        this.showAlert('用戶名已存在', 'error');
        return;
      }

      const newAccount = {
        id: this.generateId(),
        username,
        displayName,
        password,
        role
      };

      this.users.push(newAccount);
      this.showAlert('帳戶新增成功！');
    }

    this.hideModal('accountModal');
    this.renderAccounts();
  }

  // 重設密碼
  async resetPassword(userId) {
    console.log('重設密碼', userId);
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const { value: newPassword } = await Swal.fire({
      title: '重設密碼',
      input: 'password',
      inputLabel: '請輸入新密碼（至少6個字符）',
      inputPlaceholder: '新密碼',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      inputValidator: (value) => {
        if (!value || value.length < 6) {
          return '密碼長度至少需要6個字符';
        }
      }
    });

    if (newPassword) {
      user.password = newPassword;
      this.showAlert('密碼重設成功！');
    }
  }

  // 刪除帳戶
  async deleteAccount(userId) {
    console.log('刪除帳戶', userId);
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const confirmed = await this.showConfirm(`確定要刪除帳戶「${user.displayName}」嗎？`);
    if (confirmed) {
      this.users = this.users.filter(u => u.id !== userId);
      this.showAlert('帳戶刪除成功！');
      this.renderAccounts();
    }
  }

  // 工具方法
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW');
    } catch (e) {
      return dateString;
    }
  }

  getStatusClass(status) {
    const statusMap = {
      '可借用': 'success',
      '已借出': 'warning',
      '維護中': 'error',
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'error',
      'confirmed': 'success'
    };
    return statusMap[status] || 'info';
  }

  getStatusText(status) {
    const statusMap = {
      'pending': '待審核',
      'approved': '已批准',
      'rejected': '已拒絕',
      'confirmed': '已確認'
    };
    return statusMap[status] || status;
  }

  hideModal(modalId) {
    console.log('隱藏模態框:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showAlert(message, type = 'success') {
    console.log('顯示警告:', message, type);
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: type === 'success' ? '成功' : type === 'error' ? '錯誤' : '提示',
        text: message,
        icon: type,
        confirmButtonText: '確定'
      });
    } else {
      alert(message);
    }
  }

  async showConfirm(message) {
    console.log('顯示確認對話框:', message);
    if (typeof Swal !== 'undefined') {
      const result = await Swal.fire({
        title: '確認',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      });
      return result.isConfirmed;
    } else {
      return confirm(message);
    }
  }
}

// 系統初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM載入完成，初始化系統');
  window.system = new ItemBorrowingSystem();
  window.system.init();
});

        // Data Storage
        let books = JSON.parse(localStorage.getItem('libraryBooks')) || [];
        let members = JSON.parse(localStorage.getItem('libraryMembers')) || [];
        let transactions = JSON.parse(localStorage.getItem('libraryTransactions')) || [];
        let currentBookId = null;

        // Initialize with sample data if empty
        if (books.length === 0) {
            books = [
                {
                    id: 1,
                    title: "The Great Gatsby",
                    author: "F. Scott Fitzgerald",
                    isbn: "978-0-7432-7356-5",
                    category: "Fiction",
                    year: 1925,
                    publisher: "Scribner",
                    totalCopies: 3,
                    availableCopies: 2,
                    cover: "🎭",
                    addedDate: "2024-01-15"
                },
                {
                    id: 2,
                    title: "To Kill a Mockingbird",
                    author: "Harper Lee",
                    isbn: "978-0-06-112008-4",
                    category: "Fiction",
                    year: 1960,
                    publisher: "J.B. Lippincott & Co.",
                    totalCopies: 2,
                    availableCopies: 1,
                    cover: "🕊️",
                    addedDate: "2024-01-10"
                },
                {
                    id: 3,
                    title: "1984",
                    author: "George Orwell",
                    isbn: "978-0-452-28423-4",
                    category: "Dystopian",
                    year: 1949,
                    publisher: "Secker & Warburg",
                    totalCopies: 4,
                    availableCopies: 3,
                    cover: "👁️",
                    addedDate: "2024-01-12"
                },
                {
                    id: 4,
                    title: "Pride and Prejudice",
                    author: "Jane Austen",
                    isbn: "978-0-14-143951-8",
                    category: "Romance",
                    year: 1813,
                    publisher: "T. Egerton",
                    totalCopies: 2,
                    availableCopies: 2,
                    cover: "💕",
                    addedDate: "2024-01-08"
                },
                {
                    id: 5,
                    title: "Harry Potter and the Sorcerer's Stone",
                    author: "J.K. Rowling",
                    isbn: "978-0-439-70818-8",
                    category: "Fantasy",
                    year: 1997,
                    publisher: "Bloomsbury",
                    totalCopies: 5,
                    availableCopies: 3,
                    cover: "⚡",
                    addedDate: "2024-01-20"
                }
            ];
            saveData();
        }

        if (members.length === 0) {
            members = [
                {
                    id: 1,
                    name: "John Smith",
                    email: "john.smith@email.com",
                    phone: "+1-555-0123",
                    address: "123 Main St, City, State",
                    type: "student",
                    joinDate: "2024-01-15",
                    borrowedBooks: [],
                    status: "active"
                },
                {
                    id: 2,
                    name: "Emily Johnson",
                    email: "emily.johnson@email.com",
                    phone: "+1-555-0124",
                    address: "456 Oak Ave, City, State",
                    type: "faculty",
                    joinDate: "2024-01-10",
                    borrowedBooks: [],
                    status: "active"
                },
                {
                    id: 3,
                    name: "Michael Brown",
                    email: "michael.brown@email.com",
                    phone: "+1-555-0125",
                    address: "789 Pine St, City, State",
                    type: "student",
                    joinDate: "2024-01-12",
                    borrowedBooks: [],
                    status: "active"
                }
            ];
            saveData();
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            updateCurrentDate();
            updateDashboard();
            renderBooks();
            renderMembers();
            renderTransactions();
            updateReports();
            setupEventListeners();
            
            // Set default due date to 14 days from now
            const defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 14);
            document.getElementById('borrowDueDate').value = defaultDueDate.toISOString().split('T')[0];
        });

        function setupEventListeners() {
            // Search functionality
            document.getElementById('bookSearch').addEventListener('input', renderBooks);
            document.getElementById('memberSearch').addEventListener('input', renderMembers);
            document.getElementById('categoryFilter').addEventListener('change', renderBooks);
            document.getElementById('statusFilter').addEventListener('change', renderBooks);

            // Form submissions
            document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
            document.getElementById('addMemberForm').addEventListener('submit', handleAddMember);
            document.getElementById('borrowBookForm').addEventListener('submit', handleBorrowBook);

            // Close modals when clicking outside
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeModal(modal.id);
                    }
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal.show').forEach(modal => {
                        closeModal(modal.id);
                    });
                }
            });
        }

        function saveData() {
            localStorage.setItem('libraryBooks', JSON.stringify(books));
            localStorage.setItem('libraryMembers', JSON.stringify(members));
            localStorage.setItem('libraryTransactions', JSON.stringify(transactions));
        }

        function updateCurrentDate() {
            const now = new Date();
            document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.remove('hidden');
            
            // Add active class to clicked nav tab
            event.target.classList.add('active');
            
            // Update content based on tab
            if (tabName === 'dashboard') updateDashboard();
            if (tabName === 'books') renderBooks();
            if (tabName === 'members') renderMembers();
            if (tabName === 'transactions') renderTransactions();
            if (tabName === 'reports') updateReports();
        }

        function updateDashboard() {
            const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
            const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
            const borrowedBooks = totalBooks - availableBooks;
            const overdueBooks = getOverdueBooks().length;

            // Animate numbers
            animateNumber('totalBooksCount', totalBooks);
            animateNumber('availableBooksCount', availableBooks);
            animateNumber('borrowedBooksCount', borrowedBooks);
            animateNumber('totalMembersCount', members.length);
            animateNumber('overdueBooksCount', overdueBooks);

            // Recent books
            const recentBooks = books
                .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
                .slice(0, 5);
            
            document.getElementById('recentBooks').innerHTML = recentBooks.map(book => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; transition: all 0.3s ease;" 
                     onmouseover="this.style.background='#f9fafb'; this.style.transform='translateX(10px)'" 
                     onmouseout="this.style.background=''; this.style.transform=''">
                    <span style="font-size: 2rem;">${book.cover}</span>
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">${book.title}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">by ${book.author}</div>
                    </div>
                </div>
            `).join('');

            // Recent transactions
            const recentTransactions = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            document.getElementById('recentTransactions').innerHTML = recentTransactions.map(transaction => {
                const book = books.find(b => b.id === transaction.bookId);
                const member = members.find(m => m.id === transaction.memberId);
                return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; transition: all 0.3s ease;"
                         onmouseover="this.style.background='#f9fafb'; this.style.transform='translateX(10px)'" 
                         onmouseout="this.style.background=''; this.style.transform=''">
                        <div>
                            <div style="font-weight: 600; color: #1f2937;">${book ? book.title : 'Unknown Book'}</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">${member ? member.name : 'Unknown Member'}</div>
                        </div>
                        <span class="status-badge ${transaction.type === 'borrow' ? 'status-borrowed' : 'status-available'}">
                            ${transaction.type}
                        </span>
                    </div>
                `;
            }).join('');
        }

        function animateNumber(elementId, targetNumber) {
            const element = document.getElementById(elementId);
            const startNumber = parseInt(element.textContent) || 0;
            const duration = 1000;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * progress);
                element.textContent = currentNumber;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }

            requestAnimationFrame(updateNumber);
        }

        function renderBooks() {
            const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;

            let filteredBooks = books.filter(book => {
                const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                                    book.author.toLowerCase().includes(searchTerm) ||
                                    book.isbn.includes(searchTerm);
                
                const matchesCategory = !categoryFilter || book.category === categoryFilter;
                
                const matchesStatus = !statusFilter || 
                                    (statusFilter === 'available' && book.availableCopies > 0) ||
                                    (statusFilter === 'borrowed' && book.availableCopies < book.totalCopies);
                
                return matchesSearch && matchesCategory && matchesStatus;
            });

            // Update category filter options
            const categories = [...new Set(books.map(book => book.category))];
            const categorySelect = document.getElementById('categoryFilter');
            const currentCategory = categorySelect.value;
            categorySelect.innerHTML = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat}" ${cat === currentCategory ? 'selected' : ''}>${cat}</option>`).join('');

            document.getElementById('booksContainer').innerHTML = filteredBooks.map((book, index) => `
                <div class="book-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="book-cover">${book.cover}</div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <p class="book-meta">${book.category} • ${book.year}</p>
                    <p class="book-meta">ISBN: ${book.isbn}</p>
                    
                    <div class="book-availability">
                        <span style="font-size: 0.875rem;">
                            <strong>${book.availableCopies}</strong> of <strong>${book.totalCopies}</strong> available
                        </span>
                        <span class="status-badge ${book.availableCopies > 0 ? 'status-available' : 'status-borrowed'}">
                            ${book.availableCopies > 0 ? 'Available' : 'All Borrowed'}
                        </span>
                    </div>
                    
                    <div class="book-actions">
                        <button class="btn btn-primary ${book.availableCopies === 0 ? 'opacity-50 cursor-not-allowed' : ''}" 
                                onclick="showBorrowModal(${book.id})" 
                                ${book.availableCopies === 0 ? 'disabled' : ''}
                                style="${book.availableCopies === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            📚 Borrow
                        </button>
                        <button class="btn btn-secondary" onclick="editBook(${book.id})">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger" onclick="deleteBook(${book.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function renderMembers() {
            const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
            
            const filteredMembers = members.filter(member => 
                member.name.toLowerCase().includes(searchTerm) ||
                member.email.toLowerCase().includes(searchTerm) ||
                member.id.toString().includes(searchTerm)
            );

            document.getElementById('membersTableBody').innerHTML = filteredMembers.map(member => `
                <tr>
                    <td><strong>M${member.id.toString().padStart(3, '0')}</strong></td>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.phone}</td>
                    <td>${member.borrowedBooks.length}</td>
                    <td>
                        <span class="status-badge status-active">${member.status}</span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-secondary btn-sm" onclick="viewMemberDetails(${member.id})">
                                👁️ View
                            </button>
                            <button class="btn btn-warning btn-sm" onclick="editMember(${member.id})">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteMember(${member.id})">
                                🗑️ Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function renderTransactions() {
            const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            document.getElementById('transactionsTableBody').innerHTML = sortedTransactions.map(transaction => {
                const book = books.find(b => b.id === transaction.bookId);
                const member = members.find(m => m.id === transaction.memberId);
                const isOverdue = transaction.type === 'borrow' && transaction.dueDate && new Date(transaction.dueDate) < new Date();
                
                return `
                    <tr>
                        <td>${new Date(transaction.date).toLocaleDateString()}</td>
                        <td>
                            <span class="status-badge ${transaction.type === 'borrow' ? 'status-borrowed' : 'status-available'}">
                                ${transaction.type}
                            </span>
                        </td>
                        <td>${book ? book.title : 'Unknown Book'}</td>
                        <td>${member ? member.name : 'Unknown Member'}</td>
                        <td>${transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : '-'}</td>
                        <td>
                            ${transaction.type === 'borrow' && !transaction.returned ? 
                                (isOverdue ? '<span class="status-badge status-overdue">Overdue</span>' : '<span class="status-badge status-borrowed">Active</span>') :
                                '<span class="status-badge status-available">Completed</span>'
                            }
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function updateReports() {
            // Library Statistics
            const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
            const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
            const borrowedBooks = totalBooks - availableBooks;
            const categories = [...new Set(books.map(book => book.category))];
            
            document.getElementById('libraryStats').innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Total Books:</span>
                        <strong>${totalBooks}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Available Books:</span>
                        <strong style="color: var(--success-color);">${availableBooks}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Borrowed Books:</span>
                        <strong style="color: var(--warning-color);">${borrowedBooks}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Total Members:</span>
                        <strong>${members.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Categories:</span>
                        <strong>${categories.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                        <span>Total Transactions:</span>
                        <strong>${transactions.length}</strong>
                    </div>
                </div>
            `;

            // Popular Books (most borrowed)
            const bookBorrowCounts = {};
            transactions.forEach(transaction => {
                if (transaction.type === 'borrow') {
                    bookBorrowCounts[transaction.bookId] = (bookBorrowCounts[transaction.bookId] || 0) + 1;
                }
            });

            const popularBooks = Object.entries(bookBorrowCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([bookId, count]) => {
                    const book = books.find(b => b.id === parseInt(bookId));
                    return { book, count };
                });

            document.getElementById('popularBooks').innerHTML = popularBooks.map(({ book, count }) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; transition: all 0.3s ease;"
                     onmouseover="this.style.background='#f9fafb'; this.style.transform='translateX(10px)'" 
                     onmouseout="this.style.background=''; this.style.transform=''">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-size: 1.5rem;">${book ? book.cover : '📚'}</span>
                        <div>
                            <div style="font-weight: 600; color: #1f2937;">${book ? book.title : 'Unknown Book'}</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">${book ? book.author : 'Unknown Author'}</div>
                        </div>
                    </div>
                    <span style="font-weight: 700; color: var(--primary-color);">${count} borrows</span>
                </div>
            `).join('') || '<p style="color: #6b7280; text-align: center; padding: 2rem;">No borrowing data available</p>';

            // Overdue Books
            const overdueBooks = getOverdueBooks();
            document.getElementById('overdueBooks').innerHTML = overdueBooks.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: #fef2f2; border-radius: 0.5rem; margin-bottom: 0.75rem; border-left: 4px solid var(--danger-color); transition: all 0.3s ease;"
                     onmouseover="this.style.transform='translateX(5px)'" 
                     onmouseout="this.style.transform=''">
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">${item.book.title}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">${item.member.name}</div>
                        <div style="font-size: 0.75rem; color: var(--danger-color);">Due: ${new Date(item.transaction.dueDate).toLocaleDateString()}</div>
                    </div>
                    <button class="btn btn-warning btn-sm" onclick="returnBook(${item.transaction.id})">
                        Return
                    </button>
                </div>
            `).join('') || '<p style="color: #6b7280; text-align: center; padding: 2rem;">No overdue books</p>';

            // Active Members
            const activeMembersData = members
                .filter(member => member.borrowedBooks.length > 0)
                .sort((a, b) => b.borrowedBooks.length - a.borrowedBooks.length)
                .slice(0, 5);

            document.getElementById('activeMembers').innerHTML = activeMembersData.map(member => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; transition: all 0.3s ease;"
                     onmouseover="this.style.background='#f9fafb'; this.style.transform='translateX(10px)'" 
                     onmouseout="this.style.background=''; this.style.transform=''">
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">${member.name}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">${member.email}</div>
                    </div>
                    <span style="font-weight: 700; color: var(--primary-color);">${member.borrowedBooks.length} books</span>
                </div>
            `).join('') || '<p style="color: #6b7280; text-align: center; padding: 2rem;">No active borrowers</p>';
        }

        function getOverdueBooks() {
            const today = new Date();
            return transactions
                .filter(transaction => 
                    transaction.type === 'borrow' && 
                    !transaction.returned && 
                    transaction.dueDate && 
                    new Date(transaction.dueDate) < today
                )
                .map(transaction => ({
                    transaction,
                    book: books.find(b => b.id === transaction.bookId),
                    member: members.find(m => m.id === transaction.memberId)
                }))
                .filter(item => item.book && item.member);
        }

        // Modal Functions
        function showAddBookModal() {
            document.getElementById('addBookModal').classList.add('show');
            document.getElementById('bookTitle').focus();
        }

        function showAddMemberModal() {
            document.getElementById('addMemberModal').classList.add('show');
            document.getElementById('memberName').focus();
        }

        function showBorrowModal(bookId) {
            currentBookId = bookId;
            
            // Populate member dropdown
            const memberSelect = document.getElementById('borrowMember');
            memberSelect.innerHTML = '<option value="">Choose a member...</option>' +
                members.map(member => `<option value="${member.id}">${member.name} (M${member.id.toString().padStart(3, '0')})</option>`).join('');
            
            document.getElementById('borrowBookModal').classList.add('show');
            memberSelect.focus();
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        // Form Handlers
        function handleAddBook(e) {
            e.preventDefault();
            
            const newBook = {
                id: Math.max(...books.map(b => b.id), 0) + 1,
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('bookAuthor').value,
                isbn: document.getElementById('bookISBN').value,
                category: document.getElementById('bookCategory').value,
                year: parseInt(document.getElementById('bookYear').value) || new Date().getFullYear(),
                publisher: document.getElementById('bookPublisher').value || 'Unknown',
                totalCopies: parseInt(document.getElementById('bookCopies').value) || 1,
                availableCopies: parseInt(document.getElementById('bookCopies').value) || 1,
                cover: getRandomBookEmoji(),
                addedDate: new Date().toISOString().split('T')[0]
            };

            books.push(newBook);
            saveData();
            
            showNotification(`📚 "${newBook.title}" added successfully!`, 'success');
            closeModal('addBookModal');
            document.getElementById('addBookForm').reset();
            renderBooks();
            updateDashboard();
        }

        function handleAddMember(e) {
            e.preventDefault();
            
            const newMember = {
                id: Math.max(...members.map(m => m.id), 0) + 1,
                name: document.getElementById('memberName').value,
                email: document.getElementById('memberEmail').value,
                phone: document.getElementById('memberPhone').value,
                address: document.getElementById('memberAddress').value,
                type: document.getElementById('memberType').value,
                joinDate: new Date().toISOString().split('T')[0],
                borrowedBooks: [],
                status: 'active'
            };

            members.push(newMember);
            saveData();
            
            showNotification(`👥 "${newMember.name}" added as member!`, 'success');
            closeModal('addMemberModal');
            document.getElementById('addMemberForm').reset();
            renderMembers();
            updateDashboard();
        }

        function handleBorrowBook(e) {
            e.preventDefault();
            
            const memberId = parseInt(document.getElementById('borrowMember').value);
            const dueDate = document.getElementById('borrowDueDate').value;
            const notes = document.getElementById('borrowNotes').value;
            
            const book = books.find(b => b.id === currentBookId);
            const member = members.find(m => m.id === memberId);
            
            if (!book || !member || book.availableCopies === 0) {
                showNotification('❌ Unable to borrow book', 'error');
                return;
            }

            // Create transaction
            const transaction = {
                id: Math.max(...transactions.map(t => t.id), 0) + 1,
                bookId: currentBookId,
                memberId: memberId,
                type: 'borrow',
                date: new Date().toISOString().split('T')[0],
                dueDate: dueDate,
                notes: notes,
                returned: false
            };

            transactions.push(transaction);
            
            // Update book availability
            book.availableCopies--;
            
            // Update member's borrowed books
            member.borrowedBooks.push({
                bookId: currentBookId,
                transactionId: transaction.id,
                borrowDate: transaction.date,
                dueDate: dueDate
            });

            saveData();
            
            showNotification(`📚 "${book.title}" borrowed by ${member.name}`, 'success');
            closeModal('borrowBookModal');
            document.getElementById('borrowBookForm').reset();
            renderBooks();
            renderMembers();
            renderTransactions();
            updateDashboard();
        }

        function returnBook(transactionId) {
            const transaction = transactions.find(t => t.id === transactionId);
            if (!transaction || transaction.returned) return;

            const book = books.find(b => b.id === transaction.bookId);
            const member = members.find(m => m.id === transaction.memberId);

            if (!book || !member) return;

            // Mark transaction as returned
            transaction.returned = true;
            transaction.returnDate = new Date().toISOString().split('T')[0];

            // Create return transaction
            const returnTransaction = {
                id: Math.max(...transactions.map(t => t.id), 0) + 1,
                bookId: transaction.bookId,
                memberId: transaction.memberId,
                type: 'return',
                date: new Date().toISOString().split('T')[0],
                originalTransactionId: transactionId
            };

            transactions.push(returnTransaction);

            // Update book availability
            book.availableCopies++;

            // Remove from member's borrowed books
            member.borrowedBooks = member.borrowedBooks.filter(b => b.transactionId !== transactionId);

            saveData();
            
            showNotification(`📖 "${book.title}" returned by ${member.name}`, 'success');
            renderBooks();
            renderMembers();
            renderTransactions();
            updateDashboard();
            updateReports();
        }

        function deleteBook(bookId) {
            if (!confirm('Are you sure you want to delete this book?')) return;
            
            const book = books.find(b => b.id === bookId);
            if (book.availableCopies < book.totalCopies) {
                showNotification('❌ Cannot delete book with active borrows', 'error');
                return;
            }

            books = books.filter(b => b.id !== bookId);
            saveData();
            
            showNotification('🗑️ Book deleted successfully', 'success');
            renderBooks();
            updateDashboard();
        }

        function deleteMember(memberId) {
            if (!confirm('Are you sure you want to delete this member?')) return;
            
            const member = members.find(m => m.id === memberId);
            if (member.borrowedBooks.length > 0) {
                showNotification('❌ Cannot delete member with active borrows', 'error');
                return;
            }

            members = members.filter(m => m.id !== memberId);
            saveData();
            
            showNotification('🗑️ Member deleted successfully', 'success');
            renderMembers();
            updateDashboard();
        }

        function generateLibraryReport() {
            const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
            const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
            const borrowedBooks = totalBooks - availableBooks;
            const overdueBooks = getOverdueBooks().length;
            const categories = [...new Set(books.map(book => book.category))];

            let report = `📊 COMPLETE LIBRARY REPORT\n`;
            report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
            
            report += `📚 BOOK STATISTICS:\n`;
            report += `Total Books: ${totalBooks}\n`;
            report += `Available: ${availableBooks}\n`;
            report += `Borrowed: ${borrowedBooks}\n`;
            report += `Overdue: ${overdueBooks}\n`;
            report += `Categories: ${categories.length}\n\n`;
            
            report += `👥 MEMBER STATISTICS:\n`;
            report += `Total Members: ${members.length}\n`;
            report += `Active Borrowers: ${members.filter(m => m.borrowedBooks.length > 0).length}\n\n`;
            
            report += `🔄 TRANSACTION STATISTICS:\n`;
            report += `Total Transactions: ${transactions.length}\n`;
            report += `Borrows: ${transactions.filter(t => t.type === 'borrow').length}\n`;
            report += `Returns: ${transactions.filter(t => t.type === 'return').length}\n\n`;
            
            report += `📖 BOOKS BY CATEGORY:\n`;
            categories.forEach(category => {
                const categoryBooks = books.filter(book => book.category === category);
                const totalInCategory = categoryBooks.reduce((sum, book) => sum + book.totalCopies, 0);
                const availableInCategory = categoryBooks.reduce((sum, book) => sum + book.availableCopies, 0);
                report += `${category}: ${totalInCategory} total (${availableInCategory} available)\n`;
            });

            // Create downloadable report
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `library-report-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('📄 Report generated and downloaded!', 'success');
        }

        function sendOverdueNotices() {
            const overdueBooks = getOverdueBooks();
            if (overdueBooks.length === 0) {
                showNotification('✅ No overdue books to notify', 'info');
                return;
            }

            // Simulate sending notices
            let notices = `📧 OVERDUE NOTICES SENT\n\n`;
            overdueBooks.forEach(item => {
                notices += `To: ${item.member.name} (${item.member.email})\n`;
                notices += `Book: ${item.book.title}\n`;
                notices += `Due Date: ${new Date(item.transaction.dueDate).toLocaleDateString()}\n`;
                notices += `Days Overdue: ${Math.ceil((new Date() - new Date(item.transaction.dueDate)) / (1000 * 60 * 60 * 24))}\n\n`;
            });

            alert(notices);
            showNotification(`📧 ${overdueBooks.length} overdue notices sent!`, 'success');
        }

        function getRandomBookEmoji() {
            const emojis = ['📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📑', '🎭', '🕊️', '👁️', '💕', '⚡', '💍', '🏜️', '🌾', '🔬', '🎨'];
            return emojis[Math.floor(Math.random() * emojis.length)];
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }, 4000);
        }

        // Additional utility functions for editing
        function editBook(bookId) {
            const book = books.find(b => b.id === bookId);
            if (!book) return;

            const newTitle = prompt('Enter new title:', book.title);
            if (newTitle && newTitle !== book.title) {
                book.title = newTitle;
                saveData();
                renderBooks();
                showNotification('✏️ Book updated successfully!', 'success');
            }
        }

        function editMember(memberId) {
            const member = members.find(m => m.id === memberId);
            if (!member) return;

            const newName = prompt('Enter new name:', member.name);
            if (newName && newName !== member.name) {
                member.name = newName;
                saveData();
                renderMembers();
                showNotification('✏️ Member updated successfully!', 'success');
            }
        }

        function viewMemberDetails(memberId) {
            const member = members.find(m => m.id === memberId);
            if (!member) return;

            let details = `👥 MEMBER DETAILS\n\n`;
            details += `ID: M${member.id.toString().padStart(3, '0')}\n`;
            details += `Name: ${member.name}\n`;
            details += `Email: ${member.email}\n`;
            details += `Phone: ${member.phone}\n`;
            details += `Type: ${member.type}\n`;
            details += `Join Date: ${new Date(member.joinDate).toLocaleDateString()}\n`;
            details += `Status: ${member.status}\n`;
            details += `Books Borrowed: ${member.borrowedBooks.length}\n\n`;

            if (member.borrowedBooks.length > 0) {
                details += `📚 CURRENTLY BORROWED BOOKS:\n`;
                member.borrowedBooks.forEach(borrowedBook => {
                    const book = books.find(b => b.id === borrowedBook.bookId);
                    if (book) {
                        details += `• ${book.title} (Due: ${new Date(borrowedBook.dueDate).toLocaleDateString()})\n`;
                    }
                });
            }

            alert(details);
        }

        function filterTransactions() {
            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;
            const transactionType = document.getElementById('transactionType').value;

            let filteredTransactions = transactions;

            if (fromDate) {
                filteredTransactions = filteredTransactions.filter(t => t.date >= fromDate);
            }

            if (toDate) {
                filteredTransactions = filteredTransactions.filter(t => t.date <= toDate);
            }

            if (transactionType) {
                filteredTransactions = filteredTransactions.filter(t => t.type === transactionType);
            }

            // Render filtered transactions
            const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            document.getElementById('transactionsTableBody').innerHTML = sortedTransactions.map(transaction => {
                const book = books.find(b => b.id === transaction.bookId);
                const member = members.find(m => m.id === transaction.memberId);
                const isOverdue = transaction.type === 'borrow' && transaction.dueDate && new Date(transaction.dueDate) < new Date();
                
                return `
                    <tr>
                        <td>${new Date(transaction.date).toLocaleDateString()}</td>
                        <td>
                            <span class="status-badge ${transaction.type === 'borrow' ? 'status-borrowed' : 'status-available'}">
                                ${transaction.type}
                            </span>
                        </td>
                        <td>${book ? book.title : 'Unknown Book'}</td>
                        <td>${member ? member.name : 'Unknown Member'}</td>
                        <td>${transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : '-'}</td>
                        <td>
                            ${transaction.type === 'borrow' && !transaction.returned ? 
                                (isOverdue ? '<span class="status-badge status-overdue">Overdue</span>' : '<span class="status-badge status-borrowed">Active</span>') :
                                '<span class="status-badge status-available">Completed</span>'
                            }
                        </td>
                    </tr>
                `;
            }).join('');

            showNotification(`📊 Filtered ${filteredTransactions.length} transactions`, 'info');
        }
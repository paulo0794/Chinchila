// DOM Elements
const categoriesTab = document.getElementById('categories-tab');
const productsTab = document.getElementById('products-tab');
const categoriesContent = document.getElementById('categories-content');
const productsContent = document.getElementById('products-content');
const categoryForm = document.getElementById('category-form');
const productForm = document.getElementById('product-form');
const categoryTable = document.getElementById('category-table');
const productTable = document.getElementById('product-table');
const categorySelect = document.getElementById('product-category');
const alertContainer = document.getElementById('alert-container');

// State
let categories = [];
let products = [];
let currentCategoryId = null;
let currentProductId = null;

// Initialize the application
async function init() {
  // Set up event listeners
  setupEventListeners();
  
  // Load initial data
  await loadCategories();
  await loadProducts();
  
  // Show categories tab by default
  showTab('categories');
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  categoriesTab.addEventListener('click', () => showTab('categories'));
  productsTab.addEventListener('click', () => showTab('products'));
  
  // Form submissions
  categoryForm.addEventListener('submit', handleCategorySubmit);
  productForm.addEventListener('submit', handleProductSubmit);
  
  // Reset forms when modal is closed
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel-btn')) {
      resetForms();
    }
  });
}

// Show the selected tab
function showTab(tabName) {
  if (tabName === 'categories') {
    categoriesTab.classList.add('active');
    productsTab.classList.remove('active');
    categoriesContent.classList.add('active');
    productsContent.classList.remove('active');
  } else {
    categoriesTab.classList.remove('active');
    productsTab.classList.add('active');
    categoriesContent.classList.remove('active');
    productsContent.classList.add('active');
  }
}

// Load categories from API
async function loadCategories() {
  try {
    categories = await API.getAllCategories();
    renderCategoryTable();
    populateCategoryDropdown();
  } catch (error) {
    showAlert('Failed to load categories', 'danger');
  }
}

// Load products from API
async function loadProducts() {
  try {
    products = await API.getAllProducts();
    renderProductTable();
  } catch (error) {
    showAlert('Failed to load products', 'danger');
  }
}

// Render category table
function renderCategoryTable() {
  const tbody = categoryTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  categories.forEach(category => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${category.id_category}</td>
      <td>${category.description}</td>
      <td>
        <button class="edit-category-btn" data-id="${category.id_category}">Edit</button>
        <button class="delete-category-btn delete" data-id="${category.id_category}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Add event listeners to buttons
  document.querySelectorAll('.edit-category-btn').forEach(btn => {
    btn.addEventListener('click', () => editCategory(btn.dataset.id));
  });
  
  document.querySelectorAll('.delete-category-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteCategory(btn.dataset.id));
  });
}

// Render product table
function renderProductTable() {
  const tbody = productTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.id_product}</td>
      <td>${product.product_description}</td>
      <td>${product.category_description}</td>
      <td>
        <button class="edit-product-btn" data-id="${product.id_product}">Edit</button>
        <button class="delete-product-btn delete" data-id="${product.id_product}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Add event listeners to buttons
  document.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', () => editProduct(btn.dataset.id));
  });
  
  document.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
}

// Populate category dropdown
function populateCategoryDropdown() {
  categorySelect.innerHTML = '<option value="">Select a category</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id_category;
    option.textContent = category.description;
    categorySelect.appendChild(option);
  });
}

// Handle category form submission
async function handleCategorySubmit(e) {
  e.preventDefault();
  
  const description = document.getElementById('category-description').value;
  
  if (!description) {
    showAlert('Please enter a category description', 'danger');
    return;
  }
  
  try {
    if (currentCategoryId) {
      // Update existing category
      await API.updateCategory(currentCategoryId, { description });
      showAlert('Category updated successfully', 'success');
    } else {
      // Create new category
      await API.createCategory({ description });
      showAlert('Category created successfully', 'success');
    }
    
    // Reset form and reload data
    resetForms();
    await loadCategories();
    await loadProducts(); // Reload products to update category names
  } catch (error) {
    showAlert('Failed to save category', 'danger');
  }
}

// Handle product form submission
async function handleProductSubmit(e) {
  e.preventDefault();
  
  const description = document.getElementById('product-description').value;
  const id_category = categorySelect.value;
  
  if (!description || !id_category) {
    showAlert('Please fill in all fields', 'danger');
    return;
  }
  
  try {
    if (currentProductId) {
      // Update existing product
      await API.updateProduct(currentProductId, { description, id_category });
      showAlert('Product updated successfully', 'success');
    } else {
      // Create new product
      await API.createProduct({ description, id_category });
      showAlert('Product created successfully', 'success');
    }
    
    // Reset form and reload data
    resetForms();
    await loadProducts();
  } catch (error) {
    showAlert('Failed to save product', 'danger');
  }
}

// Edit category
async function editCategory(id) {
  try {
    const category = await API.getCategoryById(id);
    document.getElementById('category-description').value = category.description;
    document.getElementById('category-form-title').textContent = 'Edit Category';
    document.getElementById('category-submit-btn').textContent = 'Update';
    currentCategoryId = id;
  } catch (error) {
    showAlert('Failed to load category details', 'danger');
  }
}

// Edit product
async function editProduct(id) {
  try {
    const product = await API.getProductById(id);
    document.getElementById('product-description').value = product.product_description;
    categorySelect.value = product.id_category;
    document.getElementById('product-form-title').textContent = 'Edit Product';
    document.getElementById('product-submit-btn').textContent = 'Update';
    currentProductId = id;
  } catch (error) {
    showAlert('Failed to load product details', 'danger');
  }
}

// Delete category
async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category? This will also delete all associated products.')) {
    return;
  }
  
  try {
    await API.deleteCategory(id);
    showAlert('Category deleted successfully', 'success');
    await loadCategories();
    await loadProducts();
  } catch (error) {
    showAlert('Failed to delete category', 'danger');
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  try {
    await API.deleteProduct(id);
    showAlert('Product deleted successfully', 'success');
    await loadProducts();
  } catch (error) {
    showAlert('Failed to delete product', 'danger');
  }
}

// Reset forms
function resetForms() {
  categoryForm.reset();
  productForm.reset();
  document.getElementById('category-form-title').textContent = 'Add Category';
  document.getElementById('category-submit-btn').textContent = 'Create';
  document.getElementById('product-form-title').textContent = 'Add Product';
  document.getElementById('product-submit-btn').textContent = 'Create';
  currentCategoryId = null;
  currentProductId = null;
}

// Show alert message
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  alertContainer.innerHTML = '';
  alertContainer.appendChild(alert);
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

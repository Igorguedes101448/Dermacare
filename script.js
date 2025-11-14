// User Profile Management Script

document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const profileActions = document.querySelector('.profile-actions');
    
    // Edit mode toggle
    let isEditMode = false;
    
    editBtn.addEventListener('click', function() {
        isEditMode = true;
        toggleEditMode(true);
    });
    
    saveBtn.addEventListener('click', function() {
        saveChanges();
        isEditMode = false;
        toggleEditMode(false);
    });
    
    cancelBtn.addEventListener('click', function() {
        cancelChanges();
        isEditMode = false;
        toggleEditMode(false);
    });
    
    function toggleEditMode(enabled) {
        // Toggle visibility of edit/display elements
        const displays = document.querySelectorAll('.info-display');
        const edits = document.querySelectorAll('.info-edit');
        
        displays.forEach(display => {
            display.style.display = enabled ? 'none' : 'block';
        });
        
        edits.forEach(edit => {
            edit.style.display = enabled ? 'block' : 'none';
        });
        
        // Toggle buttons
        editBtn.style.display = enabled ? 'none' : 'inline-block';
        uploadBtn.style.display = enabled ? 'inline-block' : 'none';
        profileActions.style.display = enabled ? 'block' : 'none';
    }
    
    function saveChanges() {
        // Save name
        const nameValue = document.getElementById('nameEdit').value;
        document.getElementById('nameDisplay').textContent = nameValue;
        
        // Save email
        const emailValue = document.getElementById('emailEdit').value;
        document.getElementById('emailDisplay').textContent = emailValue;
        
        // Save phone
        const phoneValue = document.getElementById('phoneEdit').value;
        document.getElementById('phoneDisplay').textContent = phoneValue;
        
        // Save date of birth
        const dobValue = document.getElementById('dobEdit').value;
        if (dobValue) {
            const date = new Date(dobValue);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            document.getElementById('dobDisplay').textContent = formattedDate;
        }
        
        // Save address
        const addressValue = document.getElementById('addressEdit').value;
        document.getElementById('addressDisplay').textContent = addressValue;
        
        // Save medical history
        const medicalValue = document.getElementById('medicalEdit').value;
        document.getElementById('medicalDisplay').textContent = medicalValue;
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
    }
    
    function cancelChanges() {
        // Restore original values from display to edit fields
        document.getElementById('nameEdit').value = document.getElementById('nameDisplay').textContent;
        document.getElementById('emailEdit').value = document.getElementById('emailDisplay').textContent;
        document.getElementById('phoneEdit').value = document.getElementById('phoneDisplay').textContent;
        document.getElementById('addressEdit').value = document.getElementById('addressDisplay').textContent;
        document.getElementById('medicalEdit').value = document.getElementById('medicalDisplay').textContent;
        
        // Convert displayed date back to YYYY-MM-DD format
        const dobText = document.getElementById('dobDisplay').textContent;
        const date = new Date(dobText);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            document.getElementById('dobEdit').value = `${year}-${month}-${day}`;
        }
        
        showNotification('Changes cancelled', 'info');
    }
    
    uploadBtn.addEventListener('click', function() {
        // Create a file input dynamically
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('profilePic').src = event.target.result;
                    showNotification('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    });
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

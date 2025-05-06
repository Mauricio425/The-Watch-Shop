// public/scripts/admin-upload.js

document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('bulk-upload-form');
    const fileInput  = document.getElementById('fileUpload');
    const resultDiv  = document.getElementById('upload-result');
    const submitBtn  = document.getElementById('upload-btn');
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      resultDiv.textContent = '';
  
      if (!fileInput.files.length) {
        resultDiv.textContent = 'Please select a file before uploading.';
        return;
      }
  
      const formData = new FormData();
      formData.append('fileUpload', fileInput.files[0]);
  
      submitBtn.disabled   = true;
      submitBtn.textContent = 'Uploading…';
  
      try {
        const res  = await fetch('/api/admin/products/bulk', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || JSON.stringify(data));
        }
  
        resultDiv.innerHTML = `
          <p style="color:green;">
            Bulk upload succeeded! Inserted <strong>${data.inserted}</strong> products.
          </p>
        `;
        form.reset();
      } catch (err) {
        console.error('Bulk upload error:', err);
        resultDiv.innerHTML = `
          <p style="color:red;">
            Upload failed: ${err.message}
          </p>
        `;
      } finally {
        submitBtn.disabled   = false;
        submitBtn.textContent = 'Upload';
      }
    });
  });
  
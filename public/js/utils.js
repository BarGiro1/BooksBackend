function jwtDecodeAndValidate(t) {
    if (!t) {
        return { valid: false, error: 'No token provided' };
    }

    try {
        let token = {
            raw: t,
            header: JSON.parse(atob(t.split('.')[0])),
            payload: JSON.parse(atob(t.split('.')[1]))
        };

        const currentTime = Math.floor(Date.now() / 1000);
        
        if (token.payload.exp && token.payload.exp < currentTime) {
            token.valid = false;
            token.error = 'Token has expired';
        } else if (token.payload.nbf && token.payload.nbf > currentTime) {
            token.valid = false;
            token.error = 'Token is not yet valid';
        } else {
            token.valid = true;
        }

        return token;
    } catch (error) {
        return { valid: false, error: 'Invalid token format' };
    }
}

function showModal(title, message) {
    // Create modal HTML
    const modalHtml = `
      <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // Remove any existing modal
    $('#modal').remove();
  
    // Append the new modal to the body
    $('body').append(modalHtml);
  
    // Initialize and show the modal using jQuery
    $('#modal').modal('show');
  }
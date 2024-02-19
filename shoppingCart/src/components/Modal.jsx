import './Modal.css'
function Modal({ isOpen, onClose, children, orientation, id }) {
  if (!isOpen) return null;

  const closeButtonClass = orientation === 'top-right' ? 'close-button-top-right' : 'close-button-default';

  return (
    <div className="modal-backdrop">
      <div className="modal-content" id={id}>
        
        {children}
        {orientation == 'close-button-default' && 
           <button className='modalCloseButton' id={closeButtonClass} onClick={onClose}>Close</button>
        }
      </div>
    </div>
  );
}

export default Modal;
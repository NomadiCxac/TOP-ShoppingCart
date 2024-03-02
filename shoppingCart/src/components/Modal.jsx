import './Modal.css'
function Modal({ isOpen, children, id }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" id={id}>
        
        {children}
      </div>
    </div>
  );
}

export default Modal;
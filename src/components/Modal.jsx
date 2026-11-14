
function Modal({ title, children, onClose }) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>

      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="بستن">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;

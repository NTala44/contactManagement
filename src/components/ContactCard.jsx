
function ContactCard({
  contact,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <div className={`contact-card ${selected ? "selected" : ""}`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(contact.id)}
        aria-label={`انتخاب ${fullName}`}/>
      <div className="contact-avatar">{initials}</div>
      <div className="contact-details">
        <h3>{fullName}</h3>
        <span>✉ {contact.email}</span>
        <span>☎ {contact.phone}</span>
      </div>

      <div className="contact-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(contact)}
          title="ویرایش">✎
        </button>

        <button
          className="remove-btn"
          onClick={() => onDelete(contact.id)}
          title="حذف">×
        </button>
      </div>
    </div>
  );
}

export default ContactCard;

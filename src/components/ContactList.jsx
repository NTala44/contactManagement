
import ContactCard from "./ContactCard";

function ContactList({
  contacts,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <div>♙</div>
        <h3>مخاطبی پیدا نشد!</h3>
        <p>عبارت دیگری جستجو کنید یا مخاطب جدیدی اضافه کنید.</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          selected={selected.includes(contact.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}/>
      ))}
    </div>
  );
}

export default ContactList;


import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import Modal from "./components/Modal";
import "./style.css";

const initialContacts = [
  {
    id: 1,
    firstName: "نورا",
    lastName: "طلا",
    email: "talanora442@gmail.com",
    phone: "09371470238",
  },
  {
    id: 2,
    firstName: "ثنا",
    lastName: "یعغوبی",
    email: "sana@gmail.com",
    phone: "09123344556",
  },
  {
    id: 3,
    firstName: "سارا",
    lastName: "کریمی",
    email: "sara@gmail.com",
    phone: "09351234567",
  },
];

function App() {
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("contacts");
      return saved ? JSON.parse(saved) : initialContacts;
    } catch {
      return initialContacts;
    }
  });

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const value = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const fullName =
        `${contact.firstName} ${contact.lastName}`.toLowerCase();

      return (
        fullName.includes(value) ||
        contact.email.toLowerCase().includes(value)
      );
    });
  }, [contacts, search]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const openAddModal = () => {
    setEditingContact(null);
    setModal("form");
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setModal("form");
  };

  const saveContact = (data) => {
    if (editingContact) {
      setContacts((prev) =>
        prev.map((item) =>
        item.id === editingContact.id
          ? { ...data, id: item.id }: item
        ));
      showToast("مخاطب با موفقیت ویرایش شد");
    } else {
      setContacts((prev) => [
        ...prev,
        { ...data, id: Date.now() },
      ]);
      showToast("مخاطب جدید اضافه شد");
    }

    setModal(null);
    setEditingContact(null);
  };

  const askDelete = (id) => {
    setModal({ type: "delete", id });
  };

  const deleteContact = () => {
    setContacts((prev) =>
      prev.filter((item) => item.id !== modal.id)
    );
    setSelected((prev) => prev.filter((id) => id !== modal.id));
    setModal(null);
    showToast("مخاطب حذف شد");
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredContacts.map((item) => item.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    }
  };

  const deleteSelected = () => {
    setContacts((prev) =>
      prev.filter((item) => !selected.includes(item.id))
    );
    setSelected([]);
    setModal(null);
    showToast("مخاطبین انتخاب شده حذف شدند");
  };

  const isAllSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((item) => selected.includes(item.id));

  return (
    <div className="app">
      <Header />
      <main className="container">
        <section className="welcome">
          <div>
            <span className="eyebrow">داشبورد مدیریت</span>
            <h1>مخاطبین شما</h1>
            <p>تمام ارتباطاتت را در یک مکان مدیریت کن.</p>
          </div>

          <button className="primary-btn" onClick={openAddModal}>
            <span>＋</span> افزودن مخاطب
          </button>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">♙</div>
            <div>
              <span>کل مخاطبین</span>
              <h2>{contacts.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">✉</div>
            <div>
              <span>مخاطبین انتخاب شده</span>
              <h2>{selected.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>نتایج جستجو</span>
              <h2>{filteredContacts.length}</h2>
            </div>
          </div>
        </section>

        <section className="contacts-section">
          <div className="section-top">
            <div>
              <h2>لیست مخاطبین</h2>
              <p>اطلاعات مخاطبین خود را مدیریت کنید.</p>
            </div>

            {selected.length > 0 && (
              <button
                className="delete-selected"
                onClick={() => setModal({ type: "bulk" })}>
                حذف انتخاب شده‌ها ({selected.length})
              </button>
            )}
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا ایمیل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}/>
              {search && (
                <button onClick={() => setSearch("")}>×</button>
              )}
            </div>

            <button
              className="select-all"
              onClick={toggleSelectAll}
              disabled={filteredContacts.length === 0}>
              {isAllSelected ? "لغو انتخاب همه" : "انتخاب همه"}
            </button>
          </div>

          <ContactList
            contacts={filteredContacts}
            selected={selected}
            onSelect={toggleSelect}
            onEdit={openEditModal}
            onDelete={askDelete}/>
        </section>
      </main>
      {modal === "form" && (
        <Modal
          title={editingContact ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
          onClose={() => setModal(null)}>
          <ContactForm
            contact={editingContact}
            contacts={contacts}
            onSave={saveContact}
            onCancel={() => setModal(null)}/>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="حذف مخاطب" onClose={() => setModal(null)}>
          <div className="confirm-content">
            <div className="warning-icon">!</div>
            <p>آیا از حذف این مخاطب اطمینان دارید؟</p>
            <span>این عملیات قابل بازگشت نیست.</span>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setModal(null)}> انصراف
              </button>
              <button className="danger-btn" onClick={deleteContact}> بله، حذف شود
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === "bulk" && (
        <Modal title="حذف گروهی مخاطبین" onClose={() => setModal(null)}>
          <div className="confirm-content">
            <div className="warning-icon">!</div>
            <p> آیا از حذف 
              {selected.length} مخاطب انتخاب شده مطمئن هستید؟
            </p>
            <span>این عملیات قابل بازگشت نیست.</span>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setModal(null)}> انصراف
              </button>
              <button className="danger-btn" onClick={deleteSelected}> حذف همه
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default App;


import { useState } from "react";

function ContactForm({ contact, contacts, onSave, onCancel }) {
  const [form, setForm] = useState({
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "نام را وارد کنید";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "نام باید حداقل 3 کاراکتر باشد";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی را وارد کنید";
    }

    if (!form.email.trim()) {
      newErrors.email = "ایمیل را وارد کنید";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }

    const duplicate = contacts.some(
      (item) =>
        item.email.toLowerCase() === form.email.trim().toLowerCase() &&
        item.id !== contact?.id
    );

    if (!newErrors.email && duplicate) {
      newErrors.email = "این ایمیل قبلاً ثبت شده است";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "شماره تماس را وارد کنید";
    } else if (!/^09\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم و با 09 شروع شود";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {e.preventDefault();
    if (validate()) {
      onSave({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });
    }
  };

  return (
    <>
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>نام</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="مثلاً علی"/>
          {errors.firstName && (
            <small>{errors.firstName}</small>
          )}
        </div>

        <div className="form-group">
          <label>نام خانوادگی</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="مثلاً محمدی"/>
          {errors.lastName && (
            <small>{errors.lastName}</small>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>آدرس ایمیل</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          dir="ltr"/>
        {errors.email && <small>{errors.email}</small>}
      </div>

      <div className="form-group">
        <label>شماره موبایل</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="09123456789"
          dir="ltr"/>
        {errors.phone && <small>{errors.phone}</small>}
      </div>

      <div className="modal-actions">
        <button type="button"
         className="cancel-btn"
         onClick={onCancel}> انصراف
        </button>

        <button type="submit" className="primary-btn">
          {contact ? "ذخیره تغییرات" : "ثبت مخاطب"}
        </button>
      </div>
    </form>
    </>
  );
}

export default ContactForm;

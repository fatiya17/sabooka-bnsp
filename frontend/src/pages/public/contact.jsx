import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt, faCommentDots, faCheck } from "@fortawesome/free-solid-svg-icons";
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "ID",
    phone: "",
    message: "",
    services: {
      pesanan: false,
      pembayaran: false,
      produk: false,
      akun: false,
      konsultasi: false,
      lainnya: false
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        services: { ...formData.services, [name]: checked }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    // user: mencegah reload halaman saat form dikirim oleh user
    e.preventDefault();
    setIsSubmitting(true);

    // 1. memetakan dan menggabungkan jenis layanan/inquiry yang dipilih user
    const selectedServices = Object.entries(formData.services)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    // 2. menyiapkan data template pesan yang akan dikirim ke admin
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone_number: `${formData.phoneCode} ${formData.phone}`,
      message: formData.message,
      services_requested: selectedServices || "Tidak ada layanan spesifik"
    };

    // 3. mengirimkan pesan contact to admin via api emailjs
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneCode: "ID",
          phone: "",
          message: "",
          services: {
            pesanan: false,
            pembayaran: false,
            produk: false,
            akun: false,
            konsultasi: false,
            lainnya: false
          }
        });
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((err) => {
        console.error("FAILED to send email:", err);
        setIsSubmitting(false);
        alert("Gagal mengirim pesan. Pastikan Service ID, Template ID, dan Public Key Anda valid.");
      });
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 bg-[#F5F5F5] overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
      {/* Gradient fade out for the grid */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA] pointer-events-none"></div>

      <div className="container-podia px-4 md:px-0 relative z-10 max-w-5xl">
        
        {/* Toast Notification */}
        {submitted && (
          <div className="fixed top-24 right-6 z-50 animate-bounce-in shadow-xl rounded-2xl overflow-hidden max-w-xs bg-white border border-black/10">
            <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                <FontAwesomeIcon icon={faCheck} className="text-[14px]" />
              </div>
              <div className="pr-2">
                <p className="text-black font-bold text-sm">Message Sent!</p>
                <p className="text-black/60 font-medium text-[11px] leading-tight mt-0.5">Please check your email shortly.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <h1 className="text-3xl md:text-[50px] font-black text-black mb-10 tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            Get in Touch
          </h1>
          <p className="text-[15px] md:text-[18px] text-black font-small">
            Have questions about your order or our collections? We're here to help. Chat with our friendly team 24/7 and get a reply in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              
              {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">First name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-black/10 focus:border-black text-black px-4 py-3 rounded-xl transition-all outline-none text-sm placeholder:text-black/30"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Last name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-black/10 focus:border-black text-black px-4 py-3 rounded-xl transition-all outline-none text-sm placeholder:text-black/30"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black/10 focus:border-black text-black px-4 py-3 rounded-xl transition-all outline-none text-sm placeholder:text-black/30"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone number</label>
                  <div className="flex border border-black/10 rounded-xl overflow-hidden focus-within:border-black transition-all bg-white">
                    <select 
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleChange}
                      className="bg-transparent text-black px-4 py-3 border-r border-black/10 outline-none text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="ID">ID</option>
                      <option value="US">US</option>
                      <option value="UK">UK</option>
                    </select>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent text-black px-4 py-3 outline-none text-sm placeholder:text-black/30"
                      placeholder="+62 (812) 000-0000"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-white border border-black/10 focus:border-black text-black px-4 py-3 rounded-xl transition-all outline-none text-sm resize-none placeholder:text-black/30"
                    placeholder="Leave us a message..."
                  ></textarea>
                </div>

                {/* Services Checkboxes */}
                <div>
                  <label className="block text-sm font-bold text-black mb-4">Inquiry Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="pesanan" checked={formData.services.pesanan} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Order status</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="pembayaran" checked={formData.services.pembayaran} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Payment issues</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="produk" checked={formData.services.produk} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Book information</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="akun" checked={formData.services.akun} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Account issues</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="konsultasi" checked={formData.services.konsultasi} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Partnerships</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="lainnya" checked={formData.services.lainnya} onChange={handleChange} className="w-5 h-5 rounded border-black/20 text-black focus:ring-black cursor-pointer accent-black" />
                      <span className="text-sm font-semibold text-black group-hover:text-black/70">Other</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A1A] text-white font-bold py-4 rounded-xl text-sm md:text-base hover:bg-black transition-all flex items-center justify-center disabled:opacity-70 podia-btn podia-btn-black"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin "></div>
                  ) : (
                    "Send message"
                  )}
                </button>
              </form>
          </div>

          {/* Contact Information (Right Sidebar) */}
          <div className="lg:col-span-5 space-y-10 lg:pl-10">
            
            {/* Chat with us */}
            <div>
              <h3 className="text-xl font-black text-black mb-2">Chat with us</h3>
              <p className="text-black/60 text-sm mb-4 font-medium">Speak directly with our friendly team.</p>
              <div className="space-y-3">
                <a href="mailto:support@sabooka.com" className="flex items-center gap-3 text-black font-bold text-sm hover:text-[#4b2aad] transition-colors group w-fit">
                  <FontAwesomeIcon icon={faEnvelope} className="text-lg text-black/80 group-hover:text-[#4b2aad]" />
                  <span className="underline decoration-2 underline-offset-4">Shoot us an email</span>
                </a>
              </div>
            </div>

            {/* Call us */}
            <div>
              <h3 className="text-xl font-black text-black mb-2">Call us</h3>
              <p className="text-black/60 text-sm mb-4 font-medium">Call our team Mon-Fri from 8am to 5pm.</p>
              <div className="space-y-3">
                <a href="tel:+6281200000000" className="flex items-center gap-3 text-black font-bold text-sm hover:text-[#4b2aad] transition-colors group w-fit">
                  <FontAwesomeIcon icon={faPhone} className="text-lg text-black/80 group-hover:text-[#4b2aad]" />
                  <span className="underline decoration-2 underline-offset-4">+62 (812) 000-0000</span>
                </a>
              </div>
            </div>

            {/* Visit us */}
            <div>
              <h3 className="text-xl font-black text-black mb-2">Visit us</h3>
              <p className="text-black/60 text-sm mb-4 font-medium">Chat with us in person at our Jakarta HQ.</p>
              <div className="space-y-3">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-black font-bold text-sm hover:text-[#4b2aad] transition-colors group w-fit">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg text-black/80 group-hover:text-[#4b2aad] mt-0.5" />
                  <span className="underline decoration-2 underline-offset-4 leading-relaxed">
                    Literacy Avenue No. 123, Reading District,<br />
                    South Jakarta, DKI Jakarta 12345
                  </span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

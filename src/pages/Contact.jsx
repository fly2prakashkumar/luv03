import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Mail,
  MessageCircle,
  MapPin,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz6Uwk_617PXrfPNAgQmXiz2KMkTa1TIfM-iosBundJ07OuT4gTH7Dp8Dopl5Eizvs/exec";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams({
        action: "inquiry",
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        date: new Date().toISOString(),
      });

      const submissionUrl = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

      // Single clean submission to Google Sheet
      await fetch(submissionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      setSubmitted(true);
    } catch (err) {
      console.warn("Contact form notice:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-transparent text-[#161311]">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}
      <section className="border-b border-[#E5DED3]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full border border-stone-300/80 bg-white/80 px-3.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#161311] shadow-sm backdrop-blur-md"
          >
            Get in touch
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tight text-[#161311] md:text-6xl"
          >
            We'd love to
            <br />
            hear from you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-lg text-sm font-medium leading-7 text-[#2B231D]"
          >
            Have a question about a ritual, your order delivery, or your
            skincare regimen? Send us a message and our team will get back to
            you within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ======================================================
          CONTACT DETAILS & FORM CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* LEFT: CONTACT DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#161311]">
                Direct Contact
              </p>

              <div className="mt-8 space-y-7">
                {/* EMAIL */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#161311] text-[#FAF7F2] shadow-sm">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#3E342B]">
                      Email Enquiries
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#161311]">
                      hello@luv03.com
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#524942]">
                      Response within 24 business hours
                    </p>
                  </div>
                </div>

                {/* SUPPORT HOURS */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#161311] text-[#FAF7F2] shadow-sm">
                    <MessageCircle size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#3E342B]">
                      Client Care Hours
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#161311]">
                      Monday – Saturday
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#524942]">
                      10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>

                {/* HEADQUARTERS */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#161311] text-[#FAF7F2] shadow-sm">
                    <MapPin size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#3E342B]">
                      Studio & Dispatch
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#161311]">
                      Luv03 Luxury Essentials
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#524942]">
                      Chennai & Bengaluru, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BRAND NOTE */}
            <div className="mt-12 rounded-2xl border border-stone-300/80 bg-white/70 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <Sparkles size={16} />
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#161311]">
                  Personal Attention
                </span>
              </div>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#3E342B]">
                Every inquiry is reviewed with dedication by our skincare
                specialists to ensure personalized recommendations.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: THE FORM (DARK HIGH-CONTRAST LABELS & INPUTS) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="rounded-[28px] border border-stone-300/80 bg-white/85 p-8 shadow-[0_16px_40px_rgba(22,19,17,0.06)] backdrop-blur-xl sm:p-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* NAME & EMAIL ROW */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#161311]">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ananya Sharma"
                        className="h-12 w-full border-b-2 border-stone-300 bg-transparent px-1 text-sm font-semibold text-[#161311] outline-none transition placeholder:font-normal placeholder:text-[#6E6359] focus:border-[#161311]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#161311]">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ananya@gmail.com"
                        className="h-12 w-full border-b-2 border-stone-300 bg-transparent px-1 text-sm font-semibold text-[#161311] outline-none transition placeholder:font-normal placeholder:text-[#6E6359] focus:border-[#161311]"
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#161311]">
                      Subject *
                    </label>
                    <input
                      required
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Order Tracking or Product Consultation"
                      className="h-12 w-full border-b-2 border-stone-300 bg-transparent px-1 text-sm font-semibold text-[#161311] outline-none transition placeholder:font-normal placeholder:text-[#6E6359] focus:border-[#161311]"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#161311]">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here in detail..."
                      className="w-full resize-none border-b-2 border-stone-300 bg-transparent px-1 py-3 text-sm font-medium leading-relaxed text-[#161311] outline-none transition placeholder:font-normal placeholder:text-[#6E6359] focus:border-[#161311]"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={isSubmitting ? {} : { y: -2 }}
                      whileTap={isSubmitting ? {} : { scale: 0.98 }}
                      disabled={isSubmitting}
                      type="submit"
                      className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#161311] px-8 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#FAF7F2] shadow-md transition-all duration-300 hover:bg-[#25201C] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-[#C5A880]" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                /* SUCCESS STATE: "MESSAGE SENT" WITH NO GOOGLE SHEET REFERENCES */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#161311] text-[#FAF7F2] shadow-lg">
                    <Check size={22} strokeWidth={2} className="text-[#C5A880]" />
                  </div>

                  <h2 className="mt-6 font-serif text-3xl font-normal text-[#161311]">
                    Message sent
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-[#2B231D]">
                    Thank you, <strong className="text-[#161311]">{formData.name}</strong>! We have received your message and will get back to you shortly at{" "}
                    <strong className="text-[#161311]">{formData.email}</strong>.
                  </p>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-full border border-[#161311] bg-transparent px-6 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#161311] transition-all duration-300 hover:bg-[#161311] hover:text-[#FAF7F2]"
                    >
                      <RefreshCw size={12} />
                      Send another message
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Contact;

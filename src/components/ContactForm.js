'use client';

import { useState } from 'react';
import styles from '../app/contact/page.module.css';

const INTENTS = {
    general: 'General inquiry',
    strategy: 'Book a strategy call',
    conversation: 'Start a project conversation',
};

export default function ContactForm({ intent }) {
    const initialReason = INTENTS[intent] ? intent : 'general';

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        reason: initialReason,
        message: '',
        _hp: '',
    });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [errorMsg, setErrorMsg] = useState('');

    function update(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    intent: form.reason,
                    message: form.message,
                    _hp: form._hp,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setErrorMsg(data.error || 'Something went wrong. Please try again.');
                return;
            }

            setStatus('success');
        } catch {
            setStatus('error');
            setErrorMsg('Network error — please check your connection and try again.');
        }
    }

    if (status === 'success') {
        return (
            <div className={styles.formCard}>
                <div className={styles.success}>
                    <span className={styles.successIcon}>✓</span>
                    <h2 className={styles.successTitle}>Message Sent</h2>
                    <p className={styles.successText}>
                        Thanks for reaching out — we&apos;ll be in touch within 24 hours.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form className={styles.formCard} onSubmit={handleSubmit}>
            {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="name">Name *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={120}
                        className={styles.formInput}
                        placeholder="Your name"
                        value={form.name}
                        onChange={update}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="email">Email *</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        className={styles.formInput}
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={update}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={30}
                        className={styles.formInput}
                        placeholder="(optional)"
                        value={form.phone}
                        onChange={update}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="reason">Reason *</label>
                    <select
                        id="reason"
                        name="reason"
                        required
                        className={styles.formSelect}
                        value={form.reason}
                        onChange={update}
                    >
                        {Object.entries(INTENTS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="message">Message *</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={3000}
                    className={styles.formTextarea}
                    placeholder="Tell us about your project, goals, or questions..."
                    value={form.message}
                    onChange={update}
                />
            </div>

            {/* Honeypot */}
            <div className={styles.hpField} aria-hidden="true">
                <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form._hp}
                    onChange={update}
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={status === 'sending'}
            >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                {status !== 'sending' && <span className={styles.submitArrow}>→</span>}
            </button>
        </form>
    );
}

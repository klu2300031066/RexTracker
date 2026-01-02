
import { X } from 'lucide-react';
import './AboutModal.css';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title">ℹ️ About Us</h2>

                <div className="modal-body">
                    <p>
                        Hello! Myself <strong>Mohith</strong>, a student at <strong>KL University</strong>.
                    </p>
                    <p>
                        This project totally runs on the frontend and stores the data in your browser.
                    </p>
                    <p>
                        It&apos;s easy and flexible to use. I would like to create more applications like this!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;

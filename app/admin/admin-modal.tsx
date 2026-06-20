"use client";

import { createPortal } from "react-dom";

type AdminModalProps = {
  children: React.ReactNode;
  description: string;
  isDanger?: boolean;
  onClose: () => void;
  title: string;
};

export function AdminModal({
  children,
  description,
  isDanger = false,
  onClose,
  title,
}: AdminModalProps) {
  return createPortal(
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className={`admin-modal${isDanger ? " admin-modal--danger" : ""}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="admin-modal-header">
          <div>
            <p className="admin-modal-kicker">Área administrativa</p>
            <h2 className="admin-modal-title">{title}</h2>
            <p className="admin-modal-text">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="admin-modal-close">
            Fechar
          </button>
        </header>
        <div className="admin-modal-body">{children}</div>
      </section>
    </div>,
    document.body
  );
}

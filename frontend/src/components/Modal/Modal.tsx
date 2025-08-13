import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

// --- Definindo os Tipos (Props) ---
interface ModalProps {
  isOpen: boolean; // Controla se o modal está visível ou não
  onClose: () => void; // Função para ser chamada quando o modal deve fechar
  children: ReactNode; // O conteúdo a ser exibido dentro do modal
  title?: string; // Um título opcional para o modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // Se o modal não estiver aberto, não renderize nada.
  if (!isOpen) {
    return null;
  }

  // Função para fechar o modal ao clicar no fundo escuro (overlay)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Verifica se o clique foi diretamente no overlay, e não no conteúdo do modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // O 'portal' do modal, que cobre a tela inteira
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {/* Renderiza o título se ele for fornecido */}
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          {/* Botão de fechar (X) */}
          <button className={styles.closeButton} onClick={onClose}>
            &times; 
          </button>
        </div>
        <div className={styles.modalBody}>
          {/* Aqui é onde o conteúdo customizado do modal será renderizado */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
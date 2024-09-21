"use client";

import { FormEvent, Fragment, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addUserEmailToProduct(productId, email);
    setIsSubmitting(false);
    setEmail('');
    closeModal();
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <Dialog open={isOpen} onClose={closeModal} className="dialog-container">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        
        <div className="min-h-screen px-4 text-center">
          <Dialog.Panel className="dialog-content">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div className="p-3 border border-gray-200 rounded-10">
                  <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    width={28}
                    height={28}
                  />
                </div>

                <button type="button" className="cursor-pointer" onClick={closeModal}>
                  <Image
                    src="/assets/icons/x-close.svg"
                    alt="close"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              <h4 className="dialog-head_text">
                Stay updated with product pricing alerts right in your inbox!
              </h4>

              <p className="text-sm text-gray-600 mt-2">
                Never miss a bargain again with our timely alerts!
              </p>
            </div>

            <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="dialog-input_container">
                <Image
                  src="/assets/icons/mail.svg"
                  alt="mail"
                  width={18}
                  height={18}
                />
                <input
                  required
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="dialog-input"
                />
              </div>

              <button type="submit" className="dialog-btn">
                {isSubmitting ? 'Submitting...' : 'Track'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
